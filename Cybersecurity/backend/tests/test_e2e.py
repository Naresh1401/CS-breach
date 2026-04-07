"""Comprehensive end-to-end test suite."""
import requests
import json
import sys

API = "http://localhost:8000"
passed = 0
failed = 0


def test(name, method, url, payload=None, check=None, expect_status=200):
    global passed, failed
    try:
        if method == "GET":
            r = requests.get(url, timeout=10)
        else:
            r = requests.post(url, json=payload, timeout=10)

        if r.status_code != expect_status:
            if expect_status != 200:
                # We expected a non-200, got it or didn't
                if r.status_code == expect_status:
                    print(f"PASS {name} (status {r.status_code})")
                    passed += 1
                    return
            print(f"FAIL [{r.status_code}] {name}")
            try:
                print(f"  Body: {json.dumps(r.json(), indent=2)[:300]}")
            except Exception:
                print(f"  Body: {r.text[:300]}")
            failed += 1
            return

        data = r.json()
        if check and not check(data):
            print(f"FAIL [assertion] {name}")
            print(f"  Body: {json.dumps(data, indent=2)[:400]}")
            failed += 1
            return

        print(f"PASS {name}")
        passed += 1
    except Exception as e:
        print(f"FAIL [exception] {name}: {e}")
        failed += 1


# ── Health ──────────────────────────────────────────────────────────────────
test("GET /health", "GET", f"{API}/health",
     check=lambda d: d["status"] == "healthy" and d["database"] == "ok")

# ── All 6 drift types ──────────────────────────────────────────────────────
test("Fatigue/Numbness", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "ops", "log_type": "audit_log",
              "data": {"skip_rate": 0.7, "reviews_skipped": 10, "avg_review_time_min": 0.5,
                       "findings_count": 0, "overdue_days": 20}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Fatigue/Numbness")

test("Overconfidence", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "approvals", "team_id": "ops", "log_type": "approval",
              "data": {"approved": True, "review_time_hours": 0.05, "bypassed": True,
                       "justification_provided": False}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Overconfidence")

test("Hurry/Urgency Override", "POST", f"{API}/analyze",
     payload={"logs": [
         {"source": "approvals", "team_id": "ops", "log_type": "approval",
          "data": {"bypassed": True, "review_time_hours": 0.1}},
         {"source": "comms", "team_id": "ops", "log_type": "communication",
          "data": {"urgency_level": "critical", "escalation_requested": True}}
     ]},
     check=lambda d: any(r["drift_detected"] == "Hurry/Urgency Override" for r in d["results"]))

test("Quiet Fear/Avoidance", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "tickets", "team_id": "ir", "log_type": "incident_response",
              "data": {"response_time_min": 500, "severity": "critical",
                       "escalated": False, "reported": False}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Quiet Fear/Avoidance")

test("Hoarding/Control Grip", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "iam", "team_id": "ops", "log_type": "access_log",
              "data": {"access_frequency": 150, "privilege_level": "superadmin",
                       "resources_accessed": [f"r{i}" for i in range(25)]}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Hoarding/Control Grip")

test("Compliance Theater", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "ops", "log_type": "audit_log",
              "data": {"avg_review_time_min": 0.3, "findings_count": 0,
                       "reviews_completed": 25, "reviews_skipped": 0}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Compliance Theater")

# ── Guardrails ──────────────────────────────────────────────────────────────
test("Guardrail: Insufficient signal", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "comms", "team_id": "x", "log_type": "communication",
              "data": {"response_delay_hours": 1, "urgency_level": "low"}}]},
     check=lambda d: d["results"][0]["drift_detected"] == "Insufficient signal")

test("Guardrail: Invalid log_type rejected", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "x", "team_id": "y", "log_type": "bad_type", "data": {}}]},
     check=lambda d: len(d["results"]) == 0)

test("Validation: empty logs → 422", "POST", f"{API}/analyze",
     payload={"logs": []}, expect_status=422)

# ── Output format checks ───────────────────────────────────────────────────
test("NIST controls present in output", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "t", "log_type": "audit_log",
              "data": {"skip_rate": 0.8, "reviews_skipped": 12, "avg_review_time_min": 0.3,
                       "findings_count": 0, "overdue_days": 25}}]},
     check=lambda d: len(d["results"][0]["nist_controls_at_risk"]) > 0)

test("Recommended action present", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "tickets", "team_id": "t", "log_type": "incident_response",
              "data": {"response_time_min": 300, "reported": False, "escalated": False}}]},
     check=lambda d: len(d["results"][0]["recommended_action"]) > 0)

test("Processing time returned", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "t", "log_type": "audit_log",
              "data": {"skip_rate": 0.5, "reviews_skipped": 5}}]},
     check=lambda d: d["processing_time_ms"] > 0)

test("Severity in 1-5 range", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "t", "log_type": "audit_log",
              "data": {"skip_rate": 0.9, "reviews_skipped": 15, "avg_review_time_min": 0.2,
                       "findings_count": 0, "overdue_days": 30}}]},
     check=lambda d: 1 <= d["results"][0]["severity"] <= 5)

test("Confidence in 0-1 range", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "iam", "team_id": "t", "log_type": "access_log",
              "data": {"access_frequency": 200, "privilege_level": "admin",
                       "resources_accessed": [f"r{i}" for i in range(30)]}}]},
     check=lambda d: 0.0 <= d["results"][0]["confidence"] <= 1.0)

# ── Explanation present ─────────────────────────────────────────────────────
test("Explanation is non-empty", "POST", f"{API}/analyze",
     payload={"logs": [{"source": "audit", "team_id": "t", "log_type": "audit_log",
              "data": {"skip_rate": 0.6, "reviews_skipped": 8}}]},
     check=lambda d: len(d["results"][0]["explanation"]) > 0)

# ── Multi-log batch ─────────────────────────────────────────────────────────
test("Multi-log batch produces multiple results", "POST", f"{API}/analyze",
     payload={"logs": [
         {"source": "audit", "team_id": "t", "log_type": "audit_log",
          "data": {"skip_rate": 0.8, "reviews_skipped": 10, "avg_review_time_min": 0.3,
                   "findings_count": 0, "overdue_days": 20}},
         {"source": "tickets", "team_id": "t", "log_type": "incident_response",
          "data": {"response_time_min": 400, "reported": False, "escalated": False}},
     ]},
     check=lambda d: len(d["results"]) == 2)

print(f"\n{'='*40}")
print(f"Results: {passed} passed, {failed} failed out of {passed + failed}")
if failed > 0:
    sys.exit(1)
else:
    print("ALL TESTS PASSED")
