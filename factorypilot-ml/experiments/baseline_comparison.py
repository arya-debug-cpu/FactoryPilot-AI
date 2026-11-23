"""Compares trained models against baseline heuristics and dummy models.

Demonstrates model lift over random chance and majority class baselines.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict
from sklearn.dummy import DummyClassifier, DummyRegressor

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_incident_data, load_site_safety_metrics
from evaluation.evaluate_all import evaluate_incident_classifier, evaluate_safety_risk_scorer
from evaluation.metrics import compute_classification_metrics, compute_regression_metrics


def run_baseline_comparison() -> Dict[str, Any]:
    """Execute head-to-head comparison between dummy baselines and trained models."""
    print("[Comparison] Evaluating Incident Classifier vs Majority-Class Dummy...")
    train_inc, test_inc = load_incident_data()
    dummy_clf = DummyClassifier(strategy="most_frequent")
    dummy_clf.fit(train_inc["description"], train_inc["category"])
    dummy_preds = dummy_clf.predict(test_inc["description"])
    dummy_inc_metrics = compute_classification_metrics(test_inc["category"].tolist(), dummy_preds)

    trained_inc_results = evaluate_incident_classifier()
    inc_cat_metrics = trained_inc_results["category_metrics"]

    print("[Comparison] Evaluating Risk Scorer vs Mean Regressor Dummy...")
    metrics_df = load_site_safety_metrics()
    train_risk = metrics_df.groupby("site").head(150)
    test_risk = metrics_df.groupby("site").tail(30)

    dummy_reg = DummyRegressor(strategy="mean")
    dummy_reg.fit(train_risk[["daily_near_misses", "daily_incidents"]], train_risk["safety_risk_score"])
    dummy_risk_preds = dummy_reg.predict(test_risk[["daily_near_misses", "daily_incidents"]])
    dummy_reg_metrics = compute_regression_metrics(test_risk["safety_risk_score"].values, dummy_risk_preds)

    trained_risk_results = evaluate_safety_risk_scorer()
    trained_risk_metrics = trained_risk_results["regression_metrics"]

    comparison = {
        "incident_classification_comparison": {
            "dummy_majority_class": dummy_inc_metrics,
            "trained_model": inc_cat_metrics,
            "accuracy_lift_pct": round((inc_cat_metrics["accuracy"] - dummy_inc_metrics["accuracy"]) * 100, 2)
        },
        "safety_risk_scoring_comparison": {
            "dummy_mean_regressor": dummy_reg_metrics,
            "trained_gradient_boosting": trained_risk_metrics,
            "mae_reduction": round(dummy_reg_metrics["mae"] - trained_risk_metrics["mae"], 2)
        }
    }

    return comparison


if __name__ == "__main__":
    import json
    results = run_baseline_comparison()
    print(json.dumps(results, indent=2))
