"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Every dashboard number is fetched from the FastAPI backend. */
export const API_BASE = "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("Cannot reach the FactoryPilot API", 0);
  }
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) detail = String(body.detail);
    } catch {
      /* keep default message */
    }
    throw new ApiError(detail, response.status);
  }
  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body ?? {}),
  });
}

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/** Small data hook handling loading / error / empty / retry. */
export function useApi<T>(path: string | null): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<T>(path)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || "Request failed");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);
  return { data, loading, error, reload };
}

/** Live wall-clock for the dashboard top bar. */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/* -------------------------------------------------------------------------- */
/* Safety Intelligence & ML API helpers                                       */
/* -------------------------------------------------------------------------- */
export type SafetySummary = {
  status: string;
  timestamp: string;
  live_database_telemetry: {
    monitored_machines: number;
    open_alerts_count: number;
    critical_alerts_count: number;
    overdue_maintenance_count: number;
    vibration_anomaly_index: number;
    temperature_anomaly_index: number;
  };
  ml_risk_scoring: {
    safety_risk_score: number;
    risk_tier: string;
    primary_risk_drivers: string[];
    action_recommended: boolean;
  };
  longitudinal_trends: {
    current_7d_risk_avg: number;
    trajectory: string;
    projected_risk_scores: Record<string, number>;
    heinrich_reporting_ratio: number;
  };
  cross_site_intelligence: {
    cross_site_anomalies: Array<{
      site: string;
      hazard_category: string;
      observed_count: number;
      site_proportion: number;
      fleet_mean_proportion: number;
      z_score: number;
      severity_assessment: string;
      systemic_alert: string;
    }>;
    fleet_summary: Record<string, unknown>;
  };
};

export function classifySafetyIncident(description: string) {
  return apiPost<any>("/safety/incident/classify", { description });
}

export function triageNearMiss(description: string) {
  return apiPost<any>("/safety/near-miss/triage", { description });
}

export function searchSimilarHazards(query: string, top_k = 3) {
  return apiPost<any[]>("/safety/hazards/similar", { query, top_k });
}

export function predictOverdueAction(action: Record<string, unknown>) {
  return apiPost<any>("/safety/actions/predict-overdue", action);
}

