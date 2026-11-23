"""Data loader and dataset validation utilities for FactoryPilot ML.

Ensures strict schema validation, transparent labeling of benchmark data,
and train/validation/test partitioning.
"""

from __future__ import annotations

import os
import sys
from typing import Dict, Optional, Tuple
import pandas as pd
from sklearn.model_selection import train_test_split

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from datasets.synthetic_generator import export_all_benchmark_datasets

SAMPLE_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_data")


class DatasetValidationError(Exception):
    """Raised when a dataset fails schema or integrity validation."""
    pass


def get_sample_data_path(filename: str) -> str:
    """Return the absolute path to a sample data file."""
    return os.path.join(SAMPLE_DATA_DIR, filename)


def load_incident_data(
    filepath: Optional[str] = None,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load and validate incident reports dataset.
    
    Returns:
        (train_df, test_df)
    """
    path = filepath or get_sample_data_path("incident_reports_sample.csv")
    if not os.path.exists(path):
        export_all_benchmark_datasets(SAMPLE_DATA_DIR)

    df = pd.read_csv(path)
    required_cols = ["description", "category", "severity"]
    for col in required_cols:
        if col not in df.columns:
            raise DatasetValidationError(f"Missing required column '{col}' in incident data: {path}")

    df = df.dropna(subset=required_cols).reset_index(drop=True)

    train_df, test_df = train_test_split(
        df, test_size=test_size, random_state=random_state, stratify=df["category"]
    )
    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)


def load_near_miss_data(
    filepath: Optional[str] = None,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load and validate near miss dataset.
    
    Returns:
        (train_df, test_df)
    """
    path = filepath or get_sample_data_path("near_miss_reports_sample.csv")
    if not os.path.exists(path):
        export_all_benchmark_datasets(SAMPLE_DATA_DIR)

    df = pd.read_csv(path)
    required_cols = ["description", "is_near_miss", "root_cause_domain", "potential_severity"]
    for col in required_cols:
        if col not in df.columns:
            raise DatasetValidationError(f"Missing required column '{col}' in near miss data: {path}")

    df = df.dropna(subset=required_cols).reset_index(drop=True)

    train_df, test_df = train_test_split(
        df, test_size=test_size, random_state=random_state, stratify=df["root_cause_domain"]
    )
    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)


def load_hazards_catalog(filepath: Optional[str] = None) -> pd.DataFrame:
    """Load catalog of historical hazards and verified resolutions."""
    path = filepath or get_sample_data_path("hazard_reports_sample.csv")
    if not os.path.exists(path):
        export_all_benchmark_datasets(SAMPLE_DATA_DIR)

    df = pd.read_csv(path)
    required_cols = ["hazard_id", "description", "hazard_category", "historical_resolution"]
    for col in required_cols:
        if col not in df.columns:
            raise DatasetValidationError(f"Missing required column '{col}' in hazard catalog: {path}")

    return df.dropna(subset=required_cols).reset_index(drop=True)


def load_corrective_actions_data(
    filepath: Optional[str] = None,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load corrective actions data for overdue action prediction."""
    path = filepath or get_sample_data_path("corrective_actions_sample.csv")
    if not os.path.exists(path):
        export_all_benchmark_datasets(SAMPLE_DATA_DIR)

    df = pd.read_csv(path)
    required_cols = [
        "priority", "action_category", "action_complexity",
        "days_allocated", "assignee_active_tickets", "is_overdue"
    ]
    for col in required_cols:
        if col not in df.columns:
            raise DatasetValidationError(f"Missing required column '{col}' in corrective actions data: {path}")

    df = df.dropna(subset=required_cols).reset_index(drop=True)

    train_df, test_df = train_test_split(
        df, test_size=test_size, random_state=random_state, stratify=df["is_overdue"]
    )
    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)


def load_site_safety_metrics(filepath: Optional[str] = None) -> pd.DataFrame:
    """Load site-level safety indicators for risk scoring and trend analysis."""
    path = filepath or get_sample_data_path("site_safety_metrics_sample.csv")
    if not os.path.exists(path):
        export_all_benchmark_datasets(SAMPLE_DATA_DIR)

    df = pd.read_csv(path)
    required_cols = ["date", "site", "daily_near_misses", "daily_incidents", "safety_risk_score"]
    for col in required_cols:
        if col not in df.columns:
            raise DatasetValidationError(f"Missing required column '{col}' in site metrics data: {path}")

    df["date"] = pd.to_datetime(df["date"])
    return df.sort_values(["site", "date"]).reset_index(drop=True)
