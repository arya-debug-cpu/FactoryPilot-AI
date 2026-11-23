"""Safety Risk Scoring Model.

Predicts a composite safety risk score (0-100) and risk tier (LOW, MEDIUM, HIGH, CRITICAL)
based on multi-factor plant telemetry, near-miss density, training compliance,
and open corrective action friction.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.tabular_pipeline import build_tabular_preprocessor

NUMERIC_FEATURES = [
    "daily_near_misses",
    "daily_incidents",
    "open_overdue_actions",
    "vibration_anomaly_index",
    "temperature_anomaly_index",
    "training_compliance_pct"
]

CATEGORICAL_FEATURES = ["site"]


def determine_risk_tier(score: float) -> str:
    """Map continuous safety risk score (0-100) to operational risk tier."""
    if score < 25.0:
        return "LOW"
    elif score < 50.0:
        return "MEDIUM"
    elif score < 75.0:
        return "HIGH"
    return "CRITICAL"


class SafetyRiskScorer:
    """Predictive regressor for facility safety risk scoring."""

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.numeric_features = NUMERIC_FEATURES
        self.categorical_features = CATEGORICAL_FEATURES

        self.preprocessor = build_tabular_preprocessor(
            self.numeric_features, self.categorical_features
        )

        self.regressor = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.08,
            max_depth=4,
            random_state=self.random_state
        )

        self.pipeline = Pipeline([
            ("preprocessor", self.preprocessor),
            ("regressor", self.regressor)
        ])

        self.is_fitted = False

    def fit(self, df: pd.DataFrame, target_col: str = "safety_risk_score") -> SafetyRiskScorer:
        """Fit risk scoring pipeline on historical site metrics."""
        feature_cols = self.numeric_features + self.categorical_features
        X = df[feature_cols].copy()
        y = df[target_col].values

        self.pipeline.fit(X, y)
        self.is_fitted = True
        return self

    def predict(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Score rows in input dataframe."""
        if not self.is_fitted:
            raise RuntimeError("SafetyRiskScorer is not fitted yet.")

        feature_cols = self.numeric_features + self.categorical_features
        for col in feature_cols:
            if col not in df.columns:
                raise ValueError(f"Input dataframe missing required column: {col}")

        X = df[feature_cols].copy()
        raw_scores = self.pipeline.predict(X)
        clamped_scores = np.clip(raw_scores, 0.0, 100.0)

        results = []
        for i in range(len(df)):
            score = float(clamped_scores[i])
            tier = determine_risk_tier(score)
            row = df.iloc[i]

            drivers = []
            if float(row.get("open_overdue_actions", 0)) > 2:
                drivers.append("Elevated overdue corrective actions")
            if float(row.get("training_compliance_pct", 100)) < 85:
                drivers.append("Sub-optimal training compliance (<85%)")
            if float(row.get("vibration_anomaly_index", 0)) > 1.2:
                drivers.append("Machine vibration anomalies detected")
            if float(row.get("daily_incidents", 0)) > 0:
                drivers.append("Active incident reported in current window")

            if not drivers:
                drivers.append("Routine operational variance within standard safety envelope")

            results.append({
                "site": str(row.get("site", "Unknown")),
                "date": str(row.get("date", "N/A")),
                "safety_risk_score": round(score, 2),
                "risk_tier": tier,
                "primary_risk_drivers": drivers,
                "action_recommended": tier in ["HIGH", "CRITICAL"]
            })

        return results

    def predict_single(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Convenience method for a single metrics record."""
        df = pd.DataFrame([metrics])
        return self.predict(df)[0]

    def save(self, filepath: str) -> None:
        """Serialize model to disk."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> SafetyRiskScorer:
        """Deserialize model from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
