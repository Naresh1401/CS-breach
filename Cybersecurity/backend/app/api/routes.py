"""FastAPI routes."""

import json
import logging
import random
import uuid
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.schemas import (
    AnalyzeRequest, AnalyzeResponse, AnalysisResult, HealthResponse,
    DashboardOverview, TeamAffected, AlertOut, DriftDetectionOut,
    NISTRiskOut, TrendPoint, TrendData, SimulationResult,
)
from app.models.database import get_session, Log, DriftAnalysis, Response, Alert
from app.agents.pipeline import run_pipeline
from app.services.nist_mapper import DRIFT_NIST_MAP, CONTROL_IMPACT
from app.utils.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


# ── API Key management ──────────────────────────────────────────────────────

@router.get("/api-key/status")
async def api_key_status():
    """Check whether an OpenAI API key is configured."""
    key = settings.OPENAI_API_KEY
    if key:
        masked = key[:3] + "…" + key[-4:]
    else:
        masked = ""
    return {"configured": bool(key), "masked_key": masked}


@router.post("/api-key")
async def set_api_key(body: dict):
    """Set the OpenAI API key at runtime (stored in memory only)."""
    key = body.get("api_key", "").strip()
    if not key:
        raise HTTPException(status_code=400, detail="api_key is required")
    settings.OPENAI_API_KEY = key
    return {"configured": True, "masked_key": key[:3] + "…" + key[-4:]}


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_logs(request: AnalyzeRequest, db: AsyncSession = Depends(get_session)):
    """Ingest logs, run the full drift-detection pipeline, persist results."""

    # Convert Pydantic models → dicts for the pipeline
    raw_logs = [log.model_dump(mode="json") for log in request.logs]

    # Persist raw logs
    for log_entry in request.logs:
        db_log = Log(
            source=log_entry.source,
            team_id=log_entry.team_id,
            log_type=log_entry.log_type,
            raw_data=json.dumps(log_entry.data),
            timestamp=log_entry.timestamp or datetime.utcnow(),
        )
        db.add(db_log)
    await db.commit()

    # Run LangGraph pipeline
    output = await run_pipeline(raw_logs)

    # Persist analysis results
    results: list[AnalysisResult] = []
    for r in output.get("results", []):
        # Persist drift analysis
        drift_record = DriftAnalysis(
            team_id=request.logs[0].team_id,  # team-level
            drift_type=r["drift_detected"],
            severity=r["severity"],
            confidence=r["confidence"],
            nist_controls=json.dumps(r["nist_controls_at_risk"]),
            explanation=r["explanation"],
            recommended_action=r["recommended_action"],
        )
        db.add(drift_record)

        results.append(AnalysisResult(**r))

    await db.commit()

    return AnalyzeResponse(
        results=results,
        processing_time_ms=output.get("processing_time_ms", 0.0),
    )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Return system health status."""
    db_status = "ok"
    vdb_status = "ok"

    # Check DB
    try:
        from app.models.database import async_engine
        async with async_engine.connect() as conn:
            await conn.execute(
                __import__("sqlalchemy").text("SELECT 1")
            )
    except Exception:
        db_status = "error"

    # Check Qdrant
    try:
        from qdrant_client import QdrantClient
        qc = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT, timeout=3)
        qc.get_collections()
    except Exception:
        vdb_status = "unavailable"

    return HealthResponse(
        status="healthy" if db_status == "ok" else "degraded",
        database=db_status,
        vector_db=vdb_status,
    )


# ── NIST control metadata ──────────────────────────────────────────────────

NIST_CONTROL_NAMES = {
    "AU-6": ("Audit Record Review, Analysis, and Reporting", "Audit and Accountability"),
    "CA-7": ("Continuous Monitoring", "Assessment, Authorization, and Monitoring"),
    "AC-2": ("Account Management", "Access Control"),
    "AT-2": ("Literacy Training and Awareness", "Awareness and Training"),
    "CM-3": ("Configuration Change Control", "Configuration Management"),
    "IR-6": ("Incident Reporting", "Incident Response"),
}

# Map frontend short drift names ↔ backend canonical names
_DRIFT_CANONICAL = {
    "fatigue": "Fatigue/Numbness",
    "overconfidence": "Overconfidence",
    "urgency": "Hurry/Urgency Override",
    "avoidance": "Quiet Fear/Avoidance",
    "hoarding": "Hoarding/Control Grip",
    "compliance_theater": "Compliance Theater",
}
_DRIFT_SHORT = {v: k for k, v in _DRIFT_CANONICAL.items()}


def _short_drift(canonical: str) -> str:
    return _DRIFT_SHORT.get(canonical, canonical.lower().replace("/", "_").replace(" ", "_"))


# ── Dashboard ───────────────────────────────────────────────────────────────

@router.get("/dashboard/overview", response_model=DashboardOverview)
async def get_overview(db: AsyncSession = Depends(get_session)):
    total_signals = (await db.execute(select(func.count(Log.id)))).scalar() or 0
    total_detections = (await db.execute(select(func.count(DriftAnalysis.id)))).scalar() or 0
    active_alerts = (await db.execute(
        select(func.count(Alert.id)).where(Alert.status.in_(["open", "acknowledged", "investigating"]))
    )).scalar() or 0
    early_warnings = (await db.execute(
        select(func.count(Alert.id)).where(Alert.is_early_warning == True)  # noqa: E712
    )).scalar() or 0

    # Drift distribution
    drift_rows = (await db.execute(
        select(DriftAnalysis.drift_type, func.count(DriftAnalysis.id))
        .group_by(DriftAnalysis.drift_type)
    )).all()
    drift_distribution = {_short_drift(r[0]): r[1] for r in drift_rows}

    # Severity distribution
    sev_rows = (await db.execute(
        select(DriftAnalysis.severity, func.count(DriftAnalysis.id))
        .group_by(DriftAnalysis.severity)
    )).all()
    severity_distribution = {str(r[0]): r[1] for r in sev_rows}

    # Top affected teams
    team_rows = (await db.execute(
        select(DriftAnalysis.team_id, func.count(DriftAnalysis.id))
        .group_by(DriftAnalysis.team_id)
        .order_by(func.count(DriftAnalysis.id).desc())
        .limit(5)
    )).all()
    top_affected_teams = [TeamAffected(team_id=r[0], detection_count=r[1]) for r in team_rows]

    return DashboardOverview(
        total_signals=total_signals,
        total_detections=total_detections,
        active_alerts=active_alerts,
        early_warnings=early_warnings,
        drift_distribution=drift_distribution,
        severity_distribution=severity_distribution,
        top_affected_teams=top_affected_teams,
    )


# ── Alerts ──────────────────────────────────────────────────────────────────

@router.get("/alerts", response_model=list[AlertOut])
async def get_alerts(
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_session),
):
    q = select(Alert).order_by(Alert.created_at.desc())
    if status:
        q = q.where(Alert.status == status)
    rows = (await db.execute(q)).scalars().all()
    return [
        AlertOut(
            id=str(a.id),
            team_id=a.team_id,
            drift_type=_short_drift(a.drift_type),
            severity=a.severity,
            confidence=a.confidence,
            status=a.status,
            is_early_warning=a.is_early_warning,
            response_text=a.response_text,
            affected_controls=a.get_affected_controls(),
            action_items=a.get_action_items(),
            created_at=a.created_at,
        )
        for a in rows
    ]


@router.patch("/alerts/{alert_id}")
async def update_alert_status(
    alert_id: str,
    body: dict,
    db: AsyncSession = Depends(get_session),
):
    row = (await db.execute(select(Alert).where(Alert.id == int(alert_id)))).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")
    new_status = body.get("status")
    if new_status not in ("open", "acknowledged", "investigating", "resolved", "dismissed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    row.status = new_status
    await db.commit()
    return {"ok": True}


# ── Drift Detections ────────────────────────────────────────────────────────

@router.get("/drift/detections", response_model=list[DriftDetectionOut])
async def get_drift(
    team_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_session),
):
    q = select(DriftAnalysis).order_by(DriftAnalysis.created_at.desc()).limit(200)
    if team_id:
        q = q.where(DriftAnalysis.team_id == team_id)
    rows = (await db.execute(q)).scalars().all()
    return [
        DriftDetectionOut(
            id=str(d.id),
            team_id=d.team_id,
            pattern_type=_short_drift(d.drift_type),
            severity=d.severity,
            confidence=d.confidence,
            is_early_warning=d.severity <= 2 and d.confidence > 0.3,
            explanation=d.explanation,
            recommended_action=d.recommended_action,
            nist_controls=d.get_nist_list(),
            created_at=d.created_at,
        )
        for d in rows
    ]


# ── NIST Risk ──────────────────────────────────────────────────────────────

@router.get("/nist-risk", response_model=list[NISTRiskOut])
async def get_nist_risk(db: AsyncSession = Depends(get_session)):
    rows = (await db.execute(select(DriftAnalysis))).scalars().all()
    control_data: dict[str, dict] = {}
    for d in rows:
        controls = d.get_nist_list()
        for ctrl in controls:
            if ctrl not in control_data:
                name, family = NIST_CONTROL_NAMES.get(ctrl, (ctrl, "Unknown"))
                control_data[ctrl] = {
                    "control_id": ctrl,
                    "control_name": name,
                    "family": family,
                    "detection_count": 0,
                    "max_severity": 0,
                    "associated_drifts": set(),
                }
            cd = control_data[ctrl]
            cd["detection_count"] += 1
            cd["max_severity"] = max(cd["max_severity"], d.severity)
            cd["associated_drifts"].add(_short_drift(d.drift_type))

    results = []
    for ctrl, cd in sorted(control_data.items()):
        impact = CONTROL_IMPACT.get(ctrl, 1.0)
        risk_level = min(5, max(1, round((cd["max_severity"] * 0.6) + (impact * 0.4))))
        results.append(NISTRiskOut(
            control_id=cd["control_id"],
            control_name=cd["control_name"],
            family=cd["family"],
            risk_level=risk_level,
            detection_count=cd["detection_count"],
            rationale=f"Linked to {cd['detection_count']} drift detections with max severity {cd['max_severity']}",
            associated_drifts=sorted(cd["associated_drifts"]),
        ))
    return results


# ── Trends ──────────────────────────────────────────────────────────────────

@router.get("/trends", response_model=TrendData)
async def get_trends(days: int = Query(30), db: AsyncSession = Depends(get_session)):
    since = datetime.utcnow() - timedelta(days=days)
    rows = (await db.execute(
        select(DriftAnalysis).where(DriftAnalysis.created_at >= since)
        .order_by(DriftAnalysis.created_at)
    )).scalars().all()

    daily: dict[str, list] = defaultdict(list)
    drift_breakdown: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))

    for d in rows:
        day_key = d.created_at.strftime("%Y-%m-%d")
        daily[day_key].append(d)
        drift_breakdown[day_key][_short_drift(d.drift_type)] += 1

    trend_points = []
    for day_key in sorted(daily.keys()):
        items = daily[day_key]
        trend_points.append(TrendPoint(
            date=day_key,
            total_detections=len(items),
            avg_severity=round(sum(i.severity for i in items) / len(items), 1) if items else 0,
        ))

    return TrendData(trends=trend_points, drift_breakdown=dict(drift_breakdown))


# ── Simulation ──────────────────────────────────────────────────────────────

TEAMS = ["security-ops", "dev-platform", "cloud-infra", "compliance-team", "incident-response"]

_SCENARIO_LOG_TEMPLATES: dict[str, list[dict]] = {
    "fatigue": [
        {"log_type": "audit_log", "data": {"skip_rate": 0.6, "reviews_completed": 20, "reviews_skipped": 8, "avg_review_time_min": 1.2, "findings_count": 0, "overdue_days": 10}},
        {"log_type": "incident_response", "data": {"response_time_min": 180, "severity": "medium", "escalated": False, "resolved": True, "reported": True, "incident_type": "phishing"}},
    ],
    "overconfidence": [
        {"log_type": "approval", "data": {"approved": True, "review_time_hours": 0.1, "bypassed": True, "justification_provided": False, "approver_level": "admin"}},
        {"log_type": "access_log", "data": {"access_frequency": 80, "unusual_hours": True, "privilege_level": "admin", "failed_attempts": 0, "resources_accessed": list(range(25)), "session_duration_min": 120}},
    ],
    "urgency": [
        {"log_type": "approval", "data": {"approved": True, "review_time_hours": 0.05, "bypassed": True, "justification_provided": True, "approver_level": "manager"}},
        {"log_type": "communication", "data": {"response_delay_hours": 0.5, "urgency_level": "critical", "escalation_requested": True, "channel": "slack"}},
    ],
    "avoidance": [
        {"log_type": "incident_response", "data": {"response_time_min": 300, "severity": "high", "escalated": False, "resolved": False, "reported": False, "incident_type": "data_leak"}},
        {"log_type": "communication", "data": {"response_delay_hours": 72, "urgency_level": "normal", "escalation_requested": False, "channel": "email"}},
    ],
    "hoarding": [
        {"log_type": "access_log", "data": {"access_frequency": 150, "unusual_hours": True, "privilege_level": "superadmin", "failed_attempts": 2, "resources_accessed": list(range(30)), "session_duration_min": 300}},
        {"log_type": "approval", "data": {"approved": True, "review_time_hours": 0.3, "bypassed": False, "justification_provided": True, "approver_level": "admin"}},
    ],
    "compliance_theater": [
        {"log_type": "audit_log", "data": {"skip_rate": 0.1, "reviews_completed": 50, "reviews_skipped": 0, "avg_review_time_min": 0.5, "findings_count": 0, "overdue_days": 0}},
        {"log_type": "approval", "data": {"approved": True, "review_time_hours": 0.05, "bypassed": False, "justification_provided": True, "approver_level": "manager"}},
    ],
}


@router.post("/simulate", response_model=SimulationResult)
async def run_simulation_endpoint(
    body: dict,
    db: AsyncSession = Depends(get_session),
):
    scenario = body.get("scenario", "mixed")
    num_signals = min(int(body.get("num_signals", 50)), 200)

    if scenario == "mixed":
        scenario_keys = list(_SCENARIO_LOG_TEMPLATES.keys())
    else:
        scenario_keys = [scenario] if scenario in _SCENARIO_LOG_TEMPLATES else list(_SCENARIO_LOG_TEMPLATES.keys())

    from app.models.schemas import LogEntry

    logs: list[LogEntry] = []
    for i in range(num_signals):
        sc = random.choice(scenario_keys)  # noqa: S311
        template = random.choice(_SCENARIO_LOG_TEMPLATES[sc])  # noqa: S311
        team = random.choice(TEAMS)  # noqa: S311
        log = LogEntry(
            source=f"sim_{sc}",
            team_id=team,
            log_type=template["log_type"],
            data=template["data"],
            timestamp=datetime.utcnow() - timedelta(days=random.randint(0, 29)),  # noqa: S311
        )
        logs.append(log)

    # Persist raw logs
    for log_entry in logs:
        db_log = Log(
            source=log_entry.source,
            team_id=log_entry.team_id,
            log_type=log_entry.log_type,
            raw_data=json.dumps(log_entry.data),
            timestamp=log_entry.timestamp or datetime.utcnow(),
        )
        db.add(db_log)
    await db.commit()

    # Run pipeline
    raw_logs = [l.model_dump(mode="json") for l in logs]
    output = await run_pipeline(raw_logs)

    drift_summary: dict[str, int] = defaultdict(int)
    alerts_created = 0

    for r in output.get("results", []):
        drift = DriftAnalysis(
            team_id=random.choice(TEAMS),  # noqa: S311
            drift_type=r["drift_detected"],
            severity=r["severity"],
            confidence=r["confidence"],
            nist_controls=json.dumps(r["nist_controls_at_risk"]),
            explanation=r["explanation"],
            recommended_action=r["recommended_action"],
        )
        db.add(drift)
        drift_summary[_short_drift(r["drift_detected"])] += 1

        # Create alert for severity >= 3
        if r["severity"] >= 3:
            alert = Alert(
                team_id=drift.team_id,
                drift_type=r["drift_detected"],
                severity=r["severity"],
                confidence=r["confidence"],
                status="open",
                is_early_warning=r["severity"] <= 2,
                response_text=r["explanation"],
                affected_controls=json.dumps(r["nist_controls_at_risk"]),
                action_items=json.dumps([r["recommended_action"]]),
            )
            db.add(alert)
            alerts_created += 1
        elif r["severity"] >= 1 and r["confidence"] > 0.3:
            alert = Alert(
                team_id=drift.team_id,
                drift_type=r["drift_detected"],
                severity=r["severity"],
                confidence=r["confidence"],
                status="open",
                is_early_warning=True,
                response_text=r["explanation"],
                affected_controls=json.dumps(r["nist_controls_at_risk"]),
                action_items=json.dumps([r["recommended_action"]]),
            )
            db.add(alert)
            alerts_created += 1

    await db.commit()

    return SimulationResult(
        signals_generated=num_signals,
        detections_found=len(output.get("results", [])),
        alerts_created=alerts_created,
        drift_summary=dict(drift_summary),
    )
