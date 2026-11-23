"""Training script for Incident Classification Model."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_incident_data
from models.incident_classifier import IncidentClassifier

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def train_incident_model(
    data_path: Optional[str] = None,
    output_path: Optional[str] = None,
    random_state: int = 42
) -> IncidentClassifier:
    """Train and persist incident classifier."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "incident_classifier.joblib")
    print("[Training] Loading incident dataset...")
    train_df, test_df = load_incident_data(filepath=data_path, random_state=random_state)
    print(f"[Training] Dataset loaded: {len(train_df)} training samples, {len(test_df)} validation samples.")

    model = IncidentClassifier(random_state=random_state)
    print("[Training] Fitting IncidentClassifier pipelines...")
    model.fit(
        descriptions=train_df["description"].tolist(),
        categories=train_df["category"].tolist(),
        severities=train_df["severity"].tolist()
    )

    model.save(output_path)
    print(f"[Training] IncidentClassifier saved successfully to: {output_path}")
    return model


if __name__ == "__main__":
    train_incident_model()
