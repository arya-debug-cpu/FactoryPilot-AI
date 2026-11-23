"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Badge,
  CountUp,
  ErrorState,
  Eyebrow,
  HealthBar,
  Loading,
  Panel,
  RiskBadge,
  StatusDot,
} from "@/components/ui";
import {
  classifySafetyIncident,
  predictOverdueAction,
  searchSimilarHazards,
  triageNearMiss,
  useApi,
  type SafetySummary,
} from "@/lib/api";

export default function SafetyPage() {
  const { data: summary, loading, error, reload } = useApi<SafetySummary>("/safety/summary");

  // Incident Classifier state
  const [incidentText, setIncidentText] = useState(
    "Spindle bearing seized at 8000 RPM on CNC-Milling-01 throwing ceramic fragments into chip guard."
  );
  const [incidentResult, setIncidentResult] = useState<any>(null);
  const [incidentLoading, setIncidentLoading] = useState(false);

  // Near-Miss Triage state
  const [nearMissText, setNearMissText] = useState(
    "Emergency stop button on conveyor was found mechanically stuck behind damaged sheet metal guard."
  );
  const [nearMissResult, setNearMissResult] = useState<any>(null);
  const [nearMissLoading, setNearMissLoading] = useState(false);

  // Similar Hazard search state
  const [hazardQuery, setHazardQuery] = useState("Oil leak pooling near machine walkway causing slip hazard");
  const [hazardMatches, setHazardMatches] = useState<any[] | null>(null);
  const [hazardLoading, setHazardLoading] = useState(false);

  // Overdue Action predictor state
  const [actionPriority, setActionPriority] = useState("Critical");
  const [actionComplexity, setActionComplexity] = useState("Complex");
  const [actionDays, setActionDays] = useState(7);
  const [actionTickets, setActionTickets] = useState(10);
  const [actionCapex, setActionCapex] = useState(5000);
  const [actionVendor, setActionVendor] = useState(true);
  const [actionResult, setActionResult] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleClassifyIncident() {
    if (!incidentText.trim()) return;
    setIncidentLoading(true);
    try {
      const res = await classifySafetyIncident(incidentText);
      setIncidentResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIncidentLoading(false);
    }
  }

  async function handleTriageNearMiss() {
    if (!nearMissText.trim()) return;
    setNearMissLoading(true);
    try {
      const res = await triageNearMiss(nearMissText);
      setNearMissResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setNearMissLoading(false);
    }
  }

  async function handleSearchHazards() {
    if (!hazardQuery.trim()) return;
    setHazardLoading(true);
    try {
      const res = await searchSimilarHazards(hazardQuery, 3);
      setHazardMatches(res);
    } catch (err) {
      console.error(err);
    } finally {
      setHazardLoading(false);
    }
  }

  async function handlePredictOverdue() {
    setActionLoading(true);
    try {
      const res = await predictOverdueAction({
        priority: actionPriority,
        action_category: "Machinery / Mechanical",
        action_complexity: actionComplexity,
        days_allocated: Number(actionDays),
        assignee_active_tickets: Number(actionTickets),
        capex_required_usd: Number(actionCapex),
        vendor_involved: actionVendor ? 1 : 0,
        site: "Site-Detroit",
      });
      setActionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loading rows={8} label="Loading Safety Intelligence & ML models" />;
  if (error || !summary) return <ErrorState message={error || "Failed to load safety data"} onRetry={reload} />;

  const riskScore = summary.ml_risk_scoring?.safety_risk_score ?? 35;
  const riskTier = summary.ml_risk_scoring?.risk_tier ?? "MEDIUM";
  const trajectory = summary.longitudinal_trends?.trajectory ?? "Stable";
  const heinrichRatio = summary.longitudinal_trends?.heinrich_reporting_ratio ?? 12.0;

  return (
    <div className="space-y-6">
      {/* ----------------------------- Header ----------------------------- */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-led" />
            <Eyebrow>Factory Safety Intelligence & Predictive ML</Eyebrow>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg">
            Environmental Health & Safety Console
          </h1>
          <p className="mt-1 text-xs text-muted">
            Continuous calibrated risk scoring, automated incident triage, similar hazard retrieval, and CAPA overdue forecasting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="emerald" className="px-3 py-1">
            <StatusDot tone="signal" pulse />
            7 ML Models Active
          </Badge>
          <button
            onClick={reload}
            className="border border-line bg-raised px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg transition hover:border-signal hover:text-led"
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* --------------------------- KPI Cards --------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Risk Score */}
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Composite Safety Risk Score</Eyebrow>
            <RiskBadge level={riskTier} solid />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-fg">
              <CountUp value={riskScore} decimals={1} />
            </span>
            <span className="text-xs text-dim">/ 100</span>
          </div>
          <div className="mt-3">
            <HealthBar value={100 - riskScore} width={160} />
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Calibrated on live vibration ({summary.live_database_telemetry.vibration_anomaly_index}x), open alerts ({summary.live_database_telemetry.open_alerts_count}), and overdue actions.
          </p>
        </Panel>

        {/* Card 2: Heinrich Safety Ratio */}
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Heinrich Reporting Ratio</Eyebrow>
            <Badge tone={heinrichRatio >= 10 ? "emerald" : "amber"}>
              {heinrichRatio >= 10 ? "Proactive" : "Under-Reporting"}
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-fg">
              <CountUp value={heinrichRatio} decimals={1} suffix=":1" />
            </span>
          </div>
          <p className="mt-3 text-xs text-muted">
            Near misses reported per actual recordable incident. Industrial standard benchmarks recommend &gt;10:1.
          </p>
        </Panel>

        {/* Card 3: 30-Day Trajectory */}
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Longitudinal Drift</Eyebrow>
            {trajectory.includes("Improving") ? (
              <TrendingDown className="h-4 w-4 text-led" />
            ) : trajectory.includes("Deteriorating") ? (
              <TrendingUp className="h-4 w-4 text-crit" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-amber" />
            )}
          </div>
          <div className="mt-3 text-lg font-medium text-fg">{trajectory}</div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>30d Projected:</span>
            <span className="font-mono text-fg">
              {summary.longitudinal_trends?.projected_risk_scores?.day_30 ?? "36.2"} pts
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-muted">
            <span>90d Projected:</span>
            <span className="font-mono text-fg">
              {summary.longitudinal_trends?.projected_risk_scores?.day_90 ?? "37.5"} pts
            </span>
          </div>
        </Panel>

        {/* Card 4: Telemetry Bridge */}
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <Eyebrow>Plant Asset Telemetry</Eyebrow>
            <StatusDot tone={summary.live_database_telemetry.critical_alerts_count > 0 ? "red" : "signal"} pulse />
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Monitored Assets:</span>
              <span className="font-mono text-fg">{summary.live_database_telemetry.monitored_machines}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Open Active Alerts:</span>
              <span className="font-mono text-amber">{summary.live_database_telemetry.open_alerts_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Critical Open Alerts:</span>
              <span className="font-mono text-crit">{summary.live_database_telemetry.critical_alerts_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Overdue CAPA Actions:</span>
              <span className="font-mono text-crit">{summary.live_database_telemetry.overdue_maintenance_count}</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* ---------------- Cross-Site Anomaly Alerts ---------------- */}
      {summary.cross_site_intelligence?.cross_site_anomalies?.length > 0 && (
        <div className="border border-amber/40 bg-amber/[0.04] p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber">
              Cross-Site Anomaly Warning Detected
            </span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {summary.cross_site_intelligence.cross_site_anomalies.map((anom, idx) => (
              <div key={idx} className="border border-line bg-black/40 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-fg">{anom.site}</span>
                  <Badge tone="amber">Z-Score: {anom.z_score}</Badge>
                </div>
                <p className="mt-1 text-muted">{anom.systemic_alert}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- Interactive ML Workbenches -------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Module 1: Incident Classifier */}
        <Panel
          title="Incident Classification Model"
          meta="TF-IDF + Dual-Head Calibrated Logistic Regression"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted">Incident Narrative Description:</label>
              <textarea
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-line bg-ink p-2.5 font-mono text-xs text-fg focus:border-signal focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setIncidentText(
                    "Coolant mist ventilation failed causing acute respiratory irritation to operator during CNC cleaning."
                  )
                }
                className="border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                Example: Chemical
              </button>
              <button
                type="button"
                onClick={() =>
                  setIncidentText(
                    "Operator slipped on pooling hydraulic oil behind lathe on unpainted concrete floor."
                  )
                }
                className="border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                Example: Slip/Trip/Fall
              </button>
              <button
                type="button"
                onClick={() =>
                  setIncidentText(
                    "Arc flash occurred during 480V breaker reset on main feeder line without LOTO signoff."
                  )
                }
                className="border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                Example: Electrical
              </button>
            </div>

            <button
              onClick={handleClassifyIncident}
              disabled={incidentLoading}
              className="flex items-center gap-2 border border-signal bg-signal/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-led transition hover:bg-signal/20 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {incidentLoading ? "Analyzing Narrative..." : "Classify Incident"}
            </button>

            {incidentResult && (
              <div className="mt-4 border border-line bg-black/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Predicted Category:</span>
                  <Badge tone="emerald" className="font-semibold text-xs">
                    {incidentResult.predicted_category} ({Math.round(incidentResult.category_confidence * 100)}%)
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Predicted Severity:</span>
                  <RiskBadge level={incidentResult.predicted_severity.toUpperCase()} solid />
                </div>
                <div>
                  <p className="engrave text-[10px] text-dim mb-1">Confidence Distribution:</p>
                  <div className="space-y-1">
                    {Object.entries(incidentResult.category_distribution || {}).map(([cat, prob]: any) => (
                      <div key={cat} className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">{cat}</span>
                        <span className="font-mono text-fg">{Math.round(prob * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* Module 2: Near-Miss Triage */}
        <Panel
          title="Near-Miss Triage & Root-Cause Classifier"
          meta="Multi-head calibrated triage pipeline"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted">Near-Miss Event Observation:</label>
              <textarea
                value={nearMissText}
                onChange={(e) => setNearMissText(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-line bg-ink p-2.5 font-mono text-xs text-fg focus:border-signal focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setNearMissText(
                    "Worker witnessed climbing on conveyor rail to clear jammed carton instead of retrieving safety ladder."
                  )
                }
                className="border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                Example: Unsafe Act
              </button>
              <button
                type="button"
                onClick={() =>
                  setNearMissText(
                    "Secondary brake on 10-ton overhead hoist slipped 10cm before holding loaded stamping die."
                  )
                }
                className="border border-line bg-white/[0.02] px-2 py-1 text-[10px] text-muted hover:text-fg"
              >
                Example: Equipment Fail
              </button>
            </div>

            <button
              onClick={handleTriageNearMiss}
              disabled={nearMissLoading}
              className="flex items-center gap-2 border border-signal bg-signal/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-led transition hover:bg-signal/20 disabled:opacity-50"
            >
              <Shield className="h-3.5 w-3.5" />
              {nearMissLoading ? "Triaging Event..." : "Triage Near-Miss"}
            </button>

            {nearMissResult && (
              <div className="mt-4 border border-line bg-black/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Classification:</span>
                  <Badge tone={nearMissResult.is_near_miss ? "emerald" : "amber"}>
                    {nearMissResult.is_near_miss ? "Near-Miss Event" : "Recordable Incident"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Root-Cause Domain:</span>
                  <span className="font-mono text-xs font-medium text-fg">{nearMissResult.root_cause_domain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Potential Severity:</span>
                  <RiskBadge level={nearMissResult.potential_severity.toUpperCase()} />
                </div>
                {nearMissResult.escalate_urgency && (
                  <div className="border border-crit/40 bg-crit/10 p-2.5 text-xs text-crit">
                    Immediate Action Escalation Recommended: Severe/Catastrophic injury potential if left unaddressed.
                  </div>
                )}
                <p className="text-xs text-muted italic">{nearMissResult.recommended_focus}</p>
              </div>
            )}
          </div>
        </Panel>

        {/* Module 3: Similar Hazard Retrieval */}
        <Panel
          title="Similar Hazard Search (Verified Past Mitigations)"
          meta="TF-IDF vector space semantic matching"
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted">Search Query / Observed Condition:</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={hazardQuery}
                  onChange={(e) => setHazardQuery(e.target.value)}
                  className="flex-1 border border-line bg-ink p-2 font-mono text-xs text-fg focus:border-signal focus:outline-none"
                />
                <button
                  onClick={handleSearchHazards}
                  disabled={hazardLoading}
                  className="border border-line bg-raised px-4 py-2 font-mono text-xs uppercase text-fg hover:border-signal hover:text-led"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {hazardMatches && (
              <div className="space-y-3">
                {hazardMatches.map((m, idx) => (
                  <div key={idx} className="border border-line bg-black/40 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-led font-semibold">{m.hazard_id}</span>
                      <Badge tone="emerald">{Math.round(m.similarity_score * 100)}% match</Badge>
                    </div>
                    <p className="text-fg">{m.historical_description}</p>
                    <div className="border-t border-line/50 pt-1.5 text-[11px] text-muted">
                      <span className="font-semibold text-led">Verified Historical Resolution: </span>
                      {m.historical_resolution}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {/* Module 4: CAPA Overdue Forecaster */}
        <Panel
          title="CAPA Corrective Action Overdue Predictor"
          meta="Gradient Boosting dual-pipeline delay forecaster"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-muted">Priority:</label>
                <select
                  value={actionPriority}
                  onChange={(e) => setActionPriority(e.target.value)}
                  className="mt-1 w-full border border-line bg-ink p-1.5 text-fg"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-muted">Complexity:</label>
                <select
                  value={actionComplexity}
                  onChange={(e) => setActionComplexity(e.target.value)}
                  className="mt-1 w-full border border-line bg-ink p-1.5 text-fg"
                >
                  <option value="Simple">Simple</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Complex">Complex</option>
                </select>
              </div>
              <div>
                <label className="text-muted">Allocated Days:</label>
                <input
                  type="number"
                  value={actionDays}
                  onChange={(e) => setActionDays(Number(e.target.value))}
                  className="mt-1 w-full border border-line bg-ink p-1.5 text-fg font-mono"
                />
              </div>
              <div>
                <label className="text-muted">Assignee Active Tickets:</label>
                <input
                  type="number"
                  value={actionTickets}
                  onChange={(e) => setActionTickets(Number(e.target.value))}
                  className="mt-1 w-full border border-line bg-ink p-1.5 text-fg font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                id="vendorCheck"
                checked={actionVendor}
                onChange={(e) => setActionVendor(e.target.checked)}
                className="accent-signal"
              />
              <label htmlFor="vendorCheck">External contractor / vendor parts required</label>
            </div>

            <button
              onClick={handlePredictOverdue}
              disabled={actionLoading}
              className="flex items-center gap-2 border border-signal bg-signal/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-led transition hover:bg-signal/20 disabled:opacity-50"
            >
              <Clock className="h-3.5 w-3.5" />
              {actionLoading ? "Forecasting..." : "Forecast Overdue Likelihood"}
            </button>

            {actionResult && (
              <div className="border border-line bg-black/50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Overdue Breach Probability:</span>
                  <span className="font-mono text-sm font-semibold text-fg">
                    {Math.round(actionResult.overdue_probability * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Overdue Risk Level:</span>
                  <RiskBadge level={actionResult.risk_level.toUpperCase()} />
                </div>
                {actionResult.predicted_days_delay > 0 && (
                  <div className="flex items-center justify-between text-amber">
                    <span>Forecasted Schedule Delay:</span>
                    <span className="font-mono font-bold">+{actionResult.predicted_days_delay} days beyond SLA</span>
                  </div>
                )}
                <div className="border-t border-line/40 pt-2 text-[11px] text-muted">
                  <span className="font-semibold text-fg">Identified Friction Factors: </span>
                  {actionResult.friction_factors?.join(", ")}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
