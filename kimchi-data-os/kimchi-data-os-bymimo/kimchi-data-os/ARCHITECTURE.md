# Kimchi Data OS Architecture

## Dependency Graph

```
Chief Analytics Officer (SKILL.md)
│
├── WORKFLOWS
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
├── AGENTS (called by workflows)
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
├── KNOWLEDGE (used by agents)
│   ├── statistics.md
│   ├── forecasting.md
│   ├── forecasting-ecosystem.md
│   ├── business-frameworks.md
│   ├── sql-best-practices.md
│   ├── machine-learning.md
│   ├── feature-engineering.md
│   ├── visualization.md
│   ├── visualization-library.md
│   ├── data-governance.md
│   ├── governance-ecosystem.md
│   └── kpis/
│       ├── sales.md
│       ├── marketing.md
│       ├── finance.md
│       ├── hr.md
│       ├── manufacturing.md
│       └── supply-chain.md
│
├── TEMPLATES (used for output)
│   ├── executive-report.md
│   ├── dashboard.md
│   ├── prediction.md
│   ├── eda.md
│   ├── stakeholder.md
│   └── technical.md
│
└── DOMAINS (optional industry packs)
    ├── retail.md
    ├── finance.md
    ├── healthcare.md
    ├── manufacturing.md
    └── marketing.md
```

## How Components Connect

### Workflow → Agent → Knowledge → Template

```
User Request: "Forecast sales for next quarter"
    │
    ▼
Workflow: forecasting.md
    │
    ├──→ Agent: data-auditor.md
    │        └──→ Knowledge: data-governance.md
    │
    ├──→ Agent: data-analyst.md
    │        └──→ Knowledge: statistics.md
    │
    ├──→ Agent: forecast-engineer.md
    │        ├──→ Knowledge: forecasting.md
    │        └──→ Knowledge: forecasting-ecosystem.md
    │
    ├──→ Agent: statistician.md
    │        └──→ Knowledge: statistics.md
    │
    └──→ Agent: report-writer.md
             └──→ Template: prediction.md
```

### Agent Contract Standard

Every agent follows this structure:

```yaml
# Purpose
- What it does
- When to use it
- When NOT to use it

# Inputs
- Required inputs
- Optional inputs
- Input validation

# Outputs
- Primary outputs
- Secondary outputs
- Output format

# Dependencies
- Required knowledge
- Required packages
- Required agents

# Failure Modes
- Error conditions
- Handling strategy
- Escalation path

# Quality Gates
- Validation checks
- Success criteria
- Thresholds
```

## Capability Registry

The capability registry (`registry/capabilities.json`) maps high-level capabilities to their components:

```json
{
  "forecasting": {
    "workflow": "workflows/forecasting.md",
    "agents": ["data-auditor", "data-analyst", "forecast-engineer", "statistician", "report-writer"],
    "knowledge": ["forecasting.md", "forecasting-ecosystem.md"],
    "template": "templates/prediction.md",
    "triggers": ["forecast", "predict", "future"]
  }
}
```

This allows the CAO to dynamically discover capabilities instead of hardcoding them.

## Data Flow

```
1. User Request
   │
2. CAO parses intent
   │
3. Registry lookup → find matching capability
   │
4. Load workflow
   │
5. Execute workflow steps:
   │
   ├── Step 1: Data Audit
   │   ├── Load agent: data-auditor
   │   ├── Load knowledge: data-governance
   │   └── Output: data_quality_report
   │
   ├── Step 2: Analysis
   │   ├── Load agent: data-analyst
   │   ├── Load knowledge: statistics
   │   └── Output: findings
   │
   ├── Step 3: Modeling (if needed)
   │   ├── Load agent: data-scientist
   │   ├── Load knowledge: machine-learning
   │   └── Output: model
   │
   └── Step 4: Reporting
       ├── Load agent: report-writer
       ├── Load template: executive-report
       └── Output: final_report
```

## Adding New Capabilities

### Option 1: Add to existing workflow
If the new capability fits an existing workflow, add it there.

### Option 2: Add new workflow
If it's genuinely new, create a new workflow file.

### Option 3: Add domain pack
If it's industry-specific, add to `domains/`.

### When to add vs extend
- **Extend**: Similar to existing, minor differences
- **Add new**: Fundamentally different process
- **Domain pack**: Industry-specific variation

## Versioning

- **Core**: Stable, rarely changes
- **Agents**: Can be updated independently
- **Knowledge**: Regular updates with new research
- **Workflows**: Moderate stability
- **Templates**: Very stable

## Design Principles

1. **Single responsibility**: Each component does one thing well
2. **Loose coupling**: Components connect through contracts
3. **No duplication**: Knowledge lives in one place
4. **Composition over inheritance**: Build from small pieces
5. **Fail gracefully**: Every component handles errors