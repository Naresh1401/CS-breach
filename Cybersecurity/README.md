# Cybersecurity Governance AI

**AI-powered cybersecurity governance system that detects human behavioral drift patterns from organizational signals, maps them to NIST SP 800-53 controls, and generates calibrated governance responses.**

3-layer architecture: **AI Detection → EI Revelation → NI Calibration**

---

## Drift Patterns (6 types)

| Pattern                   | Indicators                                           | NIST Controls |
|---------------------------|------------------------------------------------------|---------------|
| **Fatigue/Numbness**       | Skipped reviews, slow response, alert fatigue        | AU-6, CA-7    |
| **Overconfidence**         | Bypassed protocols, excess privilege use             | AC-2, AT-2    |
| **Hurry/Urgency Override** | Shortcuts under pressure, rapid approvals            | CM-3, CA-7    |
| **Quiet Fear/Avoidance**   | Under-reporting, delayed responses                   | IR-6          |
| **Hoarding/Control Grip**  | Excessive access retention                          | AC-2          |
| **Compliance Theater**     | Checkbox behavior, zero findings                     | AU-6, CA-7    |

## Pipeline (LangGraph)

```text
input_guard → signal_processor → drift_detector → severity_scorer
→ nist_mapper → response_retriever → output_generator → output_guard
```

**Hybrid detection:** Rule-based baseline + GPT-4o-mini LLM classification (weighted 40/60).

## Tech Stack

**Backend:** Python 3.11, FastAPI, SQLAlchemy (async), SQLite/PostgreSQL, LangGraph, Qdrant, OpenAI API

**Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Recharts

**Infrastructure:** Docker Compose, Qdrant vector DB

## Quick Start

### Local Development

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install && npm run dev
```

### Docker

```bash
# Set OpenAI key (optional – rules-only mode works without it)
export OPENAI_API_KEY=sk-...

docker-compose up -d
# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

## API Endpoints

| Method | Endpoint    | Description                                      |
|--------|-------------|--------------------------------------------------|
| POST   | `/analyze`  | Ingest logs and run full drift detection pipeline |
| GET    | `/health`   | System health check                              |

### POST /analyze – Example

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [{
      "source": "audit_system",
      "team_id": "security-ops",
      "log_type": "audit_log",
      "data": {"skip_rate": 0.6, "reviews_skipped": 8, "avg_review_time_min": 1.2, "findings_count": 0, "overdue_days": 14}
    }]
  }'
```

### Response Format

```json
{
  "results": [{
    "drift_detected": "Fatigue/Numbness",
    "severity": 4,
    "confidence": 0.82,
    "nist_controls_at_risk": ["AU-6", "CA-7"],
    "explanation": "Pattern of skipped audits and delayed responses indicates fatigue.",
    "recommended_action": "Reduce audit load and increase review depth."
  }],
  "processing_time_ms": 7.2
}
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── agents/            # LangGraph pipeline & nodes
│   │   ├── api/               # FastAPI routes
│   │   ├── models/            # SQLAlchemy models, Pydantic schemas
│   │   ├── services/          # Drift detector, scorer, NIST mapper, RAG
│   │   └── utils/             # Config, guardrails
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # React components
│   │   └── lib/               # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Guardrails

- **No individual tracking** — team-level insights only
- **Confidence threshold** — results below 0.6 return "Insufficient signal"
- **Explainability** — every result includes reasoning and action items
