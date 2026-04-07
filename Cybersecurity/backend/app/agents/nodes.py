"""Individual LangGraph node functions.

Each node operates on a shared PipelineState TypedDict and
returns a partial update dict that LangGraph merges in.
"""

import json
import logging
from typing import Any

from app.services.feature_extractor import extract_features_batch
from app.services.drift_detector import detect_drift
from app.services.severity_scorer import compute_severity
from app.services.nist_mapper import map_to_nist, get_impact_weight
from app.services.rag_service import retrieve_response
from app.utils.guardrails import apply_guardrails
from app.utils.config import settings
from app.models.schemas import LogEntry

logger = logging.getLogger(__name__)


# ── 1. input_guard ──────────────────────────────────────────────────────────

async def input_guard(state: dict) -> dict:
    """Validate input format. Reject invalid data."""
    raw_logs: list[dict] = state.get("raw_logs", [])
    valid_logs: list[LogEntry] = []
    errors: list[str] = []

    for i, log in enumerate(raw_logs):
        try:
            entry = LogEntry(**log) if isinstance(log, dict) else log
            if entry.log_type not in (
                "access_log", "audit_log", "incident_response",
                "communication", "approval",
            ):
                errors.append(f"Log {i}: unsupported log_type '{entry.log_type}'")
                continue
            valid_logs.append(entry)
        except Exception as e:
            errors.append(f"Log {i}: validation error – {e}")

    if not valid_logs:
        return {
            "valid_logs": [],
            "features": [],
            "errors": errors or ["No valid logs provided."],
            "abort": True,
        }

    return {"valid_logs": valid_logs, "errors": errors, "abort": False}


# ── 2. signal_processor ────────────────────────────────────────────────────

async def signal_processor(state: dict) -> dict:
    """Normalize logs and extract features."""
    if state.get("abort"):
        return {}

    valid_logs: list[LogEntry] = state["valid_logs"]
    features = extract_features_batch(valid_logs)
    return {"features": features}


# ── 3. drift_detector ──────────────────────────────────────────────────────

async def drift_detector(state: dict) -> dict:
    """Hybrid rule + LLM drift classification across all features."""
    if state.get("abort"):
        return {}

    features_list: list[dict] = state["features"]
    detections: list[dict] = []

    for feat in features_list:
        result = await detect_drift(feat)
        result["team_id"] = feat.get("team_id", "unknown")
        detections.append(result)

    return {"detections": detections}


# ── 4. severity_scorer ─────────────────────────────────────────────────────

async def severity_scorer(state: dict) -> dict:
    """Compute severity for each detection."""
    if state.get("abort"):
        return {}

    detections: list[dict] = state["detections"]
    scored: list[dict] = []

    for det in detections:
        drift = det.get("top_drift")
        if not drift:
            det["severity"] = 0
            scored.append(det)
            continue

        impact = get_impact_weight(drift)
        # frequency: count how many detections share the same drift type
        freq = sum(1 for d in detections if d.get("top_drift") == drift)
        severity = compute_severity(
            confidence=det["confidence"],
            frequency=freq,
            impact_weight=impact,
        )
        det["severity"] = severity
        scored.append(det)

    return {"detections": scored}


# ── 5. nist_mapper ─────────────────────────────────────────────────────────

async def nist_mapper(state: dict) -> dict:
    """Map each detection to NIST controls."""
    if state.get("abort"):
        return {}

    detections: list[dict] = state["detections"]
    for det in detections:
        drift = det.get("top_drift")
        det["nist_controls"] = map_to_nist(drift) if drift else []

    return {"detections": detections}


# ── 6. response_retriever ──────────────────────────────────────────────────

async def response_retriever(state: dict) -> dict:
    """Retrieve NI-calibrated response via RAG for each detection."""
    if state.get("abort"):
        return {}

    detections: list[dict] = state["detections"]
    for det in detections:
        drift = det.get("top_drift")
        if drift:
            resp = await retrieve_response(drift, det.get("severity", 1))
            det["response_text"] = resp.get("response", "")
            det["recommended_action"] = resp.get("action", "")
        else:
            det["response_text"] = ""
            det["recommended_action"] = "Continue monitoring."

    return {"detections": detections}


# ── 7. output_generator ────────────────────────────────────────────────────

async def output_generator(state: dict) -> dict:
    """Build structured AnalysisResult dicts from detections."""
    if state.get("abort"):
        return {
            "results": [],
            "errors": state.get("errors", ["Pipeline aborted."]),
        }

    detections: list[dict] = state["detections"]
    results: list[dict] = []

    for det in detections:
        result = {
            "drift_detected": det.get("top_drift", "None"),
            "severity": det.get("severity", 0),
            "confidence": det.get("confidence", 0.0),
            "nist_controls_at_risk": det.get("nist_controls", []),
            "explanation": det.get("reasoning", ""),
            "recommended_action": det.get("recommended_action", ""),
        }
        results.append(result)

    return {"results": results}


# ── 8. output_guard ────────────────────────────────────────────────────────

async def output_guard(state: dict) -> dict:
    """Enforce confidence threshold and ensure explainability."""
    results: list[dict] = state.get("results", [])
    guarded: list[dict] = []

    for r in results:
        guarded.append(apply_guardrails(r, threshold=settings.CONFIDENCE_THRESHOLD))

    return {"results": guarded}
