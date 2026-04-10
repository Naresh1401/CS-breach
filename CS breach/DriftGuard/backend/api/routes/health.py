"""Health and system status endpoints."""
from __future__ import annotations

from fastapi import APIRouter

from core.ethical_guardrails import ETHICAL_BANNER

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check():
    return {
        "status": "healthy",
        "service": "DriftGuard",
        "ethical_banner": ETHICAL_BANNER,
    }


@router.get("/ethical-statement")
async def get_ethical_statement():
    """Returns the permanent ethical statement.

    This statement must appear on the dashboard home screen permanently
    and cannot be removed by any configuration.
    """
    return {"statement": ETHICAL_BANNER}
