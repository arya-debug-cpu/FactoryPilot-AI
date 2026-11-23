"""Training script for Safety Risk Scoring Model."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_site_safety_metrics
from models.safety_risk_scorer import SafetyRiskScorer

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def train_risk_scorer(
    data_path: Optional[str] = None,
    output_path: Optional[str] = None,
    random_state: int = 42
) -> SafetyRiskScorer:
    """Train and persist safety risk scoring pipeline."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "safety_risk_scorer.joblib")
    print("[Training] Loading site safety telemetry dataset...")
    metrics_df = load_site_safety_metrics(filepath=data_path)
    print(f"[Training] Loaded {len(metrics_df)} daily site telemetry records across {metrics_df['site'].nunique()} facilities.")

    model = SafetyRiskScorer(random_state=random_state)
    print("[Training] Fitting Gradient Boosting Safety Risk Scorer...")
    model.fit(metrics_df)

    model.save(output_path)
    print(f"[Training] SafetyRiskScorer saved successfully to: {output_path}")
    return model


if __name__ == "__main__":
    train_risk_scorer()
