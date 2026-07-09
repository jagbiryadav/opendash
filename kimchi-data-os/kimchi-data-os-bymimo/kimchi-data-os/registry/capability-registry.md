# Capability Registry

## Overview
Machine-readable registry describing all available agents, engines, workflows, dependencies, and required inputs for dynamic orchestration.

## Registry Schema

```yaml
# capability-registry.yaml
version: "1.0.0"
last_updated: "2024-01-15"
registry:
  agents: []      # Agent definitions
  engines: []     # Engine definitions
  workflows: []   # Workflow definitions
  knowledge: []   # Knowledge base definitions
  templates: []   # Template definitions
```

## Agent Registry

```yaml
agents:
  - id: "agent-business-consultant"
    name: "Business Consultant"
    type: "agent"
    version: "1.0.0"
    description: "Frames business problems and defines success criteria"
    category: "strategic"
    file: "agents/business-consultant.md"
    
    inputs:
      - name: "user_request"
        type: "string"
        required: true
        description: "Natural language business question"
      - name: "context"
        type: "object"
        required: false
        description: "Additional business context"
    
    outputs:
      - name: "business_context"
        type: "object"
        schema:
          problem_statement: "string"
          stakeholders: "array"
          success_criteria: "array"
          decision_type: "string"
          timeline: "string"
      - name: "hypotheses"
        type: "array"
        schema:
          - id: "string"
            statement: "string"
            type: "string"
            test: "string"
    
    dependencies:
      - name: "knowledge/business-frameworks.md"
        type: "knowledge"
        required: true
      - name: "knowledge/kpis/*.md"
        type: "knowledge"
        required: false
    
    failure_modes:
      - condition: "Ambiguous business context"
        handling: "Ask clarifying questions"
        escalation: "user"
      - condition: "No clear success criteria"
        handling: "Define with stakeholder"
        escalation: "user"
    
    quality_gates:
      - name: "Problem clarity"
        check: "problem_statement is specific and actionable"
        threshold: "boolean"
      - name: "Stakeholder alignment"
        check: "stakeholders identified and mapped"
        threshold: "boolean"
    
    triggers:
      keywords: ["analyze", "why", "how", "strategy", "problem"]
      patterns: ["*.md", "*.csv", "*.xlsx"]
    
    metadata:
      author: "Kimchi Data OS Team"
      complexity: "low"
      estimated_time: "5-10 minutes"
      required_permissions: ["read"]
```

## Engine Registry

```yaml
engines:
  - id: "engine-statistics"
    name: "Statistical Analysis Engine"
    type: "engine"
    version: "1.0.0"
    description: "Performs statistical hypothesis testing and analysis"
    category: "analytical"
    file: "knowledge/statistics.md"
    
    capabilities:
      - "hypothesis_testing"
      - "correlation_analysis"
      - "regression_analysis"
      - "anova"
      - "chi_square"
      - "power_analysis"
    
    inputs:
      - name: "data"
        type: "DataFrame"
        required: true
        description: "Input dataset"
      - name: "analysis_type"
        type: "string"
        required: true
        enum: ["t_test", "anova", "chi_square", "correlation", "regression"]
      - name: "parameters"
        type: "object"
        required: false
        schema:
          alpha: "number"
          alternative: "string"
          confidence_level: "number"
    
    outputs:
      - name: "results"
        type: "object"
        schema:
          test_statistic: "number"
          p_value: "number"
          confidence_interval: "array"
          effect_size: "number"
          power: "number"
          interpretation: "string"
    
    dependencies:
      - name: "scipy"
        type: "package"
        version: ">=1.7.0"
      - name: "statsmodels"
        type: "package"
        version: ">=0.13.0"
      - name: "numpy"
        type: "package"
        version: ">=1.21.0"
    
    failure_modes:
      - condition: "Insufficient sample size"
        handling: "Report low power warning"
        escalation: "warning"
      - condition: "Assumptions violated"
        handling: "Suggest non-parametric alternative"
        escalation: "warning"
      - condition: "Missing values"
        handling: "Apply imputation or listwise deletion"
        escalation: "log"
    
    quality_gates:
      - name: "Sample size adequacy"
        check: "power >= 0.8"
        threshold: "number"
      - name: "Assumption validation"
        check: "normality_test passed or non_parametric_used"
        threshold: "boolean"
      - name: "Effect size reported"
        check: "effect_size is not null"
        threshold: "boolean"
    
    metadata:
      author: "Kimchi Data OS Team"
      complexity: "medium"
      estimated_time: "2-5 minutes"
      required_permissions: ["read", "analyze"]
```

## Workflow Registry

```yaml
workflows:
  - id: "workflow-forecasting"
    name: "Forecasting Workflow"
    type: "workflow"
    version: "1.0.0"
    description: "End-to-end time series forecasting"
    category: "predictive"
    file: "workflows/forecasting.md"
    
    steps:
      - name: "data_preparation"
        description: "Load and validate time series data"
        agent: "agent-data-auditor"
        inputs: ["raw_data"]
        outputs: ["validated_data"]
        time_estimate: "5 minutes"
      
      - name: "exploratory_analysis"
        description: "Decompose time series components"
        agent: "agent-data-analyst"
        inputs: ["validated_data"]
        outputs: ["decomposition", "patterns"]
        time_estimate: "10 minutes"
      
      - name: "model_selection"
        description: "Select and train forecasting models"
        agent: "agent-forecast-engineer"
        inputs: ["validated_data", "patterns"]
        outputs: ["models", "predictions"]
        time_estimate: "15 minutes"
      
      - name: "validation"
        description: "Validate forecast accuracy"
        agent: "agent-statistician"
        inputs: ["models", "predictions"]
        outputs: ["validation_results", "metrics"]
        time_estimate: "10 minutes"
      
      - name: "reporting"
        description: "Generate forecast report"
        agent: "agent-report-writer"
        inputs: ["predictions", "validation_results"]
        outputs: ["forecast_report"]
        time_estimate: "10 minutes"
    
    inputs:
      - name: "time_series_data"
        type: "DataFrame"
        required: true
        description: "Historical time series data"
      - name: "forecast_horizon"
        type: "integer"
        required: true
        description: "Number of periods to forecast"
      - name: "confidence_level"
        type: "number"
        required: false
        default: 0.95
        description: "Confidence level for prediction intervals"
    
    outputs:
      - name: "forecast_report"
        type: "object"
        schema:
          predictions: "DataFrame"
          intervals: "DataFrame"
          metrics: "object"
          scenarios: "object"
          recommendations: "array"
    
    dependencies:
      - agents:
          - "agent-data-auditor"
          - "agent-data-analyst"
          - "agent-forecast-engineer"
          - "agent-statistician"
          - "agent-report-writer"
        type: "agents"
        required: true
      - knowledge:
          - "knowledge/forecasting.md"
          - "knowledge/forecasting-ecosystem.md"
        type: "knowledge"
        required: true
      - packages:
          - "prophet"
          - "statsmodels"
          - "sklearn"
        type: "packages"
        required: true
    
    failure_modes:
      - condition: "Non-stationary data"
        handling: "Apply differencing or transformation"
        escalation: "continue_with_warning"
      - condition: "Insufficient data"
        handling: "Use simpler models"
        escalation: "warning"
      - condition: "Model convergence failure"
        handling: "Try alternative algorithm"
        escalation: "continue_with_warning"
    
    quality_gates:
      - name: "Data quality"
        check: "completeness > 0.95"
        threshold: "number"
      - name: "Model performance"
        check: "mape < 0.20"
        threshold: "number"
      - name: "Interval calibration"
        check: "coverage within 5% of target"
        threshold: "number"
    
    triggers:
      keywords: ["forecast", "predict", "future", "trend"]
      patterns: ["*.csv", "*.xlsx"]
    
    metadata:
      author: "Kimchi Data OS Team"
      complexity: "high"
      estimated_time: "45-60 minutes"
      required_permissions: ["read", "analyze", "write"]
```

## Knowledge Registry

```yaml
knowledge:
  - id: "knowledge-statistics"
    name: "Statistical Methods"
    type: "knowledge"
    version: "1.0.0"
    description: "Comprehensive statistical methods reference"
    category: "reference"
    file: "knowledge/statistics.md"
    
    topics:
      - "descriptive_statistics"
      - "probability_distributions"
      - "hypothesis_testing"
      - "regression_analysis"
      - "anova"
      - "non_parametric_tests"
      - "bayesian_statistics"
    
    dependencies:
      - name: "None"
        type: "none"
    
    metadata:
      author: "Kimchi Data OS Team"
      complexity: "reference"
      last_updated: "2024-01-15"
```

## Template Registry

```yaml
templates:
  - id: "template-executive-report"
    name: "Executive Report Template"
    type: "template"
    version: "1.0.0"
    description: "Standard template for executive summaries"
    category: "reporting"
    file: "templates/executive-report.md"
    
    sections:
      - "executive_summary"
      - "key_findings"
      - "recommendations"
      - "risk_assessment"
      - "implementation_plan"
    
    inputs:
      - name: "findings"
        type: "array"
        required: true
      - name: "recommendations"
        type: "array"
        required: true
      - name: "metrics"
        type: "object"
        required: false
    
    outputs:
      - name: "report"
        type: "markdown"
    
    metadata:
      author: "Kimchi Data OS Team"
      audience: "executive"
      format: "markdown"
```

## Registry API

### Query Capabilities

```python
class CapabilityRegistry:
    """Query and manage capability registry."""
    
    def __init__(self, registry_path):
        self.registry = self.load_registry(registry_path)
    
    def load_registry(self, path):
        """Load registry from YAML file."""
        import yaml
        with open(path, 'r') as f:
            return yaml.safe_load(f)
    
    def query_agents(self, category=None, capability=None):
        """Query agents by category or capability."""
        agents = self.registry.get('agents', [])
        
        if category:
            agents = [a for a in agents if a.get('category') == category]
        
        if capability:
            agents = [a for a in agents if capability in a.get('capabilities', [])]
        
        return agents
    
    def query_engines(self, capability=None):
        """Query engines by capability."""
        engines = self.registry.get('engines', [])
        
        if capability:
            engines = [e for e in engines if capability in e.get('capabilities', [])]
        
        return engines
    
    def query_workflows(self, trigger_keyword=None):
        """Query workflows by trigger keyword."""
        workflows = self.registry.get('workflows', [])
        
        if trigger_keyword:
            workflows = [
                w for w in workflows 
                if trigger_keyword in w.get('triggers', {}).get('keywords', [])
            ]
        
        return workflows
    
    def get_dependencies(self, component_id):
        """Get all dependencies for a component."""
        for component_type in ['agents', 'engines', 'workflows']:
            for component in self.registry.get(component_type, []):
                if component['id'] == component_id:
                    return component.get('dependencies', [])
        return []
    
    def validate_registry(self):
        """Validate registry integrity."""
        errors = []
        
        # Check for duplicate IDs
        all_ids = []
        for component_type in ['agents', 'engines', 'workflows', 'knowledge', 'templates']:
            for component in self.registry.get(component_type, []):
                if component['id'] in all_ids:
                    errors.append(f"Duplicate ID: {component['id']}")
                all_ids.append(component['id'])
        
        # Check dependency references
        for component_type in ['agents', 'engines', 'workflows']:
            for component in self.registry.get(component_type, []):
                for dep in component.get('dependencies', []):
                    if dep.get('type') in ['agents', 'knowledge']:
                        if dep['name'] not in all_ids:
                            errors.append(f"Missing dependency: {dep['name']} in {component['id']}")
        
        return errors
```

### Registry Schema Validation

```python
def validate_agent_schema(agent):
    """Validate agent schema."""
    required_fields = ['id', 'name', 'type', 'version', 'description', 'inputs', 'outputs']
    
    errors = []
    for field in required_fields:
        if field not in agent:
            errors.append(f"Missing required field: {field}")
    
    # Validate inputs
    for input_def in agent.get('inputs', []):
        if 'name' not in input_def or 'type' not in input_def:
            errors.append(f"Invalid input definition: {input_def}")
    
    # Validate outputs
    for output_def in agent.get('outputs', []):
        if 'name' not in output_def or 'type' not in output_def:
            errors.append(f"Invalid output definition: {output_def}")
    
    return errors
```

## Usage Examples

### Finding the Right Agent

```python
registry = CapabilityRegistry('capability-registry.yaml')

# Find agents for statistical analysis
stat_agents = registry.query_agents(category='analytical')
print(f"Analytical agents: {[a['name'] for a in stat_agents]}")

# Find engines with forecasting capability
forecast_engines = registry.query_engines(capability='forecasting')
print(f"Forecasting engines: {[e['name'] for e in forecast_engines]}")

# Find workflows triggered by "forecast" keyword
forecast_workflows = registry.query_workflows(trigger_keyword='forecast')
print(f"Forecast workflows: {[w['name'] for w in forecast_workflows]}")
```

### Dependency Resolution

```python
def resolve_dependencies(component_id, registry):
    """Resolve all dependencies for a component."""
    deps = registry.get_dependencies(component_id)
    resolved = []
    
    for dep in deps:
        if dep['type'] == 'agents':
            # Recursively resolve agent dependencies
            agent_deps = resolve_dependencies(dep['name'], registry)
            resolved.extend(agent_deps)
        
        resolved.append(dep)
    
    return resolved
```

### Dynamic Orchestration

```python
def orchestrate_by_registry(user_request, registry):
    """Dynamically orchestrate based on registry."""
    # Determine workflow from request
    workflows = registry.query_workflows(trigger_keyword=extract_keyword(user_request))
    
    if not workflows:
        raise ValueError("No matching workflow found")
    
    workflow = workflows[0]
    
    # Execute workflow steps
    results = {}
    for step in workflow['steps']:
        agent = registry.query_agents(category=step['agent'])[0]
        
        # Gather inputs
        inputs = {}
        for input_name in step['inputs']:
            inputs[input_name] = results.get(input_name)
        
        # Execute agent
        result = execute_agent(agent, inputs)
        
        # Store outputs
        for output_name in step['outputs']:
            results[output_name] = result[output_name]
    
    return results
```

## Registry Maintenance

### Adding New Components

```bash
# Add new agent to registry
python scripts/add_to_registry.py \
  --type agent \
  --id "agent-new-analyst" \
  --name "New Analyst" \
  --file "agents/new-analyst.md"

# Validate registry
python scripts/validate_registry.py --registry capability-registry.yaml
```

### Registry Versioning

```yaml
# Version history
version_history:
  - version: "1.0.0"
    date: "2024-01-15"
    changes:
      - "Initial registry creation"
      - "Added 14 agents"
      - "Added 10 engines"
      - "Added 10 workflows"
  
  - version: "1.1.0"
    date: "2024-02-01"
    changes:
      - "Added domain packs"
      - "Added forecasting ecosystem"
      - "Enhanced governance capabilities"
```