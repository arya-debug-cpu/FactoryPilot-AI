"""Lightweight experiment tracking and model audit log."""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from typing import Any, Dict

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "experiment_history.jsonl")


def log_experiment_run(
    model_name: str,
    hyperparameters: Dict[str, Any],
    metrics: Dict[str, Any],
    dataset_summary: Dict[str, Any],
    notes: str = ""
) -> Dict[str, Any]:
    """Record an experiment run in experiment_history.jsonl."""
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "model_name": model_name,
        "hyperparameters": hyperparameters,
        "metrics": metrics,
        "dataset_summary": dataset_summary,
        "notes": notes
    }

    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

    return entry


def get_experiment_history() -> list:
    """Retrieve all recorded experiment runs."""
    if not os.path.exists(LOG_FILE):
        return []

    history = []
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                history.append(json.loads(line))
    return history
