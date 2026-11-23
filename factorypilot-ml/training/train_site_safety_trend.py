"""Training script for Site-Level Safety Trend Analyzer."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_site_safety_metrics
from models.site_safety_trend_analyzer import SiteSafetyTrendAnalyzer

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def train_site_trend_analyzer(
    data_path: Optional[str] = None,
    output_path: Optional[str] = None
) -> SiteSafetyTrendAnalyzer:
    """Fit and persist site safety trend analyzer."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "site_safety_trend_analyzer.joblib")
    print("[Training] Loading site safety telemetry dataset...")
    metrics_df = load_site_safety_metrics(filepath=data_path)
    print(f"[Training] Loaded {len(metrics_df)} daily site telemetry records across {metrics_df['site'].nunique()} facilities.")

    analyzer = SiteSafetyTrendAnalyzer()
    print("[Training] Fitting longitudinal trend models and forecasting horizons...")
    analyzer.fit(metrics_df)

    analyzer.save(output_path)
    print(f"[Training] SiteSafetyTrendAnalyzer saved successfully to: {output_path}")
    return analyzer


if __name__ == "__main__":
    train_site_trend_analyzer()
