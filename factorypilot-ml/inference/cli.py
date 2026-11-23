"""Command Line Interface (CLI) for FactoryPilot ML.

Allows testing, executing, training, and evaluating all 7 ML modules
from the terminal without modifying existing backend or frontend code.
"""

from __future__ import annotations

import argparse
import json
import os
import sys

_ML_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from inference.pipeline import SafetyMLInferencePipeline


def print_json(data):
    print(json.dumps(data, indent=2, default=str))


def main():
    parser = argparse.ArgumentParser(description="FactoryPilot ML Command-Line Tool")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: train
    subparsers.add_parser("train", help="Train all 7 ML models on benchmark datasets")

    # Command: evaluate
    subparsers.add_parser("evaluate", help="Run comprehensive evaluation benchmark")

    # Command: incident
    inc_parser = subparsers.add_parser("incident", help="Classify safety incident narrative")
    inc_parser.add_argument("--text", type=str, required=True, help="Incident description narrative")

    # Command: near-miss
    nm_parser = subparsers.add_parser("near-miss", help="Triage near-miss report")
    nm_parser.add_argument("--text", type=str, required=True, help="Near-miss description narrative")

    # Command: similar
    sim_parser = subparsers.add_parser("similar", help="Find similar historical hazards")
    sim_parser.add_argument("--query", type=str, required=True, help="Hazard query description")
    sim_parser.add_argument("--top-k", type=int, default=3, help="Number of similar hazards to return")

    # Command: cross-site
    subparsers.add_parser("cross-site", help="Detect cross-site hazard pattern anomalies")

    # Command: risk-score
    risk_parser = subparsers.add_parser("risk-score", help="Score plant safety risk")
    risk_parser.add_argument("--site", type=str, default="Site-Detroit", help="Manufacturing site name")
    risk_parser.add_argument("--near-misses", type=int, default=3, help="Daily near misses")
    risk_parser.add_argument("--incidents", type=int, default=0, help="Daily incidents")
    risk_parser.add_argument("--overdue-actions", type=int, default=2, help="Overdue corrective actions count")
    risk_parser.add_argument("--vibration-anomaly", type=float, default=1.1, help="Vibration anomaly index")
    risk_parser.add_argument("--temp-anomaly", type=float, default=1.0, help="Temperature anomaly index")
    risk_parser.add_argument("--compliance-pct", type=float, default=88.5, help="Training compliance percentage")

    # Command: overdue-action
    action_parser = subparsers.add_parser("overdue-action", help="Predict CAPA action overdue risk")
    action_parser.add_argument("--priority", type=str, default="High", choices=["Low", "Medium", "High", "Critical"])
    action_parser.add_argument("--category", type=str, default="Machinery / Mechanical")
    action_parser.add_argument("--complexity", type=str, default="Moderate", choices=["Simple", "Moderate", "Complex"])
    action_parser.add_argument("--days", type=int, default=14, help="Days allocated to complete action")
    action_parser.add_argument("--tickets", type=int, default=8, help="Assignee active ticket count")
    action_parser.add_argument("--capex", type=float, default=2500.0, help="Capex required in USD")
    action_parser.add_argument("--vendor", action="store_true", help="Flag if external vendor is involved")
    action_parser.add_argument("--site", type=str, default="Site-Detroit")

    # Command: trends
    trend_parser = subparsers.add_parser("trends", help="Analyze site longitudinal trends")
    trend_parser.add_argument("--site", type=str, default=None, help="Site name (or all sites if omitted)")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "train":
        from training.train_all import train_entire_pipeline
        train_entire_pipeline()
        return

    if args.command == "evaluate":
        from evaluation.benchmark_report import export_benchmark_report
        export_benchmark_report()
        return

    pipeline = SafetyMLInferencePipeline()

    if args.command == "incident":
        result = pipeline.classify_incident(args.text)
        print_json(result)

    elif args.command == "near-miss":
        result = pipeline.triage_near_miss(args.text)
        print_json(result)

    elif args.command == "similar":
        results = pipeline.find_similar_hazards(args.query, top_k=args.top_k)
        print_json(results)

    elif args.command == "cross-site":
        result = pipeline.detect_cross_site_patterns()
        print_json(result)

    elif args.command == "risk-score":
        record = {
            "site": args.site,
            "daily_near_misses": args.near_misses,
            "daily_incidents": args.incidents,
            "open_overdue_actions": args.overdue_actions,
            "vibration_anomaly_index": args.vibration_anomaly,
            "temperature_anomaly_index": args.temp_anomaly,
            "training_compliance_pct": args.compliance_pct,
            "date": "2026-11-16"
        }
        result = pipeline.predict_safety_risk(record)
        print_json(result)

    elif args.command == "overdue-action":
        action = {
            "action_id": "CLI-TEST-01",
            "action_title": f"Resolve {args.category} hazard",
            "priority": args.priority,
            "action_category": args.category,
            "action_complexity": args.complexity,
            "days_allocated": args.days,
            "assignee_active_tickets": args.tickets,
            "capex_required_usd": args.capex,
            "vendor_involved": 1 if args.vendor else 0,
            "site": args.site
        }
        result = pipeline.predict_action_overdue(action)
        print_json(result)

    elif args.command == "trends":
        result = pipeline.analyze_site_trends(args.site)
        print_json(result)


if __name__ == "__main__":
    main()
