"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.models.database import init_db
from app.services.rag_service import seed_vector_db
from app.utils.config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("Starting %s …", settings.APP_NAME)

    # Create database tables
    await init_db()
    logger.info("Database initialised")

    # Seed vector DB with NI responses
    await seed_vector_db()
    logger.info("Vector DB seeded")

    yield  # app is running

    logger.info("Shutting down …")


app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered cybersecurity governance – detects human behavioral drift and maps to NIST controls.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(router)
