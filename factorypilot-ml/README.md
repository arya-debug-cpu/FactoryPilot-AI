# FactoryPilot ML — Standalone Industrial Safety Intelligence Module

A completely isolated, modular Machine Learning system for **FactoryPilot AI**, specialized in industrial health, safety, and environmental (EHS) intelligence, hazard detection, and predictive safety analytics.

> [!IMPORTANT]
> **Strict Project Isolation**: This module is completely self-contained within `factorypilot-ml/`. It introduces zero modifications, dependencies, or schema changes to the existing FactoryPilot frontend, backend, or database.

---

## 1. Architecture & Directory Structure

```
factorypilot-ml/
├── datasets/                     # Data loading, validation, and sample generators
│   ├── sample_data/              # Labeled sample benchmark CSV datasets
│   │   ├── incident_reports_sample.csv
│   │   ├── near_miss_reports_sample.csv
│   │   ├── hazard_reports_sample.csv
│   │   ├── corrective_actions_sample.csv
│   │   └── site_safety_metrics_sample.csv
│   ├── data_loader.py            # Validated dataset loaders with schema checks
│   └── synthetic_generator.py    # Deterministic EHS benchmark generator
├── preprocessing/                # Feature engineering & text tokenizers
│   ├── text_preprocessor.py      # Industrial acronym expansion (PPE, LOTO, E-Stop...)
│   ├── tabular_pipeline.py       # Scikit-learn ColumnTransformer builders
│   └── feature_engineering.py    # Heinrich safety ratio, workload density
├── models/                       # 7 Core Safety ML Implementations
│   ├── incident_classifier.py    # Dual-head incident category & severity model
│   ├── near_miss_classifier.py   # Multi-output near-miss triage model
│   ├── hazard_similarity_engine.py # TF-IDF semantic vector search for past mitigations
│   ├── cross_site_pattern_detector.py # Multi-plant hazard anomaly & clustering detector
│   ├── safety_risk_scorer.py     # Gradient Boosting composite risk scorer (0-100)
│   ├── overdue_action_predictor.py # CAPA deadline breach & delay forecaster
│   └── site_safety_trend_analyzer.py # Longitudinal trend analysis & 30/60/90d projections
├── training/                     # Standalone & master training pipelines
│   ├── train_all.py              # Master runner: trains and persists all 7 models
│   ├── train_incident_classifier.py
│   ├── train_near_miss_classifier.py
│   ├── train_hazard_similarity.py
│   ├── train_safety_risk_scorer.py
│   ├── train_overdue_action_predictor.py
│   └── train_site_safety_trend.py
├── evaluation/                   # Evaluation metrics & benchmark generator
│   ├── evaluate_all.py           # Evaluates all models against holdout sets
│   ├── metrics.py                # Accuracy, Precision, Recall, F1, MAE, RMSE, R²
│   └── benchmark_report.py       # Generates JSON & Markdown benchmark reports
├── inference/                    # Serving & interactive interfaces
│   ├── pipeline.py               # Unified SafetyMLInferencePipeline orchestrator
│   ├── cli.py                    # Terminal CLI for testing and querying
│   └── api_service.py            # Standalone FastAPI microservice on Port 8001
├── experiments/                  # Experiment tracking and baseline comparisons
│   ├── experiment_tracker.py     # Audit trail in experiment_history.jsonl
│   ├── baseline_comparison.py    # Compares trained models to dummy baselines
│   └── benchmark_report.md       # Generated benchmark metrics
├── saved_models/                 # Serialized model artifacts (.joblib)
├── tests/                        # Full unit and integration test suite
│   ├── test_data_loader.py
│   ├── test_preprocessing.py
│   ├── test_models.py
│   ├── test_inference_pipeline.py
│   └── run_tests.py              # Zero-dependency standard unittest runner
├── requirements.txt              # ML package requirements
└── README.md                     # Documentation & usage manual
```

---

## 2. Implemented ML Capabilities

| # | Feature | Model Architecture | Inputs | Outputs |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Incident Classification** | TF-IDF (1-2 ngrams, sublinear) + Dual-Head Calibrated Logistic Regression | Raw narrative text | Primary category (8 classes), severity (`Low`, `Medium`, `High`, `Critical`), probability distributions |
| **2** | **Near-Miss Classification** | Multi-Head Calibrated TF-IDF Classifier | Near-miss narrative | Distinction (`is_near_miss`), root-cause domain (5 classes), potential severity (`Minor` to `Catastrophic`), urgency flag |
| **3** | **Similar Hazard Detection** | Vector Space Cosine Similarity + BM25-style Ranking | Incident/hazard description | Top-K matching historical hazards, similarity score (0-1.0), historical verified resolutions & lessons learned |
| **4** | **Cross-Site Hazard Pattern Detection** | Site-by-Category Cross-tabulation + K-Means Clustering + Z-Score Spike Detector | Multi-site telemetry | Fleet-wide hazard correlations, plant clusters, statistical anomaly spikes (Z > 1.8) |
| **5** | **Safety Risk Scoring** | Gradient Boosting Regressor with ColumnTransformer | Plant telemetry, incidents, near misses, overdue actions, vibration, training compliance | Composite Safety Risk Score (0-100), Risk Tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), top risk drivers |
| **6** | **Corrective Action Overdue Prediction** | Dual Pipeline: Gradient Boosting Classifier + Regressor | Priority, complexity, allocated days, assignee active tickets, capex, vendor involvement | Breach likelihood (`is_overdue_risk`), probability, expected delay in days, operational friction factors |
| **7** | **Site-Level Safety Trend Analysis** | Ordinary Least Squares Linear Regression + 7d/30d Rolling Windows + Heinrich Ratio | Longitudinal plant safety records | 7d/30d moving averages, monthly risk drift, trajectory (`Improving`, `Deteriorating`, `Stable`), 30/60/90-day forward projections |

---

## 3. Sample Datasets Disclaimer

> [!WARNING]
> **Pipeline Validation Notice**: The CSV files located in `datasets/sample_data/` are benchmark sample datasets created deterministically using `datasets/synthetic_generator.py` strictly for validating pipeline throughput, preprocessing, serialization, and test automation.
>
> They are **NOT** real-world industrial incident records and **MUST NOT** be relied upon for production critical life-safety decisions without calibration and fine-tuning on enterprise EHS records.

### Missing Real-World Datasets & Schema Requirements
To transition from benchmark validation to production readiness, the following real-world datasets should be provided:
1. **Historical OSHA 300 / 300A Logs**: Past 3-5 years of recordable injury/illness incident narratives, lost workday counts, and root cause findings.
2. **EHS Near-Miss Reporting Telemetry**: Near-miss records reported through shop-floor kiosks or mobile reporting tools.
3. **Enterprise Corrective and Preventive Action (CAPA) Database**: Jira, SAP EHS, or Intelex action item logs with timestamps of creation, assignment, initial due date, and actual completion date.
4. **Site Operational Telemetry**: Daily machine hours, maintenance logs, and training completion records.

---

## 4. How to Run the ML Module Independently

### A. Environment Setup
The ML module utilizes standard scientific Python libraries (`scikit-learn`, `numpy`, `pandas`, `scipy`, `joblib`, `fastapi`, `uvicorn`, `pydantic`).

Install dependencies (if not already installed in your Python environment):
```bash
pip install -r factorypilot-ml/requirements.txt
```

### B. Running Tests
Run the zero-dependency test suite (covers all loaders, transformers, models, and inference pipelines):
```bash
python factorypilot-ml/tests/run_tests.py
```

### C. Retraining All Models
Train all 7 models and persist artifacts to `factorypilot-ml/saved_models/`:
```bash
python factorypilot-ml/training/train_all.py
```

### D. Running Benchmarks & Baseline Comparisons
Evaluate model lift over dummy baselines:
```bash
# Generate benchmark reports (JSON & Markdown in factorypilot-ml/experiments/)
python factorypilot-ml/evaluation/benchmark_report.py

# Run head-to-head baseline comparison
python factorypilot-ml/experiments/baseline_comparison.py
```

### E. Using the Standalone CLI
Test individual ML models directly from the command line:

```bash
# 1. Incident Classification
python factorypilot-ml/inference/cli.py incident --text "Spindle bearing seized at 8000 RPM throwing ceramic fragments into chip guard."

# 2. Near-Miss Classification
python factorypilot-ml/inference/cli.py near-miss --text "Technician bypassed lockout tagout during routine drive belt adjustment."

# 3. Similar Hazard Retrieval
python factorypilot-ml/inference/cli.py similar --query "Hydraulic fluid leaking near operator walkway" --top-k 3

# 4. Cross-Site Hazard Anomaly Detection
python factorypilot-ml/inference/cli.py cross-site

# 5. Safety Risk Scoring
python factorypilot-ml/inference/cli.py risk-score --site "Site-Detroit" --near-misses 3 --incidents 1 --overdue-actions 4 --compliance-pct 82.0

# 6. Corrective Action Overdue Prediction
python factorypilot-ml/inference/cli.py overdue-action --priority "Critical" --category "Machinery / Mechanical" --days 7 --tickets 10 --capex 8000 --vendor

# 7. Site Trend Projections
python factorypilot-ml/inference/cli.py trends --site "Site-Detroit"
```

### F. Running the Standalone REST API (Port 8001)
To run the dedicated ML inference microservice without touching existing FastAPI services:
```bash
python factorypilot-ml/inference/api_service.py
```
Interactive OpenAPI documentation will be accessible at:
`http://127.0.0.1:8001/docs`

---

## 5. Future Integration Blueprint (Optional & Manual)

When you are ready to integrate this ML module into the main FactoryPilot application, the following contracts can be established with your explicit permission:

1. **Backend Integration (`backend/app/routers/` or new router `backend/app/routers/safety_ml.py`)**:
   - Mount an internal router forwarding safety queries to `factorypilot-ml/inference/pipeline.py`.
   - Connect existing PostgreSQL database models (`Alert`, `MaintenanceRecord`) to automatic overdue prediction and incident categorization.
2. **Frontend Integration (`src/app/dashboard/` or new tab `src/app/dashboard/safety/`)**:
   - Display the calibrated Safety Risk Score (0-100) and risk tier badge.
   - Display cross-site anomaly spikes and similar hazard resolution suggestions directly inside the maintenance and alerts consoles.
