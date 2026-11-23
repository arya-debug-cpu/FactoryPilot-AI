"""Master training script to train and persist all FactoryPilot ML models."""

from __future__ import annotations

import os
import sys
import time

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from training.train_incident_classifier import train_incident_model
from training.train_near_miss_classifier import train_near_miss_model
from training.train_hazard_similarity import index_hazard_catalog, train_cross_site_detector
from training.train_safety_risk_scorer import train_risk_scorer
from training.train_overdue_action_predictor import train_overdue_predictor
from training.train_site_safety_trend import train_site_trend_analyzer


def train_entire_pipeline():
    """Train all 7 ML modules sequentially."""
    print("=" * 70)
    print("STARTING FACTORYPILOT ML PIPELINE TRAINING")
    print("=" * 70)
    start_time = time.time()

    print("\n--- 1. Training Incident Classifier ---")
    train_incident_model()

    print("\n--- 2. Training Near-Miss Classifier ---")
    train_near_miss_model()

    print("\n--- 3. Indexing Similar Hazard Engine ---")
    index_hazard_catalog()

    print("\n--- 4. Training Cross-Site Pattern Detector ---")
    train_cross_site_detector()

    print("\n--- 5. Training Safety Risk Scorer ---")
    train_risk_scorer()

    print("\n--- 6. Training Overdue Action Predictor ---")
    train_overdue_predictor()

    print("\n--- 7. Training Site Safety Trend Analyzer ---")
    train_site_trend_analyzer()

    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 70)
    print(f"ALL 7 ML MODELS SUCCESSFULLY TRAINED AND PERSISTED ({elapsed}s)")
    print("=" * 70)


if __name__ == "__main__":
    train_entire_pipeline()
