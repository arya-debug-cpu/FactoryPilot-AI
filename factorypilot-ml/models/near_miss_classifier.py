"""Near-Miss Classification Model.

Classifies near-miss event narratives into:
1. Near-Miss vs Actual Recordable Incident distinction
2. Root-Cause Domain (Unsafe Condition, Unsafe Behavior, Equipment Malfunction, etc.)
3. Potential Severity (Minor, Moderate, Severe, Catastrophic)
"""

from __future__ import annotations

import os
import sys
from typing import Any, Dict, List, Optional
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from preprocessing.text_preprocessor import IndustrialTextPreprocessor


class NearMissClassifier:
    """Multi-target classifier for near-miss risk triage and domain identification."""

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.preprocessor = IndustrialTextPreprocessor()

        # Is Near Miss vs Recordable
        self.type_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=3000, sublinear_tf=True)),
            ("clf", LogisticRegression(class_weight="balanced", random_state=self.random_state))
        ])

        # Root cause domain
        self.domain_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=4000, sublinear_tf=True)),
            ("clf", LogisticRegression(class_weight="balanced", random_state=self.random_state))
        ])

        # Potential severity
        self.potential_sev_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=3000, sublinear_tf=True)),
            ("clf", LogisticRegression(class_weight="balanced", random_state=self.random_state))
        ])

        self.is_fitted = False

    def fit(
        self,
        descriptions: List[str],
        is_near_miss_labels: List[int],
        domains: List[str],
        potential_severities: List[str]
    ) -> NearMissClassifier:
        """Fit all 3 heads on near-miss dataset."""
        clean_texts = [self.preprocessor.clean_text(t) for t in descriptions]

        self.type_pipeline.fit(clean_texts, is_near_miss_labels)
        self.domain_pipeline.fit(clean_texts, domains)
        self.potential_sev_pipeline.fit(clean_texts, potential_severities)

        self.is_fitted = True
        return self

    def predict(self, descriptions: List[str]) -> List[Dict[str, Any]]:
        """Predict triage outputs for a list of descriptions."""
        if not self.is_fitted:
            raise RuntimeError("NearMissClassifier is not fitted yet.")

        clean_texts = [self.preprocessor.clean_text(t) for t in descriptions]

        type_preds = self.type_pipeline.predict(clean_texts)
        type_probs = self.type_pipeline.predict_proba(clean_texts)

        domain_preds = self.domain_pipeline.predict(clean_texts)
        domain_probs = self.domain_pipeline.predict_proba(clean_texts)

        sev_preds = self.potential_sev_pipeline.predict(clean_texts)
        sev_probs = self.potential_sev_pipeline.predict_proba(clean_texts)

        results = []
        for i, text in enumerate(descriptions):
            nm_prob = float(type_probs[i][1]) if 1 in self.type_pipeline.classes_ else 0.5
            dom_idx = list(self.domain_pipeline.classes_).index(domain_preds[i])
            sev_idx = list(self.potential_sev_pipeline.classes_).index(sev_preds[i])

            predicted_potential_sev = str(sev_preds[i])
            urgent_action = predicted_potential_sev in ["Severe", "Catastrophic"]

            results.append({
                "description": text,
                "is_near_miss": bool(type_preds[i] == 1),
                "near_miss_probability": round(nm_prob, 4),
                "root_cause_domain": str(domain_preds[i]),
                "domain_confidence": round(float(domain_probs[i][dom_idx]), 4),
                "potential_severity": predicted_potential_sev,
                "potential_severity_confidence": round(float(sev_probs[i][sev_idx]), 4),
                "escalate_urgency": urgent_action,
                "recommended_focus": f"Address {domain_preds[i]} immediately to prevent escalation to {predicted_potential_sev} injury."
            })

        return results

    def predict_single(self, description: str) -> Dict[str, Any]:
        """Triage single near-miss text."""
        return self.predict([description])[0]

    def save(self, filepath: str) -> None:
        """Serialize model to disk."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> NearMissClassifier:
        """Deserialize model from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
