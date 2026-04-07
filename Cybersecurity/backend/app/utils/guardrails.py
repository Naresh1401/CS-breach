"""Output guardrails – confidence gating and explainability checks."""

from app.models.schemas import AnalysisResult


def apply_guardrails(result: dict, threshold: float = 0.6) -> dict:
    """Enforce confidence threshold and ensure explainability.

    If confidence < threshold, replace the output with an
    'Insufficient signal' message so the system never over-claims.
    """
    confidence = result.get("confidence", 0.0)

    if confidence < threshold:
        return {
            "drift_detected": "Insufficient signal",
            "severity": 0,
            "confidence": round(confidence, 4),
            "nist_controls_at_risk": [],
            "explanation": (
                f"Confidence {confidence:.2f} is below the threshold "
                f"of {threshold}. Not enough evidence to classify drift."
            ),
            "recommended_action": "Continue monitoring. Collect more signals.",
        }

    # Ensure all required fields are present and explainable
    required = [
        "drift_detected",
        "severity",
        "confidence",
        "nist_controls_at_risk",
        "explanation",
        "recommended_action",
    ]
    for field in required:
        if field not in result or result[field] is None:
            result[field] = "N/A"

    return result
