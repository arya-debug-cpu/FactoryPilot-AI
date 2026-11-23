"""Training script for Corrective Action Overdue Predictor."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_corrective_actions_data
from models.overdue_action_predictor import OverdueActionPredictor

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def train_overdue_predictor(
    data_path: Optional[str] = None,
    output_path: Optional[str] = None,
    random_state: int = 42
) -> OverdueActionPredictor:
    """Train and persist corrective action overdue prediction pipeline."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "overdue_action_predictor.joblib")
    print("[Training] Loading corrective actions dataset...")
    train_df, test_df = load_corrective_actions_data(filepath=data_path, random_state=random_state)
    print(f"[Training] Loaded {len(train_df)} training and {len(test_df)} validation actions.")

    model = OverdueActionPredictor(random_state=random_state)
    print("[Training] Fitting OverdueActionPredictor dual-head pipeline...")
    model.fit(train_df)

    model.save(output_path)
    print(f"[Training] OverdueActionPredictor saved successfully to: {output_path}")
    return model


if __name__ == "__main__":
    train_overdue_predictor()
