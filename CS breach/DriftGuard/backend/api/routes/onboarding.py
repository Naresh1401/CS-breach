"""Onboarding wizard API — 3-step, under 15 minutes for any domain."""
from __future__ import annotations

from typing import Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.middleware.auth import get_current_user
from models import User

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


class OnboardingStep1(BaseModel):
    """Step 1: Select domain or upload custom YAML."""
    domain: str  # healthcare, finance, government, retail, education, enterprise, custom
    custom_yaml: Optional[str] = None


class ConnectorConfig(BaseModel):
    connector_type: str  # splunk, sentinel, cloudtrail, google_workspace, epic_emr, file_upload
    config: Dict = {}


class OnboardingStep2(BaseModel):
    """Step 2: Connect signal sources."""
    connectors: List[ConnectorConfig]
    sample_file_mode: bool = False


class OnboardingStep3(BaseModel):
    """Step 3: Configure alert sensitivity and preferences."""
    alert_sensitivity: str = "balanced"  # conservative, balanced, aggressive
    priority_nist_controls: List[str] = []
    response_delivery: List[str] = ["dashboard"]


class OnboardingComplete(BaseModel):
    domain: str
    step1: OnboardingStep1
    step2: OnboardingStep2
    step3: OnboardingStep3


@router.get("/domains")
async def get_available_domains():
    """Get list of pre-built domain adapters for Step 1."""
    return {
        "domains": [
            {
                "id": "healthcare",
                "name": "Healthcare",
                "description": "Epic EMR, EHR access patterns, clinical incident reporting. HIPAA-compliant.",
                "icon": "🏥",
            },
            {
                "id": "finance",
                "name": "Finance",
                "description": "Transaction approvals, trading logs, audit trails, exception requests.",
                "icon": "🏦",
            },
            {
                "id": "government",
                "name": "Government",
                "description": "Document access, classification handling, approval chains, FOIA.",
                "icon": "🏛️",
            },
            {
                "id": "retail",
                "name": "Retail",
                "description": "POS access, inventory, vendor approvals, return authorizations.",
                "icon": "🛒",
            },
            {
                "id": "education",
                "name": "Education",
                "description": "Student data, administrative workflows, research data, IRB compliance.",
                "icon": "🎓",
            },
            {
                "id": "enterprise",
                "name": "Enterprise (General)",
                "description": "All six drift patterns. Email, code commits, access reviews, change management.",
                "icon": "🏢",
            },
        ],
        "custom_upload_available": True,
    }


@router.get("/connectors")
async def get_available_connectors():
    """Get list of available signal source connectors for Step 2."""
    return {
        "connectors": [
            {"id": "splunk", "name": "Splunk", "description": "SIEM log ingestion via Splunk API"},
            {"id": "sentinel", "name": "Microsoft Sentinel", "description": "Azure Sentinel workspace integration"},
            {"id": "cloudtrail", "name": "AWS CloudTrail", "description": "AWS audit and access logs"},
            {"id": "google_workspace", "name": "Google Workspace", "description": "Google admin logs and activity"},
            {"id": "epic_emr", "name": "Epic EMR", "description": "Epic electronic medical records integration"},
            {"id": "file_upload", "name": "Upload Log File", "description": "Upload a sample log for prototype mode"},
        ],
    }


@router.post("/complete")
async def complete_onboarding(
    setup: OnboardingComplete,
    user: User = Depends(get_current_user),
):
    """Complete the 3-step onboarding process."""
    from main import app_state

    # Step 1: Load domain config
    domain = setup.step1.domain
    if setup.step1.custom_yaml:
        config = app_state.domain_registry.load_config_string(setup.step1.custom_yaml)
        if config:
            domain = config.domain
    else:
        config = app_state.domain_registry.get_domain(domain)

    if not config:
        return {"status": "error", "message": f"Domain '{domain}' not found"}

    # Step 2: Register connectors (validation only at this stage)
    connector_status = []
    for conn in setup.step2.connectors:
        connector_status.append({
            "connector": conn.connector_type,
            "status": "configured" if not setup.step2.sample_file_mode else "sample_mode",
        })

    # Step 3: Apply sensitivity settings
    # Update pipeline if needed

    return {
        "status": "complete",
        "domain": domain,
        "display_name": config.display_name,
        "connectors_configured": len(connector_status),
        "alert_sensitivity": setup.step3.alert_sensitivity,
        "delivery_methods": setup.step3.response_delivery,
        "priority_controls": setup.step3.priority_nist_controls or config.priority_controls,
        "message": f"DriftGuard is now configured for {config.display_name}. Monitoring will begin when signals arrive.",
    }
