"""Unit tests for unified SafetyMLInferencePipeline."""

from __future__ import annotations

import os
import sys
import unittest

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from inference.pipeline import SafetyMLInferencePipeline


class TestInferencePipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pipeline = SafetyMLInferencePipeline(auto_train_if_missing=True)

    def test_classify_incident(self):
        res = self.pipeline.classify_incident(
            "Worker suffered first-degree burn touching unshielded thermal nozzle on injection mold."
        )
        self.assertIn("predicted_category", res)
        self.assertIn("predicted_severity", res)

    def test_triage_near_miss(self):
        res = self.pipeline.triage_near_miss(
            "Technician entered high noise area without hearing protection; escorted out immediately."
        )
        self.assertIn("root_cause_domain", res)
        self.assertIn("potential_severity", res)

    def test_find_similar_hazards(self):
        matches = self.pipeline.find_similar_hazards(
            "Oil leak pooling on walking corridor creating slip risk", top_k=2
        )
        self.assertIsInstance(matches, list)
        if matches:
            self.assertIn("hazard_id", matches[0])

    def test_predict_safety_risk(self):
        res = self.pipeline.predict_safety_risk({
            "site": "Site-Detroit",
            "daily_near_misses": 3,
            "daily_incidents": 1,
            "open_overdue_actions": 4,
            "vibration_anomaly_index": 1.4,
            "temperature_anomaly_index": 1.2,
            "training_compliance_pct": 78.0
        })
        self.assertIn("safety_risk_score", res)
        self.assertIn("risk_tier", res)

    def test_predict_action_overdue(self):
        res = self.pipeline.predict_action_overdue({
            "priority": "Critical",
            "action_category": "Electrical Hazard",
            "action_complexity": "Complex",
            "days_allocated": 5,
            "assignee_active_tickets": 12,
            "capex_required_usd": 15000,
            "vendor_involved": 1,
            "site": "Site-Detroit"
        })
        self.assertIn("is_overdue_risk", res)
        self.assertIn("predicted_days_delay", res)

    def test_analyze_site_trends(self):
        fleet = self.pipeline.analyze_site_trends()
        self.assertIn("monitored_site_count", fleet)
        self.assertIn("sites", fleet)


if __name__ == "__main__":
    unittest.main()
