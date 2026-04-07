"""Drift detection – Hybrid: rule-based baseline + LLM classification.

The 6 canonical drift types:
  1. Fatigue/Numbness
  2. Overconfidence
  3. Hurry/Urgency Override
  4. Quiet Fear/Avoidance
  5. Hoarding/Control Grip
  6. Compliance Theater
"""

import json
import logging
from typing import Optional

from openai import AsyncOpenAI

from app.utils.config import settings

logger = logging.getLogger(__name__)

DRIFT_TYPES = [
    "Fatigue/Numbness",
    "Overconfidence",
    "Hurry/Urgency Override",
    "Quiet Fear/Avoidance",
    "Hoarding/Control Grip",
    "Compliance Theater",
]

# ── Rule-based baseline ────────────────────────────────────────────────────

def rule_based_detect(features: dict) -> dict[str, float]:
    """Return a dict of drift_type → probability based on simple rules.

    Each rule nudges a drift probability from 0 toward 1.
    Multiple matching rules accumulate (capped at 1.0).
    """
    scores: dict[str, float] = {d: 0.0 for d in DRIFT_TYPES}
    lt = features.get("log_type", "")

    # ── Fatigue/Numbness ──────────────────────────────────────────────────
    if lt == "audit_log":
        if features.get("audit_skip_rate", 0) > 0.3:
            scores["Fatigue/Numbness"] += 0.4
        if features.get("avg_review_time_min", 5) < 2:
            scores["Fatigue/Numbness"] += 0.2
        if features.get("overdue_days", 0) > 7:
            scores["Fatigue/Numbness"] += 0.2
        if features.get("reviews_skipped", 0) > 3:
            scores["Fatigue/Numbness"] += 0.2
    if lt == "incident_response":
        if features.get("response_time_min", 0) > 120:
            scores["Fatigue/Numbness"] += 0.3

    # ── Overconfidence ────────────────────────────────────────────────────
    if lt == "approval":
        if features.get("bypassed", False):
            scores["Overconfidence"] += 0.4
        if not features.get("justification_provided", True):
            scores["Overconfidence"] += 0.2
        if features.get("review_time_hours", 2) < 0.5:
            scores["Overconfidence"] += 0.2
    if lt == "access_log":
        if features.get("privilege_level", "") in ("admin", "superadmin"):
            scores["Overconfidence"] += 0.15
        if features.get("access_frequency", 0) > 50:
            scores["Overconfidence"] += 0.15

    # ── Hurry/Urgency Override ────────────────────────────────────────────
    if lt == "approval":
        if features.get("bypassed", False) and features.get("review_time_hours", 2) < 0.25:
            scores["Hurry/Urgency Override"] += 0.7
        elif features.get("review_time_hours", 2) < 0.15:
            scores["Hurry/Urgency Override"] += 0.3
    if lt == "communication":
        if features.get("urgency_level", "") in ("high", "critical"):
            scores["Hurry/Urgency Override"] += 0.4
        if features.get("escalation_requested", False):
            scores["Hurry/Urgency Override"] += 0.2
    if lt == "incident_response":
        if features.get("response_time_min", 30) < 5:
            scores["Hurry/Urgency Override"] += 0.2

    # ── Quiet Fear/Avoidance ──────────────────────────────────────────────
    if lt == "incident_response":
        if not features.get("reported", True):
            scores["Quiet Fear/Avoidance"] += 0.5
        if features.get("response_time_min", 0) > 240:
            scores["Quiet Fear/Avoidance"] += 0.3
        if not features.get("escalated", True):
            scores["Quiet Fear/Avoidance"] += 0.2
    if lt == "communication":
        if features.get("response_delay_hours", 0) > 48:
            scores["Quiet Fear/Avoidance"] += 0.3
    if lt == "audit_log":
        if features.get("reviews_skipped", 0) > 5 and features.get("findings_count", 1) == 0:
            scores["Quiet Fear/Avoidance"] += 0.3

    # ── Hoarding/Control Grip ─────────────────────────────────────────────
    if lt == "access_log":
        if features.get("privilege_level", "") in ("admin", "superadmin"):
            scores["Hoarding/Control Grip"] += 0.3
        resources = features.get("resources_accessed", [])
        if isinstance(resources, list) and len(resources) > 20:
            scores["Hoarding/Control Grip"] += 0.3
        if features.get("access_frequency", 0) > 100:
            scores["Hoarding/Control Grip"] += 0.2
    if lt == "approval":
        if features.get("approver_level", "") == "admin":
            scores["Hoarding/Control Grip"] += 0.2

    # ── Compliance Theater ────────────────────────────────────────────────
    if lt == "audit_log":
        if features.get("avg_review_time_min", 5) < 1:
            scores["Compliance Theater"] += 0.4
        if features.get("findings_count", 1) == 0 and features.get("reviews_completed", 0) > 10:
            scores["Compliance Theater"] += 0.4
    if lt == "approval":
        if features.get("review_time_hours", 2) < 0.1 and features.get("approved", False):
            scores["Compliance Theater"] += 0.3

    # Clamp all values to [0, 1]
    return {k: min(v, 1.0) for k, v in scores.items()}


# ── LLM-based classification ───────────────────────────────────────────────

_SYSTEM_PROMPT = """You are a cybersecurity behavioral analyst. Given structured signals from an organizational team, classify the probability of each of these 6 behavioural drift patterns:

1. Fatigue/Numbness – alert fatigue, skipped reviews, reduced vigilance
2. Overconfidence – bypassed protocols, excessive self-trust
3. Hurry/Urgency Override – shortcuts under time pressure
4. Quiet Fear/Avoidance – under-reporting, delayed responses
5. Hoarding/Control Grip – excessive access retention
6. Compliance Theater – superficial compliance, checkbox behavior

Return ONLY valid JSON with this exact structure (no markdown):
{
  "probabilities": {
    "Fatigue/Numbness": <float 0-1>,
    "Overconfidence": <float 0-1>,
    "Hurry/Urgency Override": <float 0-1>,
    "Quiet Fear/Avoidance": <float 0-1>,
    "Hoarding/Control Grip": <float 0-1>,
    "Compliance Theater": <float 0-1>
  },
  "reasoning": "<one-paragraph explanation>"
}"""


async def llm_classify(features: dict) -> Optional[dict]:
    """Call GPT-4o-mini to classify drift probabilities.

    Returns None if the API key is not set or the call fails.
    """
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set – skipping LLM classification")
        return None

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    # Sanitize features for the prompt (remove team_id for privacy)
    safe_features = {k: v for k, v in features.items() if k != "team_id"}

    try:
        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            temperature=0.1,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(safe_features, default=str)},
            ],
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        logger.error("LLM classification failed: %s", e)
        return None


# ── Hybrid combiner ────────────────────────────────────────────────────────

async def detect_drift(features: dict) -> dict:
    """Run hybrid detection: combine rule-based and LLM scores.

    Returns:
        {
            "probabilities": {drift_type: float, ...},
            "top_drift": str | None,
            "confidence": float,
            "reasoning": str,
        }
    """
    rule_scores = rule_based_detect(features)
    llm_result = await llm_classify(features)

    if llm_result and "probabilities" in llm_result:
        # Weighted average: 40% rules, 60% LLM
        llm_probs = llm_result["probabilities"]
        combined = {}
        for dt in DRIFT_TYPES:
            r = rule_scores.get(dt, 0.0)
            l = float(llm_probs.get(dt, 0.0))
            combined[dt] = round(r * 0.4 + l * 0.6, 4)
        reasoning = llm_result.get("reasoning", "Hybrid rule + LLM classification.")
    else:
        # Fallback: rules only
        combined = rule_scores
        reasoning = "Rule-based classification (LLM unavailable)."

    # Find top drift
    top_drift = max(combined, key=combined.get)
    confidence = combined[top_drift]

    return {
        "probabilities": combined,
        "top_drift": top_drift if confidence > 0 else None,
        "confidence": round(confidence, 4),
        "reasoning": reasoning,
    }
