"""Training script for Near-Miss Classification Model."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_near_miss_data
from models.near_miss_classifier import NearMissClassifier

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def train_near_miss_model(
    data_path: Optional[str] = None,
    output_path: Optional[str] = None,
    random_state: int = 42
) -> NearMissClassifier:
    """Train and persist near-miss classifier."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "near_miss_classifier.joblib")
    print("[Training] Loading near-miss dataset...")
    train_df, test_df = load_near_miss_data(filepath=data_path, random_state=random_state)
    print(f"[Training] Dataset loaded: {len(train_df)} training samples, {len(test_df)} validation samples.")

    model = NearMissClassifier(random_state=random_state)
    print("[Training] Fitting NearMissClassifier pipelines...")
    model.fit(
        descriptions=train_df["description"].tolist(),
        is_near_miss_labels=train_df["is_near_miss"].astype(int).tolist(),
        domains=train_df["root_cause_domain"].tolist(),
        potential_severities=train_df["potential_severity"].tolist()
    )

    model.save(output_path)
    print(f"[Training] NearMissClassifier saved successfully to: {output_path}")
    return model


if __name__ == "__main__":
    train_near_miss_model()
