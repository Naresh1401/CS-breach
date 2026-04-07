"""Feature extraction from raw log entries.

Normalizes heterogeneous log payloads into a uniform feature dict
that downstream drift detection can consume.
"""

from app.models.schemas import LogEntry


def extract_features(log: LogEntry) -> dict:
    """Extract behavioural features from a single log entry.

    Returns a flat dict with signal-type-specific features,
    all keyed for the drift detector to consume.
    """
    data = log.data
    features: dict = {
        "team_id": log.team_id,
        "source": log.source,
        "log_type": log.log_type,
    }

    if log.log_type == "audit_log":
        features.update({
            "audit_skip_rate": _safe_float(data, "skip_rate", 0.0),
            "reviews_completed": _safe_int(data, "reviews_completed", 0),
            "reviews_skipped": _safe_int(data, "reviews_skipped", 0),
            "avg_review_time_min": _safe_float(data, "avg_review_time_min", 5.0),
            "findings_count": _safe_int(data, "findings_count", 1),
            "overdue_days": _safe_int(data, "overdue_days", 0),
        })

    elif log.log_type == "access_log":
        features.update({
            "access_frequency": _safe_int(data, "access_frequency", 0),
            "unusual_hours": _safe_bool(data, "unusual_hours"),
            "privilege_level": data.get("privilege_level", "user"),
            "failed_attempts": _safe_int(data, "failed_attempts", 0),
            "resources_accessed": data.get("resources_accessed", []),
            "session_duration_min": _safe_float(data, "session_duration_min", 0.0),
        })

    elif log.log_type == "incident_response":
        features.update({
            "response_time_min": _safe_float(data, "response_time_min", 30.0),
            "severity": data.get("severity", "medium"),
            "escalated": _safe_bool(data, "escalated"),
            "resolved": _safe_bool(data, "resolved"),
            "reported": _safe_bool(data, "reported", default=True),
            "incident_type": data.get("incident_type", "unknown"),
        })

    elif log.log_type == "communication":
        features.update({
            "response_delay_hours": _safe_float(data, "response_delay_hours", 1.0),
            "urgency_level": data.get("urgency_level", "normal"),
            "escalation_requested": _safe_bool(data, "escalation_requested"),
            "channel": data.get("channel", "email"),
        })

    elif log.log_type == "approval":
        features.update({
            "approved": _safe_bool(data, "approved", default=True),
            "review_time_hours": _safe_float(data, "review_time_hours", 2.0),
            "bypassed": _safe_bool(data, "bypassed"),
            "justification_provided": _safe_bool(data, "justification_provided", default=True),
            "approver_level": data.get("approver_level", "manager"),
        })

    return features


def extract_features_batch(logs: list[LogEntry]) -> list[dict]:
    """Extract features from a batch of logs."""
    return [extract_features(log) for log in logs]


# ── helpers ─────────────────────────────────────────────────────────────────

def _safe_float(d: dict, key: str, default: float = 0.0) -> float:
    try:
        return float(d.get(key, default))
    except (ValueError, TypeError):
        return default


def _safe_int(d: dict, key: str, default: int = 0) -> int:
    try:
        return int(d.get(key, default))
    except (ValueError, TypeError):
        return default


def _safe_bool(d: dict, key: str, default: bool = False) -> bool:
    val = d.get(key, default)
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ("true", "1", "yes")
    return bool(val)
