---
name: analytics
description: >-
  Data OS Analytics Intelligence Layer for OpenDash.
  Provides enterprise-grade business analytics capabilities including
  forecasting, classification, regression, segmentation, A/B testing,
  root cause analysis, and dashboard design.
  Use when the user provides datasets, asks for data analysis, predictive modeling,
  forecasting, business intelligence, A/B testing, data cleaning, dashboard creation,
  or strategic recommendations.
  Triggers on: CSV/Excel/JSON/Parquet/SQL data, "analyze", "forecast", "predict", "model",
  "clean", "dashboard", "report", "A/B test", "churn", "sales", "revenue", "customer segmentation",
  "root cause", "why did", "what if", "scenario", "trend", "KPI", "metrics", "insight".
license: MIT
compatibility:
  - opendash
  - mimo
  - opendash
metadata:
  author: Data OS Team
  version: 5.0.0
  tags:
    - analytics
    - data-science
    - business-intelligence
    - forecasting
    - machine-learning
allowed-tools:
  - read
  - write
  - bash
  - python
  - grep
  - glob
---

# DATA OS ANALYTICS INTELLIGENCE LAYER

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Activation](#2-activation)
3. [Architecture](#3-architecture)
4. [Capabilities](#4-capabilities)
5. [Workflows](#5-workflows)
6. [Quality Gates](#6-quality-gates)
7. [Memory System](#7-memory-system)
8. [Output Standards](#8-output-standards)

---

## 1. OVERVIEW

The Data OS Analytics Intelligence Layer is an enterprise-grade business analytics subsystem integrated into OpenDash.

### Key Features

- **14 Specialized Agents**: Business Consultant, Data Auditor, Data Cleaner, Data Analyst, Statistician, Feature Engineer, Data Scientist, ML Engineer, Forecast Engineer, SQL Expert, Python Engineer, Dashboard Designer, Report Writer, Executive Advisor
- **10 Analytics Workflows**: Forecasting, Classification, Regression, Clustering, Churn Prediction, Root Cause Analysis, A/B Testing, Cohort Analysis, EDA, Dashboard Design
- **5-Layer Quality Gates**: Data Quality, Statistical Rigor, Model Quality, Business Logic, Communication
- **Analytics Memory**: Separate memory system for KPIs, stakeholders, assumptions, and business context
- **Multi-Audience Output**: Executive Summary, Manager Report, Analyst Report, Technical Appendix

### Architecture Principle

**Data OS decides WHAT to do and WHY. OpenDash executes HOW to do it.**

Data OS never executes tools directly. It provides orchestration, planning, workflows, business reasoning, and domain knowledge. OpenDash handles sessions, providers, tools, MCP, memory, and streaming.

---

## 2. ACTIVATION

### Primary Triggers (Auto-Activate)

- User uploads or references any dataset (CSV, Excel, JSON, Parquet, SQL, API)
- Keywords: analyze, forecast, predict, model, regression, classification, clustering
- Keywords: clean, quality, missing values, outliers, data audit
- Keywords: dashboard, report, visualization, chart, KPI, metrics
- Keywords: A/B test, statistical significance, hypothesis, correlation
- Keywords: sales forecast, revenue prediction, churn, demand forecasting
- Keywords: customer segmentation, cohort, RFM, lifetime value
- Keywords: root cause, why did, what happened, trend analysis
- Keywords: what if, scenario, simulation, sensitivity analysis

### Secondary Triggers (Context-Dependent)

- "Our metrics are down"
- "How do we optimize X?"
- "Which customers are at risk?"
- "Compare this to last year"
- "What drives customer behavior?"
- "Should we launch this feature?"
- "How much should we budget?"

### Do NOT Activate

- Pure coding tasks (no data component)
- General programming questions
- Creative writing
- System administration
- Simple arithmetic without business context

---

## 3. ARCHITECTURE

```
User Request
    ↓
Intent Classification
    ↓
┌────────────┴────────────┐
│                         │
▼                         ▼
General OpenDash       Analytics Request
│                         │
│                         ▼
│             Analytics Orchestrator
│                         │
│               Capability Registry
│                         │
│                  Workflow Planner
│                         │
│              Engine & Domain Selection
│                         │
└──────────────┬──────────┘
               ▼
    OpenDash Prompt Builder
               │
               ▼
       OpenDash Tool Runtime
  (Bash • Python • SQL • MCP • Files)
               │
               ▼
         LLM Provider Layer
               │
               ▼
      Validated Business Report
```

### Components

1. **Loader**: Loads and indexes all Data OS markdown knowledge at startup
2. **Capability Registry**: Runtime-aware registry mapping capabilities to workflows, engines, and tools
3. **Router**: Classifies requests and routes to appropriate handler
4. **Orchestrator**: The CAO - understands business problems, decomposes tasks, builds execution plans
5. **Planner**: Produces detailed execution plans before LLM starts
6. **Workflow Engine**: Manages workflow execution and state
7. **Engine Registry**: Manages different analytics engines (Python, SQL, ML, etc.)
8. **Memory**: Separate memory system for analytics context
9. **Prompt Builder**: Extends OpenDash's prompt building with analytics context

---

## 4. CAPABILITIES

### 4.1 Time Series Forecasting
- Generate forecasts with uncertainty quantification
- Scenario analysis (best/base/worst case)
- Backtesting on historical data
- Multiple algorithms benchmarked

### 4.2 Classification Modeling
- Binary or multi-class prediction
- Feature importance analysis
- Model interpretability (SHAP)
- Fairness audit

### 4.3 Regression Modeling
- Continuous outcome prediction
- Residual analysis
- Regularization
- Feature importance

### 4.4 Customer Segmentation
- K-means, hierarchical, DBSCAN clustering
- Segment profiling
- Visualization
- Actionable insights

### 4.5 Churn Prediction
- Predict customer churn
- Risk segmentation
- Intervention recommendations
- Retention ROI calculation

### 4.6 Root Cause Analysis
- Diagnostic analytics
- 5 Whys analysis
- Fishbone diagram synthesis
- Evidence chain

### 4.7 A/B Testing
- Experiment design
- Statistical significance testing
- Power analysis
- Multiple comparison correction

### 4.8 Cohort Analysis
- Retention curves
- Cohort comparison
- Revenue by cohort
- Lifecycle analysis

### 4.9 Exploratory Data Analysis
- Data profiling
- Distribution analysis
- Correlation analysis
- Key findings

### 4.10 Dashboard Design
- KPI definition
- Visualization recommendations
- Interactive elements
- Mobile responsiveness

---

## 5. WORKFLOWS

### 5.1 Standard Analysis Workflow
```
[USER REQUEST]
    ↓
[1] Business Consultant → Business Context Document
    ↓
[2] Data Auditor (BLOCKING) → Data Quality Report
    ↓
[3] Data Cleaner (IF needed) → Clean Dataset
    ↓
[4] Data Analyst → EDA Report
    ↓
[5] Statistician → Statistical Validation
    ↓
[6] Data Scientist → Model Results
    ↓
[7] Executive Advisor → Strategic Recommendations
    ↓
[8] Report Writer → Final Deliverable
```

### 5.2 Forecasting Workflow
```
[USER REQUEST: "Forecast sales for next quarter"]
    ↓
[1] Business Consultant → Forecast requirements
    ↓
[2] Data Auditor → Time series data quality
    ↓
[3] Data Analyst → Decomposition, autocorrelation
    ↓
[4] Feature Engineer → Lag features, rolling stats
    ↓
[5] Forecast Engineer → Multiple algorithms
    ↓
[6] Statistician → Backtesting validation
    ↓
[7] Executive Advisor → Business interpretation
    ↓
[8] Report Writer → Forecast report
```

---

## 6. QUALITY GATES

### 5-Layer Validation System

1. **Data Quality Gate**: Completeness, validity, consistency, uniqueness, timeliness
2. **Statistical Rigor Gate**: Assumptions, effect sizes, confidence intervals, power analysis
3. **Model Quality Gate**: Baseline, cross-validation, holdout test, interpretability, fairness
4. **Business Logic Gate**: Business sense, feasibility, ROI, second-order effects
5. **Communication Gate**: Executive summary, audience-appropriate language, limitations

### Gate Failure Protocol

If ANY gate fails:
1. Document the failure
2. Assess impact
3. Route to appropriate agent
4. Re-run gate after fix
5. Escalate if needed

---

## 7. MEMORY SYSTEM

### Analytics Memory Structure

```json
{
  "session_id": "auto-generated",
  "business_context": {
    "problem_statement": "",
    "stakeholders": [],
    "decision_type": "",
    "success_criteria": [],
    "constraints": []
  },
  "datasets": [
    {
      "name": "",
      "path": "",
      "format": "",
      "rows": 0,
      "columns": 0,
      "quality_score": 0
    }
  ],
  "kpis": [
    {
      "name": "",
      "formula": "",
      "current_value": 0,
      "target_value": 0,
      "trend": ""
    }
  ],
  "analyses": [],
  "models": [],
  "assumptions": [],
  "known_issues": [],
  "previous_recommendations": []
}
```

### Memory Rules

1. **Read before acting**: Check memory before starting any new task
2. **Write after completing**: Update memory after each agent completes work
3. **Never duplicate**: Reference existing analyses rather than redoing
4. **Track evolution**: Document how understanding changes
5. **Preserve context**: Carry forward business context, assumptions, constraints

---

## 8. OUTPUT STANDARDS

### Multi-Audience Output

1. **Executive Summary** (1 page): Answer first, 3-5 key findings, top recommendations, $ impact
2. **Manager Report** (3-5 pages): Business context, methodology, findings, recommendations
3. **Analyst Report** (10-20 pages): Full methodology, statistical tests, model details
4. **Technical Appendix**: Full code, data dictionaries, reproducibility instructions

### Confidence Scoring

| Score | Meaning | Usage |
|-------|---------|-------|
| High (80-100%) | Strong evidence, multiple validations | Recommend immediate action |
| Medium (50-79%) | Moderate evidence, some validation | Recommend pilot or investigation |
| Low (20-49%) | Weak evidence, significant uncertainty | Flag as hypothesis |
| Very Low (<20%) | Insufficient evidence | Do not present as finding |

### Visualization Standards

1. Insight-driven title
2. Annotations for key data points
3. Accessible color palettes
4. Clear axis labels with units
5. Source citation
6. Bar charts start at zero
7. Show uncertainty where applicable

---

*Data OS Analytics Intelligence Layer v5.0.0*
*Licensed under MIT. Compatible with OpenDash, MiMo, and OpenDash.*