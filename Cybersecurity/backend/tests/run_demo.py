"""Run all scenarios and print formatted output."""
import requests
import json

API = "http://localhost:8000"
SEP = "═" * 56


def run(title, subtitle, payload):
    print(f"\n{SEP}")
    print(f"  {title}")
    print(f"  {subtitle}")
    print(SEP)
    r = requests.post(f"{API}/analyze", json=payload, timeout=10)
    print(json.dumps(r.json(), indent=2))


# 1. Health
print(SEP)
print("  1. HEALTH CHECK")
print(SEP)
r = requests.get(f"{API}/health", timeout=5)
print(json.dumps(r.json(), indent=2))

# 2. Fatigue
run("2. FATIGUE/NUMBNESS", "High skip rate, fast reviews, zero findings", {
    "logs": [{"source": "audit_system", "team_id": "security-ops", "log_type": "audit_log",
              "data": {"skip_rate": 0.7, "reviews_skipped": 10, "avg_review_time_min": 0.5,
                       "findings_count": 0, "overdue_days": 20}}]
})

# 3. Overconfidence
run("3. OVERCONFIDENCE", "Bypassed approval, no justification", {
    "logs": [{"source": "approval_system", "team_id": "dev-ops", "log_type": "approval",
              "data": {"approved": True, "review_time_hours": 0.05, "bypassed": True,
                       "justification_provided": False}}]
})

# 4. Quiet Fear
run("4. QUIET FEAR / AVOIDANCE", "Unreported critical incident, no escalation", {
    "logs": [{"source": "ticketing", "team_id": "incident-response", "log_type": "incident_response",
              "data": {"response_time_min": 500, "severity": "critical", "escalated": False,
                       "reported": False, "incident_type": "data_breach"}}]
})

# 5. Hoarding
run("5. HOARDING / CONTROL GRIP", "Superadmin, 25+ resources, high frequency", {
    "logs": [{"source": "iam", "team_id": "platform-eng", "log_type": "access_log",
              "data": {"access_frequency": 150, "privilege_level": "superadmin",
                       "resources_accessed": [f"db{i}" for i in range(25)],
                       "failed_attempts": 5}}]
})

# 6. Compliance Theater
run("6. COMPLIANCE THEATER", "Ultra-fast reviews, zero findings, mass completions", {
    "logs": [{"source": "audit_tool", "team_id": "compliance-team", "log_type": "audit_log",
              "data": {"avg_review_time_min": 0.3, "findings_count": 0,
                       "reviews_completed": 30, "reviews_skipped": 0}}]
})

# 7. Hurry/Urgency
run("7. HURRY / URGENCY OVERRIDE", "Bypassed + fast approval + critical comms", {
    "logs": [
        {"source": "change_mgmt", "team_id": "release-team", "log_type": "approval",
         "data": {"bypassed": True, "review_time_hours": 0.1, "approved": True}},
        {"source": "slack", "team_id": "release-team", "log_type": "communication",
         "data": {"urgency_level": "critical", "escalation_requested": True}}
    ]
})

# 8. Guardrail: Insufficient signal
run("8. GUARDRAIL: INSUFFICIENT SIGNAL", "Normal communication, nothing suspicious", {
    "logs": [{"source": "email", "team_id": "general", "log_type": "communication",
              "data": {"response_delay_hours": 1, "urgency_level": "low"}}]
})

# 9. Multi-log batch
run("9. MULTI-LOG BATCH (3 signals → 3 detections)", "Fatigue + Hoarding + Avoidance", {
    "logs": [
        {"source": "audit", "team_id": "team-alpha", "log_type": "audit_log",
         "data": {"skip_rate": 0.8, "reviews_skipped": 12, "avg_review_time_min": 0.2,
                  "findings_count": 0, "overdue_days": 25}},
        {"source": "iam", "team_id": "team-alpha", "log_type": "access_log",
         "data": {"access_frequency": 200, "privilege_level": "superadmin",
                  "resources_accessed": [f"r{i}" for i in range(25)]}},
        {"source": "tickets", "team_id": "team-alpha", "log_type": "incident_response",
         "data": {"response_time_min": 400, "reported": False, "escalated": False}}
    ]
})

print(f"\n{SEP}")
print("  ALL SCENARIOS COMPLETE")
print(SEP)
