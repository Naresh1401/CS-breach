"""LangGraph workflow – linear StateGraph implementing the full pipeline.

Nodes:
  input_guard → signal_processor → drift_detector → severity_scorer
  → nist_mapper → response_retriever → output_generator → output_guard
"""

from __future__ import annotations

import time
import logging
from typing import Any, TypedDict

from langgraph.graph import StateGraph, END

from app.agents.nodes import (
    input_guard,
    signal_processor,
    drift_detector,
    severity_scorer,
    nist_mapper,
    response_retriever,
    output_generator,
    output_guard,
)

logger = logging.getLogger(__name__)


class PipelineState(TypedDict, total=False):
    """Shared mutable state across all nodes."""
    raw_logs: list[dict]
    valid_logs: list[Any]
    features: list[dict]
    detections: list[dict]
    results: list[dict]
    errors: list[str]
    abort: bool


def build_pipeline() -> StateGraph:
    """Construct and compile the LangGraph pipeline."""
    graph = StateGraph(PipelineState)

    # Register nodes
    graph.add_node("input_guard", input_guard)
    graph.add_node("signal_processor", signal_processor)
    graph.add_node("drift_detector", drift_detector)
    graph.add_node("severity_scorer", severity_scorer)
    graph.add_node("nist_mapper", nist_mapper)
    graph.add_node("response_retriever", response_retriever)
    graph.add_node("output_generator", output_generator)
    graph.add_node("output_guard", output_guard)

    # Linear edges
    graph.set_entry_point("input_guard")
    graph.add_edge("input_guard", "signal_processor")
    graph.add_edge("signal_processor", "drift_detector")
    graph.add_edge("drift_detector", "severity_scorer")
    graph.add_edge("severity_scorer", "nist_mapper")
    graph.add_edge("nist_mapper", "response_retriever")
    graph.add_edge("response_retriever", "output_generator")
    graph.add_edge("output_generator", "output_guard")
    graph.add_edge("output_guard", END)

    return graph.compile()


# Module-level compiled pipeline (singleton)
pipeline = build_pipeline()


async def run_pipeline(logs: list[dict]) -> dict:
    """Execute the full pipeline and return the final state."""
    start = time.time()

    initial_state: PipelineState = {
        "raw_logs": logs,
        "valid_logs": [],
        "features": [],
        "detections": [],
        "results": [],
        "errors": [],
        "abort": False,
    }

    final_state = await pipeline.ainvoke(initial_state)
    elapsed_ms = round((time.time() - start) * 1000, 2)

    return {
        "results": final_state.get("results", []),
        "errors": final_state.get("errors", []),
        "processing_time_ms": elapsed_ms,
    }
