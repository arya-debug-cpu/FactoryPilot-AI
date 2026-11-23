"""Unit tests for preprocessing and feature engineering."""

from __future__ import annotations

import os
import sys
import unittest
import pandas as pd

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.text_preprocessor import IndustrialTextPreprocessor, preprocess_safety_text
from preprocessing.tabular_pipeline import build_tabular_preprocessor
from preprocessing.feature_engineering import (
    compute_safety_pyramid_ratio,
    extract_corrective_action_features,
    extract_site_trend_features
)


class TestPreprocessing(unittest.TestCase):
    def setUp(self):
        self.preprocessor = IndustrialTextPreprocessor()

    def test_text_cleaning_and_acronym_expansion(self):
        raw = "Operator neglected PPE while servicing CNC spindle with E-Stop disengaged!"
        cleaned = self.preprocessor.clean_text(raw)
        # Verify acronym expansion
        self.assertIn("personal protective equipment", cleaned)
        self.assertIn("emergency stop", cleaned)
        self.assertNotIn("!", cleaned)

    def test_tabular_pipeline_build(self):
        pipe = build_tabular_preprocessor(
            numeric_features=["score", "count"],
            categorical_features=["site"]
        )
        df = pd.DataFrame({
            "score": [10.5, 20.0, None],
            "count": [1, 2, 3],
            "site": ["Detroit", "Munich", "Detroit"]
        })
        transformed = pipe.fit_transform(df)
        self.assertEqual(transformed.shape[0], 3)
        self.assertGreater(transformed.shape[1], 2)

    def test_heinrich_safety_ratio(self):
        ratio = compute_safety_pyramid_ratio(near_misses=30, incidents=2)
        self.assertEqual(ratio, 15.0)

    def test_corrective_action_feature_extraction(self):
        df = pd.DataFrame([{
            "assignee_active_tickets": 10,
            "days_allocated": 5,
            "capex_required_usd": 6000,
            "priority": "Critical",
            "vendor_involved": 1,
            "action_complexity": "Complex"
        }])
        featured = extract_corrective_action_features(df)
        self.assertIn("ticket_load_density", featured.columns)
        self.assertIn("capex_tier", featured.columns)
        self.assertEqual(featured["capex_tier"].iloc[0], "Major")
        self.assertEqual(featured["high_friction_flag"].iloc[0], 3)


if __name__ == "__main__":
    unittest.main()
