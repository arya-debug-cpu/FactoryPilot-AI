"""Standalone FastAPI Microservice for FactoryPilot ML.

NOTE: This service runs on PORT 8001 completely isolated from the existing
FactoryPilot backend (PORT 8000). It makes ZERO modifications to existing routes.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from inference.pipeline import SafetyMLInferencePipeline

app = FastAPI(
    title="FactoryPilot Safety ML Engine API",
    version="1.0.0",
    description="Isolated ML inference service for industrial safety intelligence, hazard triage, and predictive risk scoring."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global pipeline instance initialized on startup
pipeline: Optional[SafetyMLInferencePipeline] = None


@app.on_event("startup")
def startup_event():
    global pipeline
    pipeline = SafetyMLInferencePipeline()


# --------------------------------------------------------------------------- #
# Pydantic Request Models
# --------------------------------------------------------------------------- #
class IncidentRequest(BaseModel):
    description: str = Field(..., example="Hydraulic seal blew out on CNC-Milling-01 causing pressurized oil spray.")


class NearMissRequest(BaseModel):
    description: str = Field(..., example="Emergency stop button on conveyor was found stuck behind safety guard.")


class SimilarHazardRequest(BaseModel):
    query: str = Field(..., example="Operator slipped on pooling oil near stamping press.")
    top_k: int = Field(default=3, ge=1, le=20)
    filter_category: Optional[str] = None


class SafetyRiskRequest(BaseModel):
    site: str = Field(default="Site-Detroit")
    daily_near_misses: int = Field(default=2, ge=0)
    daily_incidents: int = Field(default=0, ge=0)
    open_overdue_actions: int = Field(default=1, ge=0)
    vibration_anomaly_index: float = Field(default=1.0)
    temperature_anomaly_index: float = Field(default=1.0)
    training_compliance_pct: float = Field(default=92.0, ge=0.0, le=100.0)
    date: Optional[str] = Field(default="2026-11-16")


class ActionOverdueRequest(BaseModel):
    action_id: Optional[str] = "ACT-001"
    action_title: str = "Install light curtain guard"
    priority: str = Field(default="High", pattern="^(Low|Medium|High|Critical)$")
    action_category: str = Field(default="Machinery / Mechanical")
    action_complexity: str = Field(default="Moderate", pattern="^(Simple|Moderate|Complex)$")
    days_allocated: int = Field(default=14, ge=1)
    assignee_active_tickets: int = Field(default=5, ge=0)
    capex_required_usd: float = Field(default=1500.0, ge=0.0)
    vendor_involved: int = Field(default=0, ge=0, le=1)
    site: str = Field(default="Site-Detroit")


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "factorypilot-ml-engine",
        "pipeline_initialized": pipeline is not None
    }


@app.post("/api/ml/incident/classify")
def classify_incident(req: IncidentRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.classify_incident(req.description)


@app.post("/api/ml/near-miss/triage")
def triage_near_miss(req: NearMissRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.triage_near_miss(req.description)


@app.post("/api/ml/hazards/similar")
def find_similar_hazards(req: SimilarHazardRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.find_similar_hazards(
        query=req.query, top_k=req.top_k, filter_category=req.filter_category
    )


@app.get("/api/ml/hazards/cross-site-patterns")
def get_cross_site_patterns():
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.detect_cross_site_patterns()


@app.post("/api/ml/risk/score")
def calculate_risk_score(req: SafetyRiskRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.predict_safety_risk(req.dict())


@app.post("/api/ml/actions/overdue-risk")
def predict_action_overdue_risk(req: ActionOverdueRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.predict_action_overdue(req.dict())


@app.get("/api/ml/trends/site/{site_name}")
def get_site_trend(site_name: str):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    try:
        return pipeline.analyze_site_trends(site_name)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/ml/trends/fleet")
def get_fleet_trends():
    if not pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not ready")
    return pipeline.analyze_site_trends(None)


if __name__ == "__main__":
    import uvicorn
    # Dedicated port 8001
    uvicorn.run("inference.api_service:app", host="127.0.0.1", port=8001, reload=False)
