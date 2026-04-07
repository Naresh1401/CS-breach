"""Severity scoring service.

Computes a severity score (1-5) from:
  - frequency  : how often this drift pattern appeared in recent signals
  - trend      : whether severity is escalating or stable
  - impact     : NIST control sensitivity weight
"""


def compute_severity(
    confidence: float,
    frequency: int = 1,
    trend: str = "stable",      # "escalating" | "stable" | "improving"
    impact_weight: float = 1.0,  # derived from NIST control risk level
) -> int:
    """Return an integer severity 1-5.

    Formula:
      base = confidence * 5
      freq_bonus = min(frequency / 5, 1.0)       # caps at 5 occurrences
      trend_mod  = +0.5 escalating, -0.5 improving, 0 stable
      raw = (base * 0.4) + (freq_bonus * 5 * 0.3) + (impact_weight * 0.3) + trend_mod
      severity = clamp(round(raw), 1, 5)
    """
    base = confidence * 5.0
    freq_bonus = min(frequency / 5.0, 1.0) * 5.0
    trend_mod = {"escalating": 0.5, "improving": -0.5}.get(trend, 0.0)

    raw = (base * 0.4) + (freq_bonus * 0.3) + (impact_weight * 0.3) + trend_mod
    severity = max(1, min(5, round(raw)))
    return severity
