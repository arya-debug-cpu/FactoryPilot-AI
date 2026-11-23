"""Corrective Action Overdue Prediction Model.

Predicts:
1. Probability of an assigned Corrective and Preventive Action (CAPA) breaching its due date.
2. Estimated delay duration (days beyond SLA).
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.pipeline import Pipeline

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.feature_engineering import extract_corrective_action_features
from preprocessing.tabular_pipeline import build_tabular_preprocessor

ACTION_NUMERIC = [
    "days_allocated",
    "assignee_active_tickets",
    "capex_required_usd",
    "ticket_load_density",
    "high_friction_flag"
]

ACTION_CATEGORICAL = [
    "priority",
    "action_category",
    "action_complexity",
    "vendor_involved",
    "capex_tier",
    "site"
]


class OverdueActionPredictor:
    """Predicts overdue likelihood and delay magnitude for EHS corrective actions."""

    def __init__(self, random_state: int = 42):
        self.random_state = random_state

        self.clf_preprocessor = build_tabular_preprocessor(ACTION_NUMERIC, ACTION_CATEGORICAL)
        self.reg_preprocessor = build_tabular_preprocessor(ACTION_NUMERIC, ACTION_CATEGORICAL)

        self.classifier = Pipeline([
            ("preprocessor", self.clf_preprocessor),
            ("clf", GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.08,
                max_depth=3,
                random_state=self.random_state
            ))
        ])

        self.regressor = Pipeline([
            ("preprocessor", self.reg_preprocessor),
            ("reg", GradientBoostingRegressor(
                n_estimators=80,
                learning_rate=0.08,
                max_depth=3,
                random_state=self.random_state
            ))
        ])

        self.is_fitted = False

    def fit(self, df: pd.DataFrame) -> OverdueActionPredictor:
        """Fit classification and delay regression models."""
        featured = extract_corrective_action_features(df)

        feature_cols = ACTION_NUMERIC + ACTION_CATEGORICAL
        X = featured[feature_cols].copy()
        y_clf = featured["is_overdue"].values
        y_reg = featured["days_delay"].values

        self.classifier.fit(X, y_clf)
        self.regressor.fit(X, y_reg)
        self.is_fitted = True
        return self

    def predict(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Predict overdue probability and expected delay."""
        if not self.is_fitted:
            raise RuntimeError("OverdueActionPredictor is not fitted yet.")

        featured = extract_corrective_action_features(df)
        feature_cols = ACTION_NUMERIC + ACTION_CATEGORICAL

        for col in feature_cols:
            if col not in featured.columns:
                raise ValueError(f"Missing column in input: {col}")

        X = featured[feature_cols].copy()

        overdue_preds = self.classifier.predict(X)
        overdue_probs = self.classifier.predict_proba(X)
        delay_preds = np.maximum(0.0, self.regressor.predict(X))

        results = []
        for i in range(len(df)):
            prob_overdue = float(overdue_probs[i][1]) if 1 in self.classifier.named_steps["clf"].classes_ else 0.5
            expected_delay = round(float(delay_preds[i]), 1) if prob_overdue > 0.4 else 0.0
            row = df.iloc[i]

            if prob_overdue < 0.25:
                risk_level = "Low"
            elif prob_overdue < 0.55:
                risk_level = "Medium"
            elif prob_overdue < 0.80:
                risk_level = "High"
            else:
                risk_level = "Critical"

            reasons = []
            if float(row.get("assignee_active_tickets", 0)) > 6:
                reasons.append("Assignee ticket saturation")
            if int(row.get("vendor_involved", 0)) == 1:
                reasons.append("External contractor / parts procurement dependency")
            if str(row.get("action_complexity", "")) == "Complex":
                reasons.append("High engineering complexity")
            if float(row.get("days_allocated", 30)) <= 7:
                reasons.append("Compressed delivery window (<7 days)")

            results.append({
                "action_id": str(row.get("action_id", f"ACT-{i}")),
                "action_title": str(row.get("action_title", "Corrective Action")),
                "is_overdue_risk": bool(overdue_preds[i] == 1 or prob_overdue > 0.5),
                "overdue_probability": round(prob_overdue, 4),
                "risk_level": risk_level,
                "predicted_days_delay": expected_delay,
                "friction_factors": reasons or ["Normal workflow pacing"],
                "mitigation_suggestion": (
                    "Reallocate work or extend deadline" if risk_level in ["High", "Critical"]
                    else "Maintain standard periodic sprint review"
                )
            })

        return results

    def predict_single(self, action_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Predict for a single action record."""
        df = pd.DataFrame([action_dict])
        return self.predict(df)[0]

    def save(self, filepath: str) -> None:
        """Serialize model to disk."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> OverdueActionPredictor:
        """Deserialize model from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
