"""Domain-specific feature engineering for industrial safety analytics."""

from __future__ import annotations

import numpy as np
import pandas as pd


def compute_safety_pyramid_ratio(near_misses: int, incidents: int) -> float:
    """Calculate Heinrich / Bird safety ratio (Near Misses per Incident).
    
    A healthy reporting culture typically observes 10-30 near misses per incident.
    A low ratio indicates severe underreporting of near misses.
    """
    if incidents == 0:
        return float(near_misses) * 10.0
    return float(near_misses) / float(incidents)


def extract_corrective_action_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer operational friction and workload features for CAPA prediction."""
    engineered = df.copy()

    # Workload pressure index: active tickets relative to allocated days
    engineered["ticket_load_density"] = engineered["assignee_active_tickets"] / (
        engineered["days_allocated"].clip(lower=1)
    )

    # Capex burden tier: 0 = Zero, 1 = Small (<$1000), 2 = Significant ($1000-$5000), 3 = Heavy (>$5000)
    def capex_tier(val: float) -> str:
        if val <= 0:
            return "None"
        elif val < 1000:
            return "Small"
        elif val < 5000:
            return "Medium"
        return "Major"

    engineered["capex_tier"] = engineered["capex_required_usd"].apply(capex_tier)

    # High risk flag: critical priority or vendor involved
    engineered["high_friction_flag"] = (
        (engineered["priority"] == "Critical").astype(int) +
        (engineered["vendor_involved"] == 1).astype(int) +
        (engineered["action_complexity"] == "Complex").astype(int)
    )

    return engineered


def extract_site_trend_features(df: pd.DataFrame, window_days: int = 7) -> pd.DataFrame:
    """Compute rolling safety trends, moving averages, and volatility indices."""
    res = df.copy()
    if "date" in res.columns:
        res["date"] = pd.to_datetime(res["date"])
        res = res.sort_values(["site", "date"]).reset_index(drop=True)

    grouped = res.groupby("site")

    # 7-day rolling average of risk and near miss frequency
    res["risk_score_ma7"] = grouped["safety_risk_score"].transform(
        lambda s: s.rolling(window_days, min_periods=1).mean()
    )
    res["near_miss_ma7"] = grouped["daily_near_misses"].transform(
        lambda s: s.rolling(window_days, min_periods=1).mean()
    )
    res["incident_sum14"] = grouped["daily_incidents"].transform(
        lambda s: s.rolling(14, min_periods=1).sum()
    )

    # Risk momentum: current risk minus 7-day moving average
    res["risk_momentum"] = res["safety_risk_score"] - res["risk_score_ma7"]

    return res
