"""Comprehensive evaluation suite for all FactoryPilot ML models."""

from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict
import numpy as np

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
from evaluation.metrics import compute_classification_metrics, compute_regression_metrics
from models.cross_site_pattern_detector import CrossSitePatternDetector
from models.hazard_similarity_engine import SimilarHazardEngine
from models.incident_classifier import IncidentClassifier
from models.near_miss_classifier import NearMissClassifier
from models.overdue_action_predictor import OverdueActionPredictor
from models.safety_risk_scorer import SafetyRiskScorer
from models.site_safety_trend_analyzer import SiteSafetyTrendAnalyzer

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def evaluate_incident_classifier() -> Dict[str, Any]:
    """Evaluate Incident Classifier on hold-out validation set."""
    model_path = os.path.join(SAVED_MODELS_DIR, "incident_classifier.joblib")
    if not os.path.exists(model_path):
        from training.train_incident_classifier import train_incident_model
        train_incident_model()

    model = IncidentClassifier.load(model_path)
    _, test_df = load_incident_data()

    texts = test_df["description"].tolist()
    preds = model.predict(texts)

    cat_pred = [p["predicted_category"] for p in preds]
    sev_pred = [p["predicted_severity"] for p in preds]

    cat_metrics = compute_classification_metrics(test_df["category"].tolist(), cat_pred)
    sev_metrics = compute_classification_metrics(test_df["severity"].tolist(), sev_pred)

    return {
        "model": "IncidentClassifier",
        "validation_samples": len(test_df),
        "category_metrics": cat_metrics,
        "severity_metrics": sev_metrics
    }


def evaluate_near_miss_classifier() -> Dict[str, Any]:
    """Evaluate Near-Miss Classifier on hold-out validation set."""
    model_path = os.path.join(SAVED_MODELS_DIR, "near_miss_classifier.joblib")
    if not os.path.exists(model_path):
        from training.train_near_miss_classifier import train_near_miss_model
        train_near_miss_model()

    model = NearMissClassifier.load(model_path)
    _, test_df = load_near_miss_data()

    texts = test_df["description"].tolist()
    preds = model.predict(texts)

    type_pred = [int(p["is_near_miss"]) for p in preds]
    domain_pred = [p["root_cause_domain"] for p in preds]
    pot_sev_pred = [p["potential_severity"] for p in preds]

    type_metrics = compute_classification_metrics(test_df["is_near_miss"].astype(int).tolist(), type_pred)
    domain_metrics = compute_classification_metrics(test_df["root_cause_domain"].tolist(), domain_pred)
    sev_metrics = compute_classification_metrics(test_df["potential_severity"].tolist(), pot_sev_pred)

    return {
        "model": "NearMissClassifier",
        "validation_samples": len(test_df),
        "distinction_metrics": type_metrics,
        "root_cause_domain_metrics": domain_metrics,
        "potential_severity_metrics": sev_metrics
    }


def evaluate_safety_risk_scorer() -> Dict[str, Any]:
    """Evaluate Safety Risk Scorer."""
    model_path = os.path.join(SAVED_MODELS_DIR, "safety_risk_scorer.joblib")
    if not os.path.exists(model_path):
        from training.train_safety_risk_scorer import train_risk_scorer
        train_risk_scorer()

    model = SafetyRiskScorer.load(model_path)
    df = load_site_safety_metrics()
    # Holdout last 30 days per site
    test_df = df.groupby("site").tail(30).reset_index(drop=True)

    preds = model.predict(test_df)
    y_pred = np.array([p["safety_risk_score"] for p in preds])
    y_true = test_df["safety_risk_score"].values

    reg_metrics = compute_regression_metrics(y_true, y_pred)
    return {
        "model": "SafetyRiskScorer",
        "validation_samples": len(test_df),
        "regression_metrics": reg_metrics
    }


def evaluate_overdue_action_predictor() -> Dict[str, Any]:
    """Evaluate Overdue Action Predictor."""
    model_path = os.path.join(SAVED_MODELS_DIR, "overdue_action_predictor.joblib")
    if not os.path.exists(model_path):
        from training.train_overdue_action_predictor import train_overdue_predictor
        train_overdue_predictor()

    model = OverdueActionPredictor.load(model_path)
    _, test_df = load_corrective_actions_data()

    preds = model.predict(test_df)
    overdue_pred = [int(p["is_overdue_risk"]) for p in preds]
    overdue_true = test_df["is_overdue"].astype(int).tolist()

    clf_metrics = compute_classification_metrics(overdue_true, overdue_pred)

    y_delay_true = test_df["days_delay"].values
    y_delay_pred = np.array([p["predicted_days_delay"] for p in preds])
    reg_metrics = compute_regression_metrics(y_delay_true, y_delay_pred)

    return {
        "model": "OverdueActionPredictor",
        "validation_samples": len(test_df),
        "overdue_classification_metrics": clf_metrics,
        "delay_regression_metrics": reg_metrics
    }


def evaluate_similar_hazard_engine() -> Dict[str, Any]:
    """Evaluate retrieval coverage and latency of Similar Hazard Engine."""
    model_path = os.path.join(SAVED_MODELS_DIR, "hazard_similarity_engine.joblib")
    if not os.path.exists(model_path):
        from training.train_hazard_similarity import index_hazard_catalog
        index_hazard_catalog()

    engine = SimilarHazardEngine.load(model_path)
    test_queries = [
        "Hydraulic fluid leak near CNC milling spindle causing slip hazard",
        "Lockout tagout lock was missing from electrical isolation breaker panel",
        "Worker experienced wrist and shoulder strain from repetitive pallet stacking"
    ]

    query_results = []
    for q in test_queries:
        results = engine.find_similar(q, top_k=3)
        query_results.append({
            "query": q,
            "top_match_id": results[0]["hazard_id"] if results else None,
            "top_similarity": results[0]["similarity_score"] if results else 0.0,
            "resolution_retrieved": bool(results and len(results[0]["historical_resolution"]) > 10)
        })

    return {
        "model": "SimilarHazardEngine",
        "indexed_catalog_size": len(engine.catalog_df) if engine.catalog_df is not None else 0,
        "sample_retrieval_tests": query_results
    }


def evaluate_all_models() -> Dict[str, Any]:
    """Run evaluation across all models and return consolidated dictionary."""
    results = {
        "benchmark_notice": "EVALUATION PERFORMED ON BENCHMARK SYNTHETIC EHS DATASETS FOR PIPELINE INTEGRITY VALIDATION",
        "incident_classification": evaluate_incident_classifier(),
        "near_miss_classification": evaluate_near_miss_classifier(),
        "safety_risk_scoring": evaluate_safety_risk_scorer(),
        "overdue_action_prediction": evaluate_overdue_action_predictor(),
        "similar_hazard_retrieval": evaluate_similar_hazard_engine()
    }
    return results


if __name__ == "__main__":
    report = evaluate_all_models()
    print(json.dumps(report, indent=2))
