# Kimchi Data OS — Enterprise AI Analytics Operating System

> **Version**: 3.1.0  
> **License**: MIT  
> **Compatibility**: Kimchi, Claude Code, Cursor, Codex, VS Code  
> **Author**: Enterprise Analytics Architecture Team

---

## What is Kimchi Data OS?

Kimchi Data OS is an **enterprise-grade AI Analytics Operating System** that transforms a single AI agent into a **full analytics consulting firm**. It provides specialized agents, knowledge bases, workflows, templates, examples, business frameworks, statistical decision trees, forecasting capabilities, root cause analysis engines, self-critique mechanisms, confidence scoring, business memory, KPI libraries, visualization rules, and data governance — all orchestrated by a Chief Analytics Officer.

### Philosophy

- **Think before acting** — Every task begins with business context, hypotheses, and risk assessment
- **Business-first, not code-first** — We speak in ROI, risk, and strategic impact, not just accuracy scores
- **Modular by design** — Each component is independent, testable, and swappable
- **Enterprise quality** — Production-grade code, reproducible analysis, documented decisions
- **Self-validating** — The system actively tries to disprove its own conclusions
- **Knowledge-driven** — Decisions backed by comprehensive domain knowledge
- **Confidence-aware** — Every insight includes confidence scoring

---

## Architecture

```
Kimchi Data OS
│
├── SKILL.md                           # Master Orchestrator (Chief Analytics Officer)
├── README.md                          # This file
│
├── agents/                            # 14 Specialist Agents
│   ├── business-consultant.md
│   ├── data-auditor.md
│   ├── data-cleaner.md
│   ├── data-analyst.md
│   ├── statistician.md
│   ├── feature-engineer.md
│   ├── data-scientist.md
│   ├── ml-engineer.md
│   ├── forecast-engineer.md
│   ├── sql-expert.md
│   ├── python-engineer.md
│   ├── dashboard-designer.md
│   ├── report-writer.md
│   └── executive-advisor.md
│
├── knowledge/                         # Shared Knowledge Bases
│   ├── statistics.md
│   ├── forecasting.md
│   ├── forecasting-ecosystem.md       # NEW: Scenario planning, simulation, uncertainty
│   ├── business-frameworks.md
│   ├── sql-best-practices.md
│   ├── machine-learning.md
│   ├── feature-engineering.md
│   ├── visualization.md
│   ├── visualization-library.md       # NEW: Comprehensive visualization guide
│   ├── data-governance.md
│   ├── governance-ecosystem.md        # NEW: PII, compliance, lineage, auditability
│   └── kpis/
│       ├── sales.md
│       ├── marketing.md
│       ├── finance.md
│       ├── hr.md
│       ├── manufacturing.md
│       └── supply-chain.md
│
├── domains/                           # NEW: Optional Domain Packs
│   ├── retail.md
│   ├── finance.md
│   ├── healthcare.md
│   ├── manufacturing.md
│   └── marketing.md
│
├── workflows/                         # Reusable Process Templates
│   ├── eda.md
│   ├── forecasting.md
│   ├── classification.md
│   ├── regression.md
│   ├── clustering.md
│   ├── ab-testing.md
│   ├── churn.md
│   ├── cohort-analysis.md
│   ├── root-cause.md
│   └── dashboard.md
│
├── templates/                         # Output Templates
│   ├── executive-report.md
│   ├── dashboard.md
│   ├── prediction.md
│   ├── eda.md
│   ├── stakeholder.md
│   └── technical.md
│
├── examples/                          # Real-World Examples
│   ├── sales-analysis/
│   ├── sales-diagnosis/               # NEW: Comprehensive sales diagnosis
│   ├── customer-churn/
│   ├── customer-segmentation/         # NEW: RFM + clustering analysis
│   ├── fraud/
│   ├── inventory/
│   ├── marketing/
│   ├── pricing/
│   └── forecasting/
│
├── policies/                          # Data Governance Policies
│   ├── data-quality-policy.md
│   └── data-privacy-policy.md
│
├── checklists/                        # Quality Checklists
│   ├── analysis-checklist.md
│   └── model-checklist.md
│
├── playbooks/                         # Operational Playbooks
│   ├── analysis-playbook.md
│   ├── model-playbook.md
│   └── report-playbook.md
│
├── memory/                            # Business Memory
│   └── business-memory.md
│
├── prompts/                           # Reusable Prompts
│   ├── analysis-prompts.md
│   ├── model-prompts.md
│   └── report-prompts.md
│
├── registry/                          # NEW: Capability Registry
│   └── capability-registry.md         # Machine-readable component registry
│
├── contracts/                         # NEW: Formal Contracts
│   └── agent-contract.md              # Standard contract specification
│
├── plugins/                           # NEW: Plugin System
│   └── plugin-system.md               # Plugin architecture and manager
│
├── testing/                           # NEW: Automated Testing
│   └── testing-framework.md           # Test framework and examples
│
├── scripts/                           # Utility Scripts (placeholder)
├── benchmarks/                        # Model Performance Benchmarks (placeholder)
└── references/                        # External References (placeholder)
```

---

## Components

### 1. Knowledge Base (16 files)

Comprehensive reference material for all analytical domains:

| Knowledge Area | File | Content |
|----------------|------|---------|
| Statistics | `statistics.md` | Hypothesis testing, distributions, tests, decision trees |
| Forecasting | `forecasting.md` | Time series methods, ARIMA, Prophet, uncertainty quantification |
| Forecasting Ecosystem | `forecasting-ecosystem.md` | **NEW**: Scenario planning, simulation, optimization, real-time forecasting |
| Business Frameworks | `business-frameworks.md` | SWOT, PESTEL, Porter's Five Forces, AARRR, RFM, LTV/CAC |
| SQL | `sql-best-practices.md` | Query optimization, window functions, data quality |
| Machine Learning | `machine-learning.md` | Algorithms, evaluation, feature selection, ensemble methods |
| Feature Engineering | `feature-engineering.md` | Numerical, categorical, temporal, interaction features |
| Visualization | `visualization.md` | Chart selection, color palettes, dashboard design |
| Visualization Library | `visualization-library.md` | **NEW**: Comprehensive chart specs, accessibility, design systems |
| Data Governance | `data-governance.md` | Privacy, GDPR, HIPAA, anonymization, lineage, audit logs |
| Governance Ecosystem | `governance-ecosystem.md` | **NEW**: PII detection, compliance frameworks, lineage tracking, audit trails |
| KPIs | `kpis/*.md` | Industry-standard metrics for Sales, Marketing, Finance, HR, Manufacturing, Supply Chain |

### 2. Domain Packs (5 files) — NEW

Optional industry-specific modules:

| Domain | File | Content |
|--------|------|---------|
| Retail | `retail.md` | POS analytics, inventory optimization, store performance |
| Finance | `finance.md` | Financial ratios, valuation, credit risk, portfolio analysis |
| Healthcare | `healthcare.md` | Clinical quality, patient outcomes, operational efficiency |
| Manufacturing | `manufacturing.md` | OEE, quality control, predictive maintenance, supply chain |
| Marketing | `marketing.md` | Campaign analytics, attribution, customer journey, content performance |

### 3. Workflows (10 files)

Step-by-step processes for common analytical tasks:

| Workflow | Purpose |
|----------|---------|
| `eda.md` | Exploratory Data Analysis |
| `forecasting.md` | Time Series Forecasting |
| `classification.md` | Binary/Multi-class Classification |
| `regression.md` | Continuous Outcome Prediction |
| `clustering.md` | Customer/Group Segmentation |
| `ab-testing.md` | Experiment Design & Analysis |
| `churn.md` | Customer Churn Prediction & Prevention |
| `cohort-analysis.md` | Cohort Retention & Revenue Analysis |
| `root-cause.md` | Root Cause Analysis (5 Whys, Fishbone, Pareto) |
| `dashboard.md` | Dashboard Design & Implementation |

### 4. Templates (6 files)

Standardized output formats:

| Template | Use Case |
|----------|----------|
| `executive-report.md` | C-suite summaries |
| `dashboard.md` | BI dashboard specifications |
| `prediction.md` | Forecast and model predictions |
| `eda.md` | Exploratory analysis reports |
| `stakeholder.md` | Stakeholder communications |
| `technical.md` | Technical documentation |

### 5. Examples (9 directories)

Real-world analysis examples with comprehensive documentation:

| Example | Domain | Complexity |
|---------|--------|------------|
| `sales-analysis/` | Revenue diagnosis | Medium |
| `sales-diagnosis/` | **NEW**: Multi-dimensional sales diagnosis | High |
| `customer-churn/` | Churn prediction and intervention | High |
| `customer-segmentation/` | **NEW**: RFM + behavioral clustering | High |
| `fraud/` | Fraud detection system | High |
| `inventory/` | Inventory optimization | Medium |
| `marketing/` | Marketing ROI and attribution | Medium |
| `pricing/` | Price elasticity and optimization | High |
| `forecasting/` | Demand forecasting system | High |

### 6. Forecasting Ecosystem — NEW

Complete forecasting subsystem with advanced capabilities:

**Scenario Planning**:
- Baseline, optimistic, pessimistic scenarios
- Stress testing and what-if analysis
- Variable-level assumption changes

**Simulation**:
- Monte Carlo simulation
- Bootstrap forecasting
- Regime-switching models

**Uncertainty Quantification**:
- Prediction intervals (analytical, bootstrap, Bayesian)
- Conformal prediction
- Calibrated confidence intervals

**Optimization**:
- Inventory optimization
- Pricing optimization
- Resource allocation

**Real-time Forecasting**:
- Streaming updates
- Anomaly detection
- Model drift monitoring

### 7. Governance Ecosystem — NEW

Enterprise-grade data governance:

**Privacy Protection**:
- PII detection (regex, NER)
- Anonymization (hashing, masking, k-anonymity)
- Data masking (partial, full, tokenize)

**Compliance Frameworks**:
- GDPR compliance checker
- HIPAA compliance validator
- CCPA compliance monitor

**Data Lineage**:
- Transformation tracking
- Source-to-destination mapping
- Impact analysis

**Reproducibility**:
- Code versioning (Git integration)
- Data versioning
- Model versioning

**Auditability**:
- Audit logging
- Audit trail integrity
- Compliance reporting

### 8. Visualization Library — NEW

Comprehensive visualization knowledge base:

**Chart Selection Guide**:
- Data type → chart mapping
- When to use each chart type
- Common mistakes to avoid

**Color Systems**:
- Sequential, diverging, categorical palettes
- Colorblind-friendly options
- Accessibility standards

**Design Principles**:
- Layout and grid systems
- Typography guidelines
- Visual hierarchy

**Component Library**:
- Bar, line, scatter, heatmap specifications
- Dashboard layout templates
- KPI card components

### 9. Statistical Decision Tree

Interactive guide for selecting the right statistical test:

```
Need hypothesis?
├─ How many groups?
│   ├─ 1 group → One-sample t-test
│   ├─ 2 groups
│   │   ├─ Independent → t-test or Mann-Whitney
│   │   └─ Paired → Paired t-test or Wilcoxon
│   └─ 3+ groups → ANOVA or Kruskal-Wallis
├─ Relationship?
│   ├─ Continuous → Correlation
│   ├─ Categorical → Chi-square
│   └─ Mixed → t-test or ANOVA
└─ Prediction?
    ├─ Continuous → Regression
    ├─ Binary → Logistic regression
    └─ Count → Poisson regression
```

### 10. Root Cause Engine

Systematic cause identification:

- **5 Whys**: Drill down to root cause
- **Fishbone Diagram**: Category-based cause mapping
- **Pareto Analysis**: 80/20 rule identification
- **SHAP Analysis**: Model-based feature importance
- **Counterfactual Analysis**: What-if scenarios
- **Driver Decomposition**: Factor contribution analysis

### 11. Self-Critique Mechanism

Built-in quality assurance:

- Devil's advocate questions
- Alternative explanation seeking
- Bias detection (confirmation, selection, survivorship)
- Data leakage checks
- Sample size adequacy
- Confounder identification

### 12. Confidence Engine

Every insight includes:

- **Confidence Score**: 0-100% with rationale
- **Evidence Strength**: Statistical significance, sample size
- **Model Agreement**: Multiple models consistent?
- **Business Logic**: Does it make sense?
- **Limitations**: What could invalidate this?

### 13. Business Memory

Persistent context across sessions:

- Company profile and objectives
- Key metrics and definitions
- Previous analyses and findings
- Known assumptions and issues
- Stakeholder preferences
- Organizational structure

### 14. KPI Library

Industry-standard metrics across 6 domains:

| Domain | Key Metrics |
|--------|-------------|
| Sales | Revenue, Conversion, LTV, Churn, Pipeline |
| Marketing | CAC, ROAS, CTR, NPS, Attribution |
| Finance | Margin, ROE, Cash Flow, Working Capital |
| HR | Turnover, Time-to-Fill, Engagement, eNPS |
| Manufacturing | OEE, Quality, Cycle Time, Safety |
| Supply Chain | OTD, Inventory Turns, Fill Rate, Forecast Accuracy |

### 15. Capability Registry — NEW

Machine-readable registry for dynamic orchestration:

- **Agent Registry**: All agents with inputs, outputs, dependencies
- **Engine Registry**: Analytical engines with capabilities
- **Workflow Registry**: Process templates with step definitions
- **Knowledge Registry**: Reference materials and topics
- **Template Registry**: Output format specifications

### 16. Formal Contracts — NEW

Standardized component specifications:

- **Purpose**: What the component does and when to use it
- **Inputs/Outputs**: Typed interface definitions
- **Dependencies**: Required knowledge, packages, agents
- **Failure Modes**: How to handle errors gracefully
- **Quality Gates**: Validation checks before completion

### 17. Plugin System — NEW

Extensible architecture for adding capabilities:

- **Plugin Manifest**: YAML-based plugin specification
- **Plugin Manager**: Installation, loading, lifecycle management
- **Hook System**: Pre/post analysis hooks
- **Marketplace**: Discover and install community plugins
- **Isolation**: Plugins run in sandboxed context

### 18. Automated Testing — NEW

Comprehensive testing framework:

- **Prompt Testing**: Validate prompt quality and consistency
- **Workflow Testing**: Test end-to-end execution
- **Component Testing**: Verify agent and engine contracts
- **Output Testing**: Validate output format and quality
- **Integration Testing**: Test complete pipelines

---

## Quick Start

### 1. Install

```bash
# For Kimchi
mkdir -p ~/.kimchi/skills/kimchi-data-os
cp -r * ~/.kimchi/skills/kimchi-data-os/

# For Claude Code
mkdir -p ~/.claude/skills/kimchi-data-os
cp -r * ~/.claude/skills/kimchi-data-os/
```

### 2. Activate

The master orchestrator (`SKILL.md`) auto-detects data-related tasks.

**Primary triggers:**
- Dataset uploads (CSV, Excel, JSON, Parquet, SQL)
- Keywords: *analyze, forecast, predict, model, clean, dashboard, report, A/B test, churn, sales*

### 3. Use

Simply describe your business problem in natural language.

**Example:**
> "Our sales dropped 18% last quarter. Can you analyze why and predict next quarter?"

**What happens internally:**
1. Business Consultant frames the problem
2. Data Auditor assesses available data
3. Data Analyst performs diagnostic EDA
4. Statistician validates findings
5. Forecast Engineer builds prediction models
6. Executive Advisor delivers strategic recommendations
7. Report Writer produces multi-audience output

### 4. Install Domain Packs (Optional)

For industry-specific analysis:

```bash
# Retail analytics
cp domains/retail.md ~/.kimchi/skills/kimchi-data-os/knowledge/

# Finance analytics
cp domains/finance.md ~/.kimchi/skills/kimchi-data-os/knowledge/

# Healthcare analytics
cp domains/healthcare.md ~/.kimchi/skills/kimchi-data-os/knowledge/

# Manufacturing analytics
cp domains/manufacturing.md ~/.kimchi/skills/kimchi-data-os/knowledge/

# Marketing analytics
cp domains/marketing.md ~/.kimchi/skills/kimchi-data-os/knowledge/
```

---

## Quality Assurance

### The 5-Layer Validation System

1. **Data Quality Gate** — Completeness, validity, consistency, freshness
2. **Statistical Rigor Gate** — Assumptions, effect sizes, confidence intervals
3. **Model Quality Gate** — Holdout validation, cross-validation, fairness
4. **Business Logic Gate** — Recommendations make sense, impact quantified
5. **Communication Gate** — Audience-appropriate, executive summary first

### Self-Validation Protocol

Before delivery, the system asks:
- What would make this analysis wrong?
- Are there alternative explanations?
- Could selection bias explain this?
- Are we overfitting to noise?
- Would a simpler explanation fit better?

---

## Roadmap

- [x] v1.0: Monolithic data science skill
- [x] v2.0: Modular agent system with orchestration
- [x] v3.0: Complete knowledge base, workflows, templates, examples, and governance
- [x] v3.1: Domain packs, forecasting ecosystem, governance ecosystem, visualization library
- [x] v3.2: Capability registry, formal contracts, plugin system, automated testing
- [ ] v3.3: Automated SQL generation and database integration
- [ ] v3.4: Real-time dashboard generation (Streamlit, Dash)
- [ ] v4.0: Multi-modal analysis (text, image, time series)
- [ ] v5.0: Self-improving agent system with feedback loops

---

## License

MIT License — See LICENSE file for details.

---

*Built for Kimchi. Designed for enterprise. Ready for production.*
