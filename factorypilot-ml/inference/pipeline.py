"""Unified Inference Pipeline for FactoryPilot ML.

Loads trained model artifacts and provides a clean, thread-safe interface
for all 7 industrial safety ML components.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
import pandas as pd

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from models.cross_site_pattern_detector import CrossSitePatternDetector
from models.hazard_similarity_engine import SimilarHazardEngine
from models.incident_classifier import IncidentClassifier
from models.near_miss_classifier import NearMissClassifier
from models.overdue_action_predictor import OverdueActionPredictor
from models.safety_risk_scorer import SafetyRiskScorer
from models.site_safety_trend_analyzer import SiteSafetyTrendAnalyzer

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


class SafetyMLInferencePipeline:
    """Consolidated inference coordinator for all FactoryPilot ML capabilities."""

    def __init__(self, models_dir: Optional[str] = None, auto_train_if_missing: bool = True):
        self.models_dir = models_dir or SAVED_MODELS_DIR
        self.auto_train = auto_train_if_missing

        self.incident_clf: Optional[IncidentClassifier] = None
        self.near_miss_clf: Optional[NearMissClassifier] = None
        self.similarity_engine: Optional[SimilarHazardEngine] = None
        self.cross_site_detector: Optional[CrossSitePatternDetector] = None
        self.risk_scorer: Optional[SafetyRiskScorer] = None
        self.overdue_predictor: Optional[OverdueActionPredictor] = None
        self.trend_analyzer: Optional[SiteSafetyTrendAnalyzer] = None

        self._ensure_models_loaded()

    def _ensure_models_loaded(self) -> None:
        """Load all model artifacts, auto-training if missing."""
        inc_path = os.path.join(self.models_dir, "incident_classifier.joblib")
        nm_path = os.path.join(self.models_dir, "near_miss_classifier.joblib")
        haz_path = os.path.join(self.models_dir, "hazard_similarity_engine.joblib")
        cross_path = os.path.join(self.models_dir, "cross_site_pattern_detector.joblib")
        risk_path = os.path.join(self.models_dir, "safety_risk_scorer.joblib")
        act_path = os.path.join(self.models_dir, "overdue_action_predictor.joblib")
        trend_path = os.path.join(self.models_dir, "site_safety_trend_analyzer.joblib")

        missing = any(not os.path.exists(p) for p in [inc_path, nm_path, haz_path, cross_path, risk_path, act_path, trend_path])

        if missing and self.auto_train:
            print("[InferencePipeline] One or more trained models missing. Auto-training now...")
            from training.train_all import train_entire_pipeline
            train_entire_pipeline()

        self.incident_clf = IncidentClassifier.load(inc_path)
        self.near_miss_clf = NearMissClassifier.load(nm_path)
        self.similarity_engine = SimilarHazardEngine.load(haz_path)
        self.cross_site_detector = CrossSitePatternDetector.load(cross_path)
        self.risk_scorer = SafetyRiskScorer.load(risk_path)
        self.overdue_predictor = OverdueActionPredictor.load(act_path)
        self.trend_analyzer = SiteSafetyTrendAnalyzer.load(trend_path)

    # 1. Incident Classification
    def classify_incident(self, description: str) -> Dict[str, Any]:
        """Classify safety incident narrative into category and severity."""
        return self.incident_clf.predict_single(description)

    # 2. Near-Miss Classification
    def triage_near_miss(self, description: str) -> Dict[str, Any]:
        """Triage near-miss event into root cause domain and potential severity."""
        return self.near_miss_clf.predict_single(description)

    # 3. Similar Hazard Detection
    def find_similar_hazards(
        self,
        query: str,
        top_k: int = 5,
        filter_category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieve historical similar hazards and verified solutions."""
        return self.similarity_engine.find_similar(
            query=query, top_k=top_k, filter_category=filter_category
        )

    # 4. Cross-Site Hazard Pattern Detection
    def detect_cross_site_patterns(self, custom_records_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        """Detect cross-site hazard correlation and statistical anomaly spikes."""
        if custom_records_df is None:
            from datasets.data_loader import load_incident_data
            custom_records_df, _ = load_incident_data()

        anomalies = self.cross_site_detector.detect_anomalies(custom_records_df)
        summary = self.cross_site_detector.get_cross_site_summary()

        return {
            "cross_site_anomalies": anomalies,
            "fleet_summary": summary
        }

    # 5. Safety Risk Scoring
    def predict_safety_risk(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate multi-factor safety risk score and tier."""
        return self.risk_scorer.predict_single(metrics)

    # 6. Corrective Action Overdue Prediction
    def predict_action_overdue(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """Predict deadline breach likelihood and forecasted delay for CAPA action."""
        return self.overdue_predictor.predict_single(action)

    # 7. Site-Level Safety Trend Analysis
    def analyze_site_trends(self, site_name: Optional[str] = None) -> Dict[str, Any]:
        """Retrieve longitudinal trend indicators and 30/60/90-day projections."""
        if site_name:
            return self.trend_analyzer.analyze_site(site_name)
        return self.trend_analyzer.get_fleet_report()
