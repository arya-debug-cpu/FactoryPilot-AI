"""Training and indexing script for Similar Hazard Engine & Cross-Site Pattern Detector."""

from __future__ import annotations

import os
import sys
from typing import Optional

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.data_loader import load_hazards_catalog, load_incident_data
from models.hazard_similarity_engine import SimilarHazardEngine
from models.cross_site_pattern_detector import CrossSitePatternDetector

SAVED_MODELS_DIR = os.path.join(_ML_ROOT, "saved_models")


def index_hazard_catalog(
    catalog_path: Optional[str] = None,
    output_path: Optional[str] = None
) -> SimilarHazardEngine:
    """Build and persist TF-IDF vector index for historical hazard retrieval."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "hazard_similarity_engine.joblib")
    print("[Training] Loading hazard catalog...")
    catalog_df = load_hazards_catalog(filepath=catalog_path)
    print(f"[Training] Catalog loaded: {len(catalog_df)} verified hazard solutions.")

    engine = SimilarHazardEngine()
    print("[Training] Indexing TF-IDF hazard space...")
    engine.index_catalog(catalog_df)

    engine.save(output_path)
    print(f"[Training] SimilarHazardEngine saved successfully to: {output_path}")
    return engine


def train_cross_site_detector(
    incidents_path: Optional[str] = None,
    output_path: Optional[str] = None
) -> CrossSitePatternDetector:
    """Train and persist cross-site pattern detector."""
    output_path = output_path or os.path.join(SAVED_MODELS_DIR, "cross_site_pattern_detector.joblib")
    print("[Training] Loading incidents data for cross-site modeling...")
    train_df, _ = load_incident_data(filepath=incidents_path)

    detector = CrossSitePatternDetector(n_clusters=3)
    print("[Training] Fitting cross-site hazard profile matrices...")
    detector.fit(train_df)

    detector.save(output_path)
    print(f"[Training] CrossSitePatternDetector saved to: {output_path}")
    return detector


if __name__ == "__main__":
    index_hazard_catalog()
    train_cross_site_detector()
