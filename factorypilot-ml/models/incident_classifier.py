"""Incident Classification Model.

Classifies industrial safety incidents into:
1. Incident Category (e.g. Chemical Exposure, Machinery/Mechanical, Slip/Trip/Fall, etc.)
2. Severity Level (Low, Medium, High, Critical)
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.text_preprocessor import IndustrialTextPreprocessor


class IncidentClassifier:
    """Dual-head text classifier for incident category and severity."""

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.preprocessor = IndustrialTextPreprocessor()

        # Category pipeline
        self.category_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=5000,
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=self.random_state
            ))
        ])

        # Severity pipeline
        self.severity_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=3000,
                sublinear_tf=True
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=self.random_state
            ))
        ])

        self.is_fitted = False
        self.categories_: List[str] = []
        self.severities_: List[str] = []

    def fit(self, descriptions: List[str], categories: List[str], severities: List[str]) -> IncidentClassifier:
        """Fit both category and severity models on incident texts."""
        clean_texts = [self.preprocessor.clean_text(t) for t in descriptions]

        self.category_pipeline.fit(clean_texts, categories)
        self.severity_pipeline.fit(clean_texts, severities)

        self.categories_ = list(self.category_pipeline.classes_)
        self.severities_ = list(self.severity_pipeline.classes_)
        self.is_fitted = True
        return self

    def predict(self, descriptions: List[str]) -> List[Dict[str, Any]]:
        """Predict category, severity, and confidence probabilities for input texts."""
        if not self.is_fitted:
            raise RuntimeError("IncidentClassifier is not fitted yet. Call fit() or load_model().")

        clean_texts = [self.preprocessor.clean_text(t) for t in descriptions]

        cat_preds = self.category_pipeline.predict(clean_texts)
        cat_probs = self.category_pipeline.predict_proba(clean_texts)

        sev_preds = self.severity_pipeline.predict(clean_texts)
        sev_probs = self.severity_pipeline.predict_proba(clean_texts)

        results = []
        for i, text in enumerate(descriptions):
            cat_idx = list(self.category_pipeline.classes_).index(cat_preds[i])
            sev_idx = list(self.severity_pipeline.classes_).index(sev_preds[i])

            results.append({
                "description": text,
                "predicted_category": str(cat_preds[i]),
                "category_confidence": round(float(cat_probs[i][cat_idx]), 4),
                "predicted_severity": str(sev_preds[i]),
                "severity_confidence": round(float(sev_probs[i][sev_idx]), 4),
                "category_distribution": {
                    cls: round(float(prob), 4)
                    for cls, prob in zip(self.category_pipeline.classes_, cat_probs[i])
                },
                "severity_distribution": {
                    cls: round(float(prob), 4)
                    for cls, prob in zip(self.severity_pipeline.classes_, sev_probs[i])
                }
            })

        return results

    def predict_single(self, description: str) -> Dict[str, Any]:
        """Convenience method for predicting a single narrative."""
        return self.predict([description])[0]

    def save(self, filepath: str) -> None:
        """Serialize fitted model to disk."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> IncidentClassifier:
        """Deserialize model from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
