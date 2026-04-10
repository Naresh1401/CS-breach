# DriftGuard — Human-State Drift Detection System

> **Organizational behavioral drift detection for cybersecurity.** DriftGuard identifies systemic patterns — fatigue, overconfidence, hurry, quiet fear, hoarding, and compliance theater — that precede security breaches. It detects organizational conditions, never individual behavior.

---

## Architecture

DriftGuard implements a three-layer detection-to-calibration architecture:

| Layer | Name | Function |
|-------|------|----------|
| **Layer 3** | AI Detection | NLI classification, temporal weighting, multi-agent orchestration |
| **Layer 2** | EI Revelation | Early warning engine, severity scoring, alert generation |
| **Layer 1** | NI Calibration | Narrative Intelligence response delivery (content owned by framework team) |

### Core Principles

- **No individual profiling.** Every detection is organizational-level. No employee is named, targeted, or singled out.
- **Confidence + explanation required.** Every alert includes a confidence score and plain language explanation.
- **Human review for Critical alerts.** Governance gate enforced in code — not convention.
- **180-day maximum data retention.** Hard-coded, non-configurable.
- **Immutable audit log.** Every system action is logged and cannot be modified or deleted.

---

## Six Drift Patterns

| Pattern | What It Detects |
|---------|----------------|
| **Fatigue** | Sustained workload reducing vigilance — the person isn't negligent, they're exhausted |
| **Overconfidence** | Accumulated expertise bypassing safety protocols |
| **Hurry** | Deadline pressure compressing validation into formality |
| **Quiet Fear** | Known issues going unreported because speaking up feels unsafe |
| **Hoarding** | Access and authority accumulating beyond role requirements |
| **Compliance Theater** | High audit scores coexisting with elevated breach indicators |

## NIST SP 800-53 Control Mapping

| Control | Title | Vulnerable Patterns |
|---------|-------|-------------------|
| AC-2 | Account Management | Overconfidence, Hoarding |
| AU-6 | Audit Review | Fatigue, Compliance Theater |
| IR-6 | Incident Reporting | Quiet Fear, Hurry |
| CA-7 | Continuous Monitoring | Fatigue, Compliance Theater, Hurry |
| AT-2 | Awareness Training | Compliance Theater |

---

## Project Structure

```
DriftGuard/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── config/settings.py         # Pydantic Settings configuration
│   ├── models/__init__.py         # All Pydantic data models
│   ├── db/database.py             # SQLAlchemy async ORM
│   ├── core/
│   │   ├── drift_patterns.py      # 6 immutable drift pattern definitions
│   │   ├── nist_mapping.py        # NIST SP 800-53 control mappings
│   │   ├── severity.py            # Temporal weighting & severity scoring
│   │   └── ethical_guardrails.py  # PII anonymization, transparency, retention
│   ├── pipeline/
│   │   ├── signal_ingestion.py    # Signal intake & anonymization
│   │   ├── classifier.py          # NLI-based drift classification
│   │   ├── temporal_weighting.py  # Exponential decay & acceleration
│   │   ├── agents/__init__.py     # Per-pattern LangGraph agents
│   │   └── orchestrator.py        # LangGraph state graph orchestration
│   ├── engine/
│   │   └── early_warning.py       # Watch/Warning/Critical alert engine
│   ├── calibration/
│   │   ├── content_api.py         # NI content library API
│   │   ├── rag_retrieval.py       # FAISS/Qdrant vector search
│   │   └── delivery.py            # Multi-channel delivery service
│   ├── domain/
│   │   ├── adapter.py             # YAML-driven domain adapter
│   │   └── configs/               # 6 industry vertical YAML configs
│   ├── governance/
│   │   └── approval_gates.py      # 3 governance gates + audit logger
│   ├── integrations/
│   │   ├── splunk.py              # Splunk SIEM connector
│   │   ├── sentinel.py            # Microsoft Sentinel connector
│   │   ├── cloudtrail.py          # AWS CloudTrail connector
│   │   ├── google_workspace.py    # Google Workspace connector
│   │   └── epic_emr.py            # Epic EMR FHIR connector
│   ├── api/
│   │   ├── middleware/auth.py     # JWT + SSO authentication
│   │   └── routes/                # 8 API route modules
│   └── tests/                     # pytest test suite
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # React router & layout
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      # Health score, trends, recent alerts
│   │   │   ├── AlertCenter.tsx    # Real-time alert feed with actions
│   │   │   ├── DriftMap.tsx       # Dept × pattern heatmap
│   │   │   ├── Calibration.tsx    # NI response library management
│   │   │   ├── Domains.tsx        # Domain config viewer
│   │   │   ├── Governance.tsx     # Approval gates & audit log
│   │   │   ├── Reports.tsx        # Weekly, NIST, board summaries
│   │   │   └── Onboarding.tsx     # 3-step setup wizard
│   │   └── components/
│   │       ├── Layout.tsx         # Sidebar nav + ethical banner
│   │       └── Shared.tsx         # Reusable UI components
│   └── package.json
├── ni_content/
│   ├── manifest.json              # Content library manifest
│   └── placeholders/              # Pre-approved placeholder responses
├── monitoring/
│   ├── otel-collector.yaml        # OpenTelemetry config
│   ├── prometheus.yml             # Prometheus scrape config
│   └── grafana/                   # Grafana dashboards & provisioning
├── docker-compose.yml             # Full stack deployment
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```

---

## Quick Start

### Development (Local)

```bash
# Backend
cd DriftGuard/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd DriftGuard/frontend
npm install
npm run dev
```

### Production (Docker Compose)

```bash
cd DriftGuard
docker compose up --build -d
```

Services will be available at:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8000
- **Grafana:** http://localhost:3001 (admin/driftguard)
- **Prometheus:** http://localhost:9090

---

## Role-Based Views

| Role | Dashboard View |
|------|---------------|
| **Compliance Officer** | Plain language summaries, organizational health score, trend reports |
| **CISO** | Full technical depth — NIST controls, confidence scores, risk matrices |
| **NI Architect** | Calibration content management, response effectiveness metrics |
| **Administrator** | Full system access, domain configuration, governance gates |

---

## Governance Gates

Three hard-coded governance gates enforced as system boundaries:

1. **NI Response Approval** — Every calibration response must be approved by the framework team before delivery
2. **NIST Mapping Validation** — Control mappings require validation before reports
3. **Critical Alert Human Review** — Critical alerts are held pending human approval. No exceptions.

---

## Domain Adapters

Pre-built YAML configurations for 6 industry verticals:

- **Healthcare** — HIPAA/HITECH, Epic EMR integration, clinical signal mapping
- **Finance** — SOX/PCI DSS, trading desk monitoring, audit resistance detection
- **Government** — FedRAMP/FISMA, clearance-aware thresholds
- **Retail** — PCI DSS, seasonal pattern awareness
- **Education** — FERPA, research data protection, IRB compliance
- **Enterprise** — General NIST CSF / ISO 27001 alignment

Custom domains can be added by uploading a YAML configuration file.

---

## Integration Connectors

| Connector | Platform | Protocol |
|-----------|----------|----------|
| Splunk | Splunk Enterprise/Cloud | REST API |
| Sentinel | Microsoft Sentinel | Azure Log Analytics KQL |
| CloudTrail | AWS | boto3 SDK |
| Google Workspace | Google Admin | Reports API |
| Epic EMR | Epic EHR | FHIR R4 AuditEvent |

---

## Ethical Framework

DriftGuard is built on non-negotiable ethical constraints:

- **PII anonymization at ingestion** — Personal identifiers are hashed before storage
- **Organizational-level detection only** — Patterns describe team/department conditions, not individuals
- **Permanent ethical banner** — Every screen displays the ethical constraint notice
- **Confidence and explanation required** — No alert without both
- **Human override for Critical** — Code-enforced, not policy-enforced
- **180-day maximum retention** — Data older than 180 days is automatically purged
- **Immutable audit trail** — Every action logged, no modification or deletion possible

---

## Testing

```bash
cd DriftGuard/backend
pytest -v
```

Test coverage includes:
- Ethical guardrail enforcement
- Drift pattern immutability and completeness
- NIST control cross-referencing
- Severity scoring and temporal weighting
- Signal ingestion and PII anonymization
- NLI classifier rule-based fallback
- API endpoint validation

---

## Research Foundation

DriftGuard is based on the research papers:
- **"Beyond the Breach: A Three-Layer Architecture for Human-State Drift Detection in Cybersecurity"**
- **"The Human Firewall: Detecting Behavioral Drift Before the Breach"**

Both papers are available in this repository.

---

## License

Proprietary — All rights reserved.

## Authors

Naresh — CS Breach Research Project (DS-1201)
