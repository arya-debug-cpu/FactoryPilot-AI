"""Cross-Site Hazard Pattern Detector.

Analyzes hazard and incident telemetry across multiple manufacturing facilities
to detect systemic vulnerabilities, cross-site co-occurrence patterns,
and statistical anomaly spikes.
"""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


class CrossSitePatternDetector:
    """Discovers recurring cross-site patterns and statistical hazard anomalies."""

    def __init__(self, n_clusters: int = 3, random_state: int = 42):
        self.n_clusters = n_clusters
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.kmeans = KMeans(n_clusters=self.n_clusters, random_state=self.random_state, n_init=10)
        self.site_profiles_: Optional[pd.DataFrame] = None
        self.fleet_baseline_: Optional[pd.Series] = None
        self.is_fitted = False

    def fit(self, records_df: pd.DataFrame) -> CrossSitePatternDetector:
        """Fit pattern detection on multi-site hazard / incident data."""
        if "site" not in records_df.columns or "category" not in records_df.columns:
            # Check alternative column name
            cat_col = "hazard_category" if "hazard_category" in records_df.columns else "category"
            if cat_col not in records_df.columns:
                raise ValueError("DataFrame must contain 'site' and 'category' (or 'hazard_category')")
        else:
            cat_col = "category"

        # Construct site x category count matrix
        pivot = pd.crosstab(records_df["site"], records_df[cat_col], normalize="index")
        self.site_profiles_ = pivot.copy()
        self.fleet_baseline_ = pivot.mean(axis=0)

        # Fit clustering on normalized profiles if enough sites exist
        n_sites = len(pivot)
        k = min(self.n_clusters, n_sites)
        if k > 1:
            scaled = self.scaler.fit_transform(pivot.values)
            self.kmeans = KMeans(n_clusters=k, random_state=self.random_state, n_init=10)
            self.kmeans.fit(scaled)

        self.is_fitted = True
        return self

    def detect_anomalies(self, records_df: pd.DataFrame, threshold_z: float = 1.8) -> List[Dict[str, Any]]:
        """Identify site-category pairs whose frequency significantly exceeds fleet baseline."""
        if not self.is_fitted or self.site_profiles_ is None or self.fleet_baseline_ is None:
            self.fit(records_df)

        cat_col = "hazard_category" if "hazard_category" in records_df.columns else "category"
        site_counts = pd.crosstab(records_df["site"], records_df[cat_col])
        site_rates = site_counts.div(site_counts.sum(axis=1), axis=0).fillna(0)

        mean_rates = site_rates.mean(axis=0)
        std_rates = site_rates.std(axis=0).replace(0, 1e-6)

        anomalies = []
        for site in site_rates.index:
            for cat in site_rates.columns:
                rate = float(site_rates.loc[site, cat])
                z_score = float((rate - mean_rates[cat]) / std_rates[cat])
                count = int(site_counts.loc[site, cat])

                if z_score >= threshold_z and count >= 3:
                    anomalies.append({
                        "site": str(site),
                        "hazard_category": str(cat),
                        "observed_count": count,
                        "site_proportion": round(rate, 4),
                        "fleet_mean_proportion": round(float(mean_rates[cat]), 4),
                        "z_score": round(z_score, 2),
                        "severity_assessment": "High" if z_score > 2.5 else "Elevated",
                        "systemic_alert": (
                            f"{site} exhibits a {round(rate * 100, 1)}% proportion of {cat} hazards, "
                            f"exceeding fleet average of {round(float(mean_rates[cat]) * 100, 1)}% "
                            f"(Z-score: {round(z_score, 2)}). Audit cross-site controls."
                        )
                    })

        return anomalies

    def get_cross_site_summary(self) -> Dict[str, Any]:
        """Return overarching cross-site pattern summary."""
        if not self.is_fitted or self.site_profiles_ is None or self.fleet_baseline_ is None:
            raise RuntimeError("Model is not fitted.")

        top_fleet_hazards = self.fleet_baseline_.sort_values(ascending=False).head(3).to_dict()

        # Correlation between hazard categories across sites
        cat_corr = self.site_profiles_.corr().round(3).to_dict()

        return {
            "monitored_sites": list(self.site_profiles_.index),
            "hazard_categories": list(self.site_profiles_.columns),
            "top_fleet_hazards": {k: round(v, 4) for k, v in top_fleet_hazards.items()},
            "inter_hazard_correlation": cat_corr
        }

    def save(self, filepath: str) -> None:
        """Persist detector model."""
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath: str) -> CrossSitePatternDetector:
        """Load detector from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Model file not found at {filepath}")
        return joblib.load(filepath)
