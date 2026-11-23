"""Unit tests for datasets and data loader."""

from __future__ import annotations

import os
import sys
import unittest

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


class TestDataLoader(unittest.TestCase):
    def test_load_incident_data(self):
        train_df, test_df = load_incident_data(test_size=0.2, random_state=42)
        self.assertGreater(len(train_df), 100)
        self.assertGreater(len(test_df), 20)
        self.assertIn("category", train_df.columns)
        self.assertIn("severity", train_df.columns)
        self.assertIn("description", train_df.columns)

    def test_load_near_miss_data(self):
        train_df, test_df = load_near_miss_data(test_size=0.2, random_state=42)
        self.assertGreater(len(train_df), 100)
        self.assertIn("is_near_miss", train_df.columns)
        self.assertIn("root_cause_domain", train_df.columns)
        self.assertIn("potential_severity", train_df.columns)

    def test_load_hazards_catalog(self):
        df = load_hazards_catalog()
        self.assertGreater(len(df), 50)
        self.assertIn("hazard_id", df.columns)
        self.assertIn("historical_resolution", df.columns)

    def test_load_corrective_actions_data(self):
        train_df, test_df = load_corrective_actions_data(test_size=0.2, random_state=42)
        self.assertGreater(len(train_df), 100)
        self.assertIn("is_overdue", train_df.columns)
        self.assertIn("days_delay", train_df.columns)

    def test_load_site_safety_metrics(self):
        df = load_site_safety_metrics()
        self.assertGreater(len(df), 200)
        self.assertIn("safety_risk_score", df.columns)
        self.assertIn("risk_tier", df.columns)


if __name__ == "__main__":
    unittest.main()
