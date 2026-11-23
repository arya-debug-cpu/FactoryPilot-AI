"""Performance evaluation metrics for safety classification, regression, and retrieval."""

from __future__ import annotations

from typing import Any, Dict, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score
)


def compute_classification_metrics(y_true: List[Any], y_pred: List[Any]) -> Dict[str, float]:
    """Compute standard multi-class or binary classification metrics."""
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision_macro": round(float(precision_score(y_true, y_pred, average="macro", zero_division=0)), 4),
        "recall_macro": round(float(recall_score(y_true, y_pred, average="macro", zero_division=0)), 4),
        "f1_macro": round(float(f1_score(y_true, y_pred, average="macro", zero_division=0)), 4),
        "f1_weighted": round(float(f1_score(y_true, y_pred, average="weighted", zero_division=0)), 4)
    }


def compute_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Compute regression metrics: MAE, RMSE, and R2."""
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)

    return {
        "mae": round(float(mae), 4),
        "rmse": round(float(rmse), 4),
        "r2_score": round(float(r2), 4)
    }


def compute_retrieval_mrr(relevance_ranks: List[int]) -> float:
    """Compute Mean Reciprocal Rank (MRR) given 1-based ranks of first relevant item."""
    if not relevance_ranks:
        return 0.0
    reciprocals = [1.0 / r if r > 0 else 0.0 for r in relevance_ranks]
    return round(float(np.mean(reciprocals)), 4)
