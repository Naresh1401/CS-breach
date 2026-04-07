"""SQLAlchemy ORM models and async engine setup.

Tables:
  - logs              : raw ingested log entries
  - drift_analyses    : detected drift events with severity & NIST mapping
  - responses         : NI calibration responses stored for audit trail
"""

import datetime
import json
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text, Boolean, create_engine
)
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.utils.config import settings

# ── Async engine ────────────────────────────────────────────────────────────
async_engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

# ── Sync engine (for Alembic / scripts) ────────────────────────────────────
sync_engine = create_engine(settings.DATABASE_URL_SYNC, echo=False)

Base = declarative_base()


# ── Models ──────────────────────────────────────────────────────────────────

class Log(Base):
    """Raw log entry ingested from organizational systems."""
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(128), nullable=False)          # e.g. "siem", "audit_system"
    team_id = Column(String(64), nullable=False)
    log_type = Column(String(64), nullable=False)          # access_log, audit_log, etc.
    raw_data = Column(Text, nullable=False)                # JSON string of original payload
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    def set_raw(self, data: dict):
        self.raw_data = json.dumps(data)

    def get_raw(self) -> dict:
        return json.loads(self.raw_data) if self.raw_data else {}


class DriftAnalysis(Base):
    """A single drift detection result."""
    __tablename__ = "drift_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(String(64), nullable=False)
    drift_type = Column(String(64), nullable=False)
    severity = Column(Integer, nullable=False)              # 1-5
    confidence = Column(Float, nullable=False)
    nist_controls = Column(Text, nullable=False)            # JSON list
    explanation = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def get_nist_list(self) -> list[str]:
        return json.loads(self.nist_controls) if self.nist_controls else []


class Response(Base):
    """Stored NI calibration response for audit trail."""
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    drift_type = Column(String(64), nullable=False)
    severity = Column(Integer, nullable=False)
    response_text = Column(Text, nullable=False)
    action_items = Column(Text, nullable=False)             # JSON list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Alert(Base):
    """Governance alert generated from drift detections."""
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(String(64), nullable=False)
    drift_type = Column(String(64), nullable=False)
    severity = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    status = Column(String(32), nullable=False, default="open")
    is_early_warning = Column(Boolean, nullable=False, default=False)
    response_text = Column(Text, nullable=False, default="")
    affected_controls = Column(Text, nullable=False, default="[]")  # JSON list
    action_items = Column(Text, nullable=False, default="[]")       # JSON list
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def get_affected_controls(self) -> list[str]:
        return json.loads(self.affected_controls) if self.affected_controls else []

    def get_action_items(self) -> list[str]:
        return json.loads(self.action_items) if self.action_items else []


# ── DB lifecycle helpers ────────────────────────────────────────────────────

async def init_db():
    """Create all tables (safe to call repeatedly)."""
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:
    """Yield an async session for dependency injection."""
    async with AsyncSessionLocal() as session:
        yield session
