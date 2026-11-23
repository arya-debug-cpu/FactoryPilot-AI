"""Unit tests for ML models fitting, serialization, and inference."""

from __future__ import annotations

import os
import sys
import tempfile
import unittest
import pandas as pd

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import (
    load_corrective_actions_data,
    load_hazards_catalog,
    load_incident_data,
    load_near_miss_data,
    load_site_safety_metrics
)
from models.cross_site_pattern_detector import CrossSitePatternDetector
from models.hazard_similarity_engine import SimilarHazardEngine
from models.incident_classifier import IncidentClassifier
from models.near_miss_classifier import NearMissClassifier
from models.overdue_action_predictor import OverdueActionPredictor
from models.safety_risk_scorer import SafetyRiskScorer
from models.site_safety_trend_analyzer import SiteSafetyTrendAnalyzer


class TestModels(unittest.TestCase):
    def test_incident_classifier_predict_and_persistence(self):
        train_df, _ = load_incident_data()
        clf = IncidentClassifier()
        clf.fit(
            descriptions=train_df["description"].head(50).tolist(),
            categories=train_df["category"].head(50).tolist(),
            severities=train_df["severity"].head(50).tolist()
        )
        res = clf.predict_single("Hydraulic seal ruptured spraying warm oil across floor.")
        self.assertIn("predicted_category", res)
        self.assertIn("category_confidence", res)
        self.assertIn("predicted_severity", res)

        # Test persistence
        with tempfile.NamedTemporaryFile(suffix=".joblib", delete=False) as f:
            temp_path = f.name
        try:
            clf.save(temp_path)
            loaded = IncidentClassifier.load(temp_path)
            res_loaded = loaded.predict_single("Hydraulic seal ruptured spraying warm oil.")
            self.assertEqual(res["predicted_category"], res_loaded["predicted_category"])
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def test_near_miss_classifier(self):
        train_df, _ = load_near_miss_data()
        clf = NearMissClassifier()
        clf.fit(
            descriptions=train_df["description"].head(50).tolist(),
            is_near_miss_labels=train_df["is_near_miss"].head(50).astype(int).tolist(),
            domains=train_df["root_cause_domain"].head(50).tolist(),
            potential_severities=train_df["potential_severity"].head(50).tolist()
        )
        res = clf.predict_single("Emergency stop button was discovered mechanically jammed.")
        self.assertIn("is_near_miss", res)
        self.assertIn("root_cause_domain", res)
        self.assertIn("potential_severity", res)

    def test_hazard_similarity_engine(self):
        catalog = load_hazards_catalog()
        engine = SimilarHazardEngine(top_k=2)
        engine.index_catalog(catalog)
        matches = engine.find_similar("Coolant mist leak near CNC milling station", top_k=2)
        self.assertLessEqual(len(matches), 2)
        if matches:
            self.assertIn("similarity_score", matches[0])
            self.assertIn("historical_resolution", matches[0])

    def test_cross_site_pattern_detector(self):
        inc_df, _ = load_incident_data()
        detector = CrossSitePatternDetector()
        detector.fit(inc_df)
        anomalies = detector.detect_anomalies(inc_df)
        summary = detector.get_cross_site_summary()
        self.assertIsInstance(anomalies, list)
        self.assertIn("monitored_sites", summary)

    def test_safety_risk_scorer(self):
        df = load_site_safety_metrics()
        scorer = SafetyRiskScorer()
        scorer.fit(df.head(100))
        sample = df.iloc[0].to_dict()
        res = scorer.predict_single(sample)
        self.assertIn("safety_risk_score", res)
        self.assertIn("risk_tier", res)
        self.assertGreaterEqual(res["safety_risk_score"], 0.0)
        self.assertLessEqual(res["safety_risk_score"], 100.0)

    def test_overdue_action_predictor(self):
        train_df, _ = load_corrective_actions_data()
        predictor = OverdueActionPredictor()
        predictor.fit(train_df.head(100))
        sample = train_df.iloc[0].to_dict()
        res = predictor.predict_single(sample)
        self.assertIn("is_overdue_risk", res)
        self.assertIn("overdue_probability", res)
        self.assertIn("predicted_days_delay", res)

    def test_site_safety_trend_analyzer(self):
        df = load_site_safety_metrics()
        analyzer = SiteSafetyTrendAnalyzer()
        analyzer.fit(df)
        site_name = df["site"].iloc[0]
        site_res = analyzer.analyze_site(site_name)
        self.assertIn("current_7d_risk_avg", site_res)
        self.assertIn("projected_risk_scores", site_res)


if __name__ == "__main__":
    unittest.main()
