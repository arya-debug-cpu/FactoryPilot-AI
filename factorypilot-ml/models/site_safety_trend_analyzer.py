"""Site-Level Safety Trend Analyzer.

Computes time-series trend metrics, velocity indicators, forward projections,
and statistical anomaly flags for plant-level EHS management.
"""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


class SiteSafetyTrendAnalyzer:
    """Analyzes longitudinal safety indicators across manufacturing plants."""

    def __init__(self, forecast_horizons: Optional[List[int]] = None):
        self.forecast_horizons: List[int] = forecast_horizons or [30, 60, 90]
        self.site_models_: Dict[str, LinearRegression] = {}
        self.site_summaries_: Dict[str, Dict[str, Any]] = {}
        self.is_fitted: bool = False

    def fit(self, metrics_df: pd.DataFrame) -> SiteSafetyTrendAnalyzer:
        """Fit trend models per site from historical safety metric logs."""
        df = metrics_df.copy()
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values(["site", "date"]).reset_index(drop=True)

        for site, group in df.groupby("site"):
            group = group.reset_index(drop=True)
            n_days = len(group)
            if n_days < 7:
                continue

            # Day indices for linear regression trend
            X_days = np.arange(n_days).reshape(-1, 1)
            y_risk = group["safety_risk_score"].values

            trend_model = LinearRegression()
            trend_model.fit(X_days, y_risk)
            self.site_models_[str(site)] = trend_model

            # Slope indicates points per day change
            slope = float(trend_model.coef_[0])
            monthly_drift = slope * 30.0

            if monthly_drift > 2.0:
                trajectory = "Deteriorating (Risk Rising)"
            elif monthly_drift < -2.0:
                trajectory = "Improving (Risk Dropping)"
            else:
                trajectory = "Stable / Controlled"

            # 7-day and 30-day moving average
            recent_7 = group.tail(7)
            recent_30 = group.tail(30)
            avg_risk_7d = float(recent_7["safety_risk_score"].mean())
            avg_risk_30d = float(recent_30["safety_risk_score"].mean())
            total_incidents_30d = int(recent_30["daily_incidents"].sum())
            total_near_misses_30d = int(recent_30["daily_near_misses"].sum())

            # Heinrich ratio: near misses per incident
            heinrich_ratio = round(
                total_near_misses_30d / max(1, total_incidents_30d), 1
            )

            # Risk projections
            last_day_idx = n_days - 1
            projections = {}
            for h in self.forecast_horizons:
                future_day = np.array([[last_day_idx + h]])
                proj_val = float(np.clip(trend_model.predict(future_day)[0], 0.0, 100.0))
                projections[f"day_{h}"] = round(proj_val, 2)

            self.site_summaries_[str(site)] = {
                "site": str(site),
                "data_points_days": n_days,
                "latest_date": str(group["date"].max().strftime("%Y-%m-%d")),
                "current_7d_risk_avg": round(avg_risk_7d, 2),
                "current_30d_risk_avg": round(avg_risk_30d, 2),
                "monthly_risk_drift_points": round(monthly_drift, 2),
                "trajectory": trajectory,
                "incidents_last_30d": total_incidents_30d,
                "near_misses_last_30d": total_near_misses_30d,
                "heinrich_reporting_ratio": heinrich_ratio,
                "reporting_culture_health": (
                    "Strong reporting culture (>15 NM/incident)" if heinrich_ratio >= 15
                    else ("Normal reporting (5-15 NM/incident)" if heinrich_ratio >= 5 else "Under-reporting risk (<5 NM/incident)")
                ),
                "projected_risk_scores": projections
            }

        self.is_fitted = True
        return self

    def analyze_site(self, site_name: str) -> Dict[str, Any]:
        """Retrieve trend summary for a single facility."""
        if not self.is_fitted:
            raise RuntimeError("SiteSafetyTrendAnalyzer is not fitted yet.")

        if site_name not in self.site_summaries_:
            available = list(self.site_summaries_.keys())
            raise KeyError(f"Site '{site_name}' not found. Monitored sites: {available}")

        return self.site_summaries_[site_name]

    def get_fleet_report(self) -> Dict[str, Any]:
        """Retrieve cross-fleet safety trend overview."""
        if not self.is_fitted:
            raise RuntimeError("SiteSafetyTrendAnalyzer is not fitted yet.")

        all_summaries = list(self.site_summaries_.values())
        sorted_by_risk = sorted(all_summaries, key=lambda s: s["current_7d_risk_avg"], reverse=True)

        return {
            "monitored_site_count": len(all_summaries),
            "highest_risk_site": sorted_by_risk[0]["site"] if sorted_by_risk else None,
            "lowest_risk_site": sorted_by_risk[-1]["site"] if sorted_by_risk else None,
            "sites": self.site_summaries_
        }

    def save(self, filepath: str) -> None:
        """Persist trend analyzer."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> SiteSafetyTrendAnalyzer:
        """Load trend analyzer from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
