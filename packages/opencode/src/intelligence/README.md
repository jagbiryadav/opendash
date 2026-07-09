# Data OS Intelligence Layer

Enterprise-grade business analytics intelligence layer for OpenDash.

## Overview

The Data OS Intelligence Layer provides analytics capabilities that sit above OpenDash's runtime. It handles:

- **Capability Registry**: Maps capabilities to workflows, engines, and tools
- **Request Routing**: Classifies requests and routes to appropriate handlers
- **Analytics Orchestration**: The CAO (Chief Analytics Officer) that understands business problems
- **Workflow Management**: Manages execution plans and state
- **Memory System**: Separate memory for analytics context (KPIs, stakeholders, assumptions)
- **Prompt Building**: Extends OpenDash's prompts with analytics context

## Architecture

```
User Request
    ↓
Intent Classification
    ↓
Analytics Orchestrator (CAO)
    ↓
Capability Registry → Workflow Planner
    ↓
Engine & Domain Selection
    ↓
OpenDash Prompt Builder
    ↓
OpenDash Tool Runtime
    ↓
Validated Business Report
```

### Key Principle

**Data OS decides WHAT to do and WHY. OpenDash executes HOW to do it.**

- Data OS never executes tools directly
- Data OS provides orchestration, planning, workflows, business reasoning, and domain knowledge
- OpenDash handles sessions, providers, tools, MCP, memory, and streaming

## Components

### 1. Loader (`loader/`)
Loads and indexes all Data OS markdown knowledge at startup:
- Agents (14 specialized agents)
- Workflows (10 analytics workflows)
- Capabilities (10 analytics capabilities)
- Templates
- Policies
- Domains

### 2. Capability Registry (`registry/`)
Runtime-aware registry that maps capabilities to:
- Required tools (python, bash, read, write, etc.)
- Required models
- Expected outputs
- Trigger keywords

### 3. Router (`router/`)
Classifies user requests and routes them:
- Extracts keywords from request
- Matches against analytics keywords and patterns
- Calculates confidence score
- Routes to appropriate capability

### 4. Orchestrator (`orchestrator/`)
The CAO (Chief Analytics Officer) that:
- Understands business problems
- Decomposes tasks
- Chooses workflows
- Chooses engines
- Builds execution plans
- Selects tools
- Validates plans

### 5. Planner (`planner/`)
Produces detailed execution plans before LLM starts:
- Defines steps with agent, task, inputs, outputs
- Estimates duration
- Identifies required tools
- Tracks execution order

### 6. Workflow Engine (`workflow/`)
Manages workflow execution and state:
- Tracks workflow state (pending, running, completed, failed)
- Manages phase transitions
- Handles blocking phases
- Provides workflow status

### 7. Engine Registry (`engine/`)
Manages different analytics engines:
- Python Analytics Engine (pandas, numpy, scipy)
- SQL Analytics Engine (DuckDB, PostgreSQL)
- Visualization Engine (matplotlib, seaborn, plotly)
- Machine Learning Engine (scikit-learn, xgboost, lightgbm)
- Statistical Analysis Engine (scipy, statsmodels)

### 8. Memory (`memory/`)
Separate memory system for analytics context:
- Business context (problem statement, stakeholders, decision type)
- Datasets (name, path, format, quality score)
- KPIs (name, formula, current/target value, trend)
- Analyses (type, date, findings, confidence)
- Models (name, type, performance, features)
- Assumptions
- Known issues
- Previous recommendations

### 9. Prompt Builder (`prompt/`)
Extends OpenDash's prompt building with:
- System prompt with analytics context
- Workflow context
- Engine context
- Domain context
- Policies
- Templates

### 10. Adapters (`adapters/`)
Adapts analytics requests to OpenDash's existing systems:
- Session system integration
- Tool system integration
- Prompt system integration
- Plugin system hooks

### 11. Hook (`hook.ts`)
Hook into OpenDash's prompt building:
- Intercepts analytics requests
- Adds analytics context to prompts
- Routes to analytics orchestrator
- Builds execution plans

## Usage

### Automatic Activation

The intelligence layer automatically activates when the user:
- Uploads or references datasets (CSV, Excel, JSON, Parquet, SQL)
- Uses analytics keywords (analyze, forecast, predict, model, etc.)
- Asks business questions (why did, what if, how to optimize, etc.)

### Manual Activation

Use the `/analytics` skill to explicitly activate analytics mode.

### Example Interactions

```
User: "Analyze this sales.csv and forecast next quarter"
System: [Activates analytics intelligence layer]
        [Routes to forecasting workflow]
        [Executes: Business Consultant → Data Auditor → Data Analyst → Forecast Engineer → Executive Advisor → Report Writer]
        [Returns: Forecast report with confidence intervals and business recommendations]
```

```
User: "Why did revenue drop 18% last month?"
System: [Activates analytics intelligence layer]
        [Routes to root cause analysis workflow]
        [Executes: Business Consultant → Data Auditor → Data Analyst → Statistician → Executive Advisor → Report Writer]
        [Returns: Root cause report with evidence chain and action plan]
```

## Configuration

### Configuration File

```json
{
  "analytics": {
    "enabled": true,
    "defaultEngine": "python-analytics",
    "memory": {
      "enabled": true,
      "persistToDisk": false
    },
    "qualityGates": {
      "dataQuality": true,
      "statisticalRigor": true,
      "modelQuality": true,
      "businessLogic": true,
      "communication": true
    }
  }
}
```

### Environment Variables

```bash
# Enable/disable analytics
OPENDASH_ANALYTICS_ENABLED=true

# Set default engine
OPENDASH_ANALYTICS_ENGINE=python-analytics

# Enable memory persistence
OPENDASH_ANALYTICS_MEMORY_PERSIST=true
```

## Testing

Run integration tests:

```bash
cd packages/opencode
bun test src/intelligence/analytics/test.ts
```

## Versioning

- Current version: 5.0.0
- Future versions should not require runtime changes
- Markdown knowledge is versioned separately from runtime

## Logging

The intelligence layer logs:
- Request classification
- Capability matching
- Workflow selection
- Engine selection
- Execution plan creation
- Quality gate results
- Confidence scores

## Debugging

Enable debug logging:

```bash
OPENDASH_LOG_LEVEL=DEBUG mimo run "analyze sales.csv"
```

## Contributing

### Adding New Capabilities

1. Add capability to `registry/capabilities.json`
2. Add workflow to `workflows/` directory
3. Add agents to `agents/` directory if needed
4. Update engine registry if needed

### Adding New Engines

1. Add engine to `engine/index.ts`
2. Update tool mappings
3. Update model mappings

### Adding New Workflows

1. Add workflow to `workflows/` directory
2. Update orchestrator with new workflow phases
3. Update prompt builder with new context

## License

MIT