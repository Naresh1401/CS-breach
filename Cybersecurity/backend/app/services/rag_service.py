"""RAG service – stores and retrieves NI (Non-Interventionist) calibrated responses.

Uses Qdrant as the vector database and OpenAI text-embedding-3-small for embeddings.
Falls back to a static library when Qdrant or OpenAI is unavailable.
"""

import json
import logging
from typing import Optional

from openai import AsyncOpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.utils.config import settings

logger = logging.getLogger(__name__)

# ── Static fallback NI response library ─────────────────────────────────────

NI_RESPONSE_LIBRARY: dict[str, dict[str, str]] = {
    "Fatigue/Numbness": {
        "response": (
            "The team is showing signs of alert fatigue and reduced vigilance. "
            "Workload redistribution and review simplification are recommended."
        ),
        "action": "Reduce audit queue depth. Introduce rotational review schedules. Add automated pre-filtering.",
    },
    "Overconfidence": {
        "response": (
            "Approval bypasses and insufficient justifications suggest overconfidence. "
            "Reinforce peer-review requirements and escalation gates."
        ),
        "action": "Mandate dual-approval for privileged actions. Schedule red-team exercises.",
    },
    "Hurry/Urgency Override": {
        "response": (
            "Rapid approvals under time pressure bypass established controls. "
            "Create fast-track paths that preserve critical checks."
        ),
        "action": "Implement expedited review workflows with mandatory minimum checks.",
    },
    "Quiet Fear/Avoidance": {
        "response": (
            "Under-reporting and delayed incident response indicate avoidance behaviour. "
            "Foster psychological safety and simplify reporting channels."
        ),
        "action": "Launch anonymous reporting channels. Conduct blameless post-mortems.",
    },
    "Hoarding/Control Grip": {
        "response": (
            "Excessive access retention and concentrated privileges create insider-threat risk. "
            "Enforce least-privilege and periodic access reviews."
        ),
        "action": "Run quarterly access recertification. Implement just-in-time privilege elevation.",
    },
    "Compliance Theater": {
        "response": (
            "Superficially perfect audit logs with near-zero findings suggest checkbox compliance. "
            "Shift to outcome-based auditing and spot checks."
        ),
        "action": "Add randomised deep-dive audits. Benchmark findings rate against industry norms.",
    },
}


# ── Qdrant helpers ──────────────────────────────────────────────────────────

def _get_qdrant_client() -> Optional[QdrantClient]:
    try:
        client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT, timeout=5)
        client.get_collections()  # quick connectivity check
        return client
    except Exception as e:
        logger.warning("Qdrant unavailable: %s", e)
        return None


async def _get_embedding(text: str) -> Optional[list[float]]:
    """Get embedding vector from OpenAI."""
    if not settings.OPENAI_API_KEY:
        return None
    try:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        resp = await client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=text,
        )
        return resp.data[0].embedding
    except Exception as e:
        logger.warning("Embedding call failed: %s", e)
        return None


async def seed_vector_db():
    """Seed the Qdrant collection with NI responses if it doesn't exist yet."""
    qclient = _get_qdrant_client()
    if qclient is None:
        logger.info("Skipping vector DB seed – Qdrant not available")
        return

    collection = settings.QDRANT_COLLECTION
    existing = [c.name for c in qclient.get_collections().collections]
    if collection in existing:
        logger.info("Qdrant collection '%s' already exists – skipping seed", collection)
        return

    # Create collection (dimension 1536 for text-embedding-3-small)
    qclient.create_collection(
        collection_name=collection,
        vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
    )

    points = []
    for idx, (drift_type, data) in enumerate(NI_RESPONSE_LIBRARY.items()):
        text = f"Drift: {drift_type}. {data['response']} Action: {data['action']}"
        embedding = await _get_embedding(text)
        if embedding is None:
            logger.warning("Could not embed response for %s – skipping", drift_type)
            continue
        points.append(
            PointStruct(
                id=idx,
                vector=embedding,
                payload={"drift_type": drift_type, "response": data["response"], "action": data["action"]},
            )
        )

    if points:
        qclient.upsert(collection_name=collection, points=points)
        logger.info("Seeded %d NI responses into Qdrant", len(points))


async def retrieve_response(drift_type: str, severity: int) -> dict[str, str]:
    """Retrieve the best NI response for a detected drift.

    Tries Qdrant RAG first, falls back to the static library.
    """
    # Try vector search
    query_text = f"{drift_type} severity {severity}"
    embedding = await _get_embedding(query_text)
    if embedding:
        qclient = _get_qdrant_client()
        if qclient:
            try:
                results = qclient.search(
                    collection_name=settings.QDRANT_COLLECTION,
                    query_vector=embedding,
                    limit=1,
                )
                if results:
                    payload = results[0].payload
                    return {
                        "response": payload.get("response", ""),
                        "action": payload.get("action", ""),
                    }
            except Exception as e:
                logger.warning("Qdrant search failed: %s", e)

    # Fallback to static library
    fallback = NI_RESPONSE_LIBRARY.get(drift_type, {
        "response": "No specific response available for this drift type.",
        "action": "Escalate to governance team for manual review.",
    })
    return fallback
