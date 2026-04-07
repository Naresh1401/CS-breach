"""Static NIST SP 800-53 control mapping for each drift type."""

# Drift type → list of NIST controls at risk
DRIFT_NIST_MAP: dict[str, list[str]] = {
    "Fatigue/Numbness":       ["AU-6", "CA-7"],
    "Overconfidence":         ["AC-2", "AT-2"],
    "Hurry/Urgency Override": ["CM-3", "CA-7"],
    "Quiet Fear/Avoidance":   ["IR-6"],
    "Hoarding/Control Grip":  ["AC-2"],
    "Compliance Theater":     ["AU-6", "CA-7"],
}

# Impact weight per control (higher = more critical)
CONTROL_IMPACT: dict[str, float] = {
    "IR-6": 5.0,
    "AC-2": 4.0,
    "AU-6": 3.0,
    "CA-7": 4.0,
    "AT-2": 3.0,
    "CM-3": 3.5,
}


def map_to_nist(drift_type: str) -> list[str]:
    """Return NIST controls at risk for a given drift type."""
    return DRIFT_NIST_MAP.get(drift_type, [])


def get_impact_weight(drift_type: str) -> float:
    """Return the max impact weight across the controls for a drift type."""
    controls = map_to_nist(drift_type)
    if not controls:
        return 1.0
    return max(CONTROL_IMPACT.get(c, 1.0) for c in controls)
