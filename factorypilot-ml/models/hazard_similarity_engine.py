"""Similar Hazard Detection Engine.

Uses semantic vector space representation (TF-IDF + Cosine Similarity) to match
newly reported hazards against historical incident and hazard repositories.
Retrieves past verified corrective actions, lessons learned, and recurrence patterns.
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.text_preprocessor import IndustrialTextPreprocessor


class SimilarHazardEngine:
    """Information retrieval and semantic similarity engine for factory hazards."""

    def __init__(self, top_k: int = 5):
        self.top_k = top_k
        self.preprocessor = IndustrialTextPreprocessor()
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=10000,
            sublinear_tf=True
        )
        self.catalog_df: Optional[pd.DataFrame] = None
        self.tfidf_matrix: Any = None
        self.is_indexed: bool = False

    def index_catalog(self, catalog_df: pd.DataFrame) -> SimilarHazardEngine:
        """Index a dataframe of historical hazards."""
        self.catalog_df = catalog_df.copy().reset_index(drop=True)
        raw_texts = self.catalog_df["description"].astype(str).tolist()
        clean_texts = [self.preprocessor.clean_text(t) for t in raw_texts]

        self.tfidf_matrix = self.vectorizer.fit_transform(clean_texts)
        self.is_indexed = True
        return self

    def find_similar(
        self,
        query: str,
        top_k: Optional[int] = None,
        filter_category: Optional[str] = None,
        min_similarity: float = 0.1
    ) -> List[Dict[str, Any]]:
        """Search historical hazards for records matching the query description."""
        if not self.is_indexed or self.catalog_df is None or self.tfidf_matrix is None:
            raise RuntimeError("Catalog is not indexed. Call index_catalog() first.")

        k = top_k or self.top_k
        clean_query = self.preprocessor.clean_text(query)
        query_vec = self.vectorizer.transform([clean_query])

        scores = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        # Apply category filter if requested
        valid_indices = np.arange(len(scores))
        if filter_category and "hazard_category" in self.catalog_df.columns:
            mask = self.catalog_df["hazard_category"] == filter_category
            valid_indices = valid_indices[mask.values]

        if len(valid_indices) == 0:
            return []

        filtered_scores = scores[valid_indices]
        sorted_rel_indices = np.argsort(filtered_scores)[::-1]

        matches = []
        for rel_idx in sorted_rel_indices[:k]:
            idx = int(valid_indices[rel_idx])
            sim_score = float(scores[idx])
            if sim_score < min_similarity:
                continue

            row = self.catalog_df.iloc[idx]
            matches.append({
                "hazard_id": str(row.get("hazard_id", f"HAZ-{idx}")),
                "similarity_score": round(sim_score, 4),
                "site": str(row.get("site", "Unknown")),
                "department": str(row.get("department", "Unknown")),
                "equipment": str(row.get("equipment", "Unknown")),
                "hazard_category": str(row.get("hazard_category", "Unknown")),
                "historical_description": str(row.get("description", "")),
                "historical_resolution": str(row.get("historical_resolution", "None documented")),
                "recurrence_prevented": bool(row.get("recurrence_prevented", 1))
            })

        return matches

    def save(self, filepath: str) -> None:
        """Persist indexed catalog and vectorizer."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> SimilarHazardEngine:
        """Load engine from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
