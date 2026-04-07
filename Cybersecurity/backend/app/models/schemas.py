"""Pydantic schemas for request/response validation."""

from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Request schemas ─────────────────────────────────────────────────────────

class LogEntry(BaseModel):
    """A single log entry sent by an organizational system."""
    source: str = Field(..., description="Origin system, e.g. 'siem', 'audit_tool'")
    team_id: str = Field(..., description="Team identifier (no individual tracking)")
    log_type: str = Field(..., description="access_log | audit_log | incident_response | communication | approval")
    data: dict = Field(..., description="Raw log payload")
    timestamp: Optional[datetime] = None


class AnalyzeRequest(BaseModel):
    """POST /analyze request body – one or more log entries."""
    logs: list[LogEntry] = Field(..., min_length=1, max_length=500)


# ── Response schemas ────────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    """Structured output for a single drift detection."""
    drift_detected: str
    severity: int = Field(ge=0, le=5)
    confidence: float = Field(ge=0.0, le=1.0)
    nist_controls_at_risk: list[str]
    explanation: str
    recommended_action: str


class AnalyzeResponse(BaseModel):
    """Full response from POST /analyze."""
    results: list[AnalysisResult]
    processing_time_ms: float


class HealthResponse(BaseModel):
    """GET /health response."""
    status: str
    version: str = "1.0.0"
    database: str = "ok"
    vector_db: str = "ok"


# ── Dashboard / Alert / Drift / NIST / Trend schemas ───────────────────────

class TeamAffected(BaseModel):
    team_id: str
    detection_count: int

class DashboardOverview(BaseModel):
    total_signals: int = 0
    total_detections: int = 0
    active_alerts: int = 0
    early_warnings: int = 0
    drift_distribution: dict[str, int] = {}
    severity_distribution: dict[str, int] = {}
    top_affected_teams: list[TeamAffected] = []

class AlertOut(BaseModel):
    id: str
    team_id: str
    drift_type: str
    severity: int
    confidence: float
    status: str
    is_early_warning: bool
    response_text: str
    affected_controls: list[str]
    action_items: list[str]
    created_at: datetime

class DriftDetectionOut(BaseModel):
    id: str
    team_id: str
    pattern_type: str
    severity: int
    confidence: float
    is_early_warning: bool
    explanation: str
    recommended_action: str
    nist_controls: list[str]
    created_at: datetime

class NISTRiskOut(BaseModel):
    control_id: str
    control_name: str
    family: str
    risk_level: int
    detection_count: int
    rationale: str
    associated_drifts: list[str]

class TrendPoint(BaseModel):
    date: str
    total_detections: int
    avg_severity: float

class TrendData(BaseModel):
    trends: list[TrendPoint]
    drift_breakdown: dict[str, dict[str, int]]

class SimulationResult(BaseModel):
    signals_generated: int
    detections_found: int
    alerts_created: int
    drift_summary: dict[str, int]
