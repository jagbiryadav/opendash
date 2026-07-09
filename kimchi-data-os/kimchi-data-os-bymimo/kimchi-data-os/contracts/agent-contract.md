# Agent Contract Specification

## Overview
Standard contract format for all agents, engines, and components in Kimchi Data OS.

## Contract Schema

```yaml
contract:
  # Identity
  id: "string"                    # Unique identifier
  name: "string"                  # Human-readable name
  type: "agent|engine|workflow"   # Component type
  version: "string"               # Semantic version
  description: "string"           # What this component does
  
  # Purpose
  purpose:
    summary: "string"             # One-sentence purpose
    use_cases:                    # When to use this
      - "string"
    anti_use_cases:               # When NOT to use this
      - "string"
  
  # Interface
  inputs:
    - name: "string"
      type: "string"              # Data type
      required: "boolean"
      description: "string"
      default: "any"              # Default value if not required
      schema: "object"            # JSON schema for complex types
  
  outputs:
    - name: "string"
      type: "string"
      description: "string"
      schema: "object"
  
  # Dependencies
  dependencies:
    required:                     # Must have
      - name: "string"
        type: "knowledge|agent|package|data"
        version: "string"
    optional:                     # Nice to have
      - name: "string"
        type: "string"
        version: "string"
  
  # Behavior
  failure_modes:
    - condition: "string"         # What triggers this
      handling: "string"          # How to handle
      escalation: "user|log|continue|abort"
      recovery: "string"          # How to recover
  
  quality_gates:
    - name: "string"
      description: "string"
      check: "string"             # Condition to verify
      threshold: "any"
      on_fail: "abort|warn|continue"
  
  # Execution
  execution:
    estimated_time: "string"
    memory_requirement: "string"
    parallelizable: "boolean"
    timeout: "string"
  
  # Metadata
  metadata:
    author: "string"
    created: "date"
    updated: "date"
    tags: ["string"]
    complexity: "low|medium|high"
```

## Formal Contract Examples

### Business Consultant Contract

```yaml
contract:
  id: "agent-business-consultant"
  name: "Business Consultant"
  type: "agent"
  version: "1.0.0"
  description: "Frames business problems and translates between business and analytical language"
  
  purpose:
    summary: "Transform ambiguous business questions into structured analytical problems"
    use_cases:
      - "User asks vague business question"
      - "Need to define success criteria"
      - "Stakeholder alignment required"
      - "Problem framing needed"
    anti_use_cases:
      - "Pure technical analysis"
      - "Data already well-defined"
      - "No business context needed"
  
  inputs:
    - name: "user_request"
      type: "string"
      required: true
      description: "Natural language business question or request"
    - name: "available_data"
      type: "DataFrame[]"
      required: false
      description: "List of available datasets"
    - name: "stakeholder_context"
      type: "object"
      required: false
      description: "Information about stakeholders and their needs"
  
  outputs:
    - name: "business_context"
      type: "object"
      schema:
        problem_statement: "string"
        underlying_motivation: "string"
        decision_at_stake: "string"
        stakeholders_affected: "array"
        constraints: "array"
        success_definition: "string"
    - name: "analytical_frame"
      type: "object"
      schema:
        question_type: "string"
        required_analyses: "array"
        success_metrics: "array"
    - name: "hypotheses"
      type: "array"
      schema:
        - id: "string"
          statement: "string"
          type: "string"
          test_method: "string"
  
  dependencies:
    required:
      - name: "knowledge/business-frameworks.md"
        type: "knowledge"
        version: ">=1.0.0"
    optional:
      - name: "knowledge/kpis/*.md"
        type: "knowledge"
  
  failure_modes:
    - condition: "User request too vague"
      handling: "Ask clarifying questions"
      escalation: "user"
      recovery: "Request more specific information"
    - condition: "No clear business problem"
      handling: "Present options and ask user to choose"
      escalation: "user"
      recovery: "Guide user through problem identification"
    - condition: "Stakeholder conflict"
      handling: "Document both perspectives"
      escalation: "user"
      recovery: "Escalate to decision maker"
  
  quality_gates:
    - name: "Problem Specificity"
      description: "Problem statement is specific and actionable"
      check: "problem_statement contains measurable outcome"
      threshold: true
      on_fail: "abort"
    - name: "Stakeholder Mapping"
      description: "All relevant stakeholders identified"
      check: "len(stakeholders_affected) > 0"
      threshold: true
      on_fail: "warn"
    - name: "Success Criteria"
      description: "Success criteria are SMART"
      check: "all criteria are specific, measurable, achievable, relevant, time-bound"
      threshold: true
      on_fail: "abort"
    - name: "Hypothesis Quality"
      description: "Hypotheses are testable"
      check: "all hypotheses have test_method defined"
      threshold: true
      on_fail: "warn"
  
  execution:
    estimated_time: "5-10 minutes"
    memory_requirement: "low"
    parallelizable: false
    timeout: "15 minutes"
  
  metadata:
    author: "Kimchi Data OS Team"
    created: "2024-01-15"
    updated: "2024-01-15"
    tags: ["strategic", "framing", "consulting"]
    complexity: "low"
```

### Statistical Analysis Engine Contract

```yaml
contract:
  id: "engine-statistics"
  name: "Statistical Analysis Engine"
  type: "engine"
  version: "1.0.0"
  description: "Performs statistical hypothesis testing and validation"
  
  purpose:
    summary: "Apply appropriate statistical tests and validate analytical findings"
    use_cases:
      - "Testing hypotheses about data"
      - "Validating observed differences"
      - "Quantifying uncertainty"
      - "Assessing statistical significance"
    anti_use_cases:
      - "Purely descriptive analysis"
      - "Non-statistical pattern recognition"
      - "Causal inference without experiment"
  
  inputs:
    - name: "data"
      type: "DataFrame"
      required: true
      description: "Dataset for analysis"
    - name: "analysis_type"
      type: "string"
      required: true
      enum:
        - "t_test_ind"
        - "t_test_paired"
        - "anova"
        - "chi_square"
        - "correlation"
        - "regression"
        - "mann_whitney"
        - "kruskal_wallis"
    - name: "parameters"
      type: "object"
      required: false
      schema:
        alpha: "number"
        alternative: "string"
        confidence_level: "number"
        correction: "string"
  
  outputs:
    - name: "results"
      type: "object"
      schema:
        test_name: "string"
        test_statistic: "number"
        p_value: "number"
        confidence_interval: "array"
        effect_size: "number"
        effect_size_name: "string"
        power: "number"
        interpretation: "string"
        assumptions_met: "boolean"
        recommendations: "array"
  
  dependencies:
    required:
      - name: "scipy"
        type: "package"
        version: ">=1.7.0"
      - name: "statsmodels"
        type: "package"
        version: ">=0.13.0"
      - name: "numpy"
        type: "package"
        version: ">=1.21.0"
      - name: "pandas"
        type: "package"
        version: ">=1.3.0"
    optional:
      - name: "pingouin"
        type: "package"
        version: ">=0.5.0"
  
  failure_modes:
    - condition: "Insufficient sample size"
      handling: "Report low power, suggest larger sample"
      escalation: "warn"
      recovery: "Collect more data or use exact tests"
    - condition: "Normality assumption violated"
      handling: "Suggest non-parametric alternative"
      escalation: "warn"
      recovery: "Use Mann-Whitney or Kruskal-Wallis"
    - condition: "Missing values exceed threshold"
      handling: "Apply imputation or exclude cases"
      escalation: "warn"
      recovery: "Document handling and report sensitivity"
    - condition: "Perfect separation in logistic regression"
      handling: "Use Firth's penalized likelihood"
      escalation: "log"
      recovery: "Apply regularization"
    - condition: "Singular matrix in regression"
      handling: "Remove collinear variables"
      escalation: "warn"
      recovery: "Use PCA or ridge regression"
  
  quality_gates:
    - name: "Sample Size"
      description: "Adequate sample for desired power"
      check: "power >= 0.8 or exact_test_used"
      threshold: true
      on_fail: "warn"
    - name: "Assumption Validation"
      description: "Statistical assumptions checked"
      check: "assumptions_tested == true"
      threshold: true
      on_fail: "abort"
    - name: "Effect Size Reported"
      description: "Practical significance quantified"
      check: "effect_size is not null"
      threshold: true
      on_fail: "warn"
    - name: "Multiple Comparisons"
      description: "Correction applied if needed"
      check: "num_comparisons == 1 or correction_applied"
      threshold: true
      on_fail: "warn"
    - name: "Confidence Intervals"
      description: "Uncertainty quantified"
      check: "confidence_interval is not null"
      threshold: true
      on_fail: "warn"
  
  execution:
    estimated_time: "2-5 minutes"
    memory_requirement: "medium"
    parallelizable: true
    timeout: "10 minutes"
  
  metadata:
    author: "Kimchi Data OS Team"
    created: "2024-01-15"
    updated: "2024-01-15"
    tags: ["statistical", "testing", "validation"]
    complexity: "medium"
```

### Forecasting Workflow Contract

```yaml
contract:
  id: "workflow-forecasting"
  name: "Forecasting Workflow"
  type: "workflow"
  version: "1.0.0"
  description: "End-to-end time series forecasting with uncertainty quantification"
  
  purpose:
    summary: "Generate accurate forecasts with confidence intervals and scenario analysis"
    use_cases:
      - "Demand forecasting"
      - "Revenue projection"
      - "Capacity planning"
      - "Budget forecasting"
    anti_use_cases:
      - "Single-point prediction without uncertainty"
      - "Categorical outcome prediction"
      - "Spatial data analysis"
  
  inputs:
    - name: "time_series_data"
      type: "DataFrame"
      required: true
      description: "Historical time series with date and value columns"
    - name: "date_column"
      type: "string"
      required: true
      description: "Name of date column"
    - name: "value_column"
      type: "string"
      required: true
      description: "Name of value column to forecast"
    - name: "forecast_horizon"
      type: "integer"
      required: true
      description: "Number of periods to forecast"
    - name: "frequency"
      type: "string"
      required: false
      default: "auto"
      description: "Data frequency (D, W, M, Q, Y)"
    - name: "confidence_level"
      type: "number"
      required: false
      default: 0.95
      description: "Confidence level for prediction intervals"
    - name: "include_scenarios"
      type: "boolean"
      required: false
      default: true
      description: "Whether to generate scenario forecasts"
  
  outputs:
    - name: "forecast"
      type: "object"
      schema:
        point_forecast: "Series"
        lower_bound: "Series"
        upper_bound: "Series"
        historical: "Series"
    - name: "metrics"
      type: "object"
      schema:
        mape: "number"
        rmse: "number"
        mae: "number"
        coverage: "number"
    - name: "scenarios"
      type: "object"
      schema:
        optimistic: "Series"
        base: "Series"
        pessimistic: "Series"
    - name: "diagnostics"
      type: "object"
      schema:
        stationarity: "object"
        seasonality: "object"
        autocorrelation: "object"
  
  steps:
    - id: "step_1"
      name: "Data Validation"
      agent: "agent-data-auditor"
      inputs: ["time_series_data"]
      outputs: ["validated_data", "quality_report"]
      time_estimate: "5 minutes"
    
    - id: "step_2"
      name: "Exploratory Analysis"
      agent: "agent-data-analyst"
      inputs: ["validated_data"]
      outputs: ["decomposition", "patterns"]
      time_estimate: "10 minutes"
    
    - id: "step_3"
      name: "Model Training"
      agent: "agent-forecast-engineer"
      inputs: ["validated_data", "patterns"]
      outputs: ["models", "backtest_results"]
      time_estimate: "15 minutes"
      parallel: true
    
    - id: "step_4"
      name: "Model Validation"
      agent: "agent-statistician"
      inputs: ["models", "backtest_results"]
      outputs: ["validation_results", "best_model"]
      time_estimate: "10 minutes"
    
    - id: "step_5"
      name: "Forecast Generation"
      agent: "agent-forecast-engineer"
      inputs: ["best_model", "validated_data"]
      outputs: ["forecast", "intervals"]
      time_estimate: "5 minutes"
    
    - id: "step_6"
      name: "Scenario Analysis"
      agent: "agent-forecast-engineer"
      inputs: ["forecast", "validated_data"]
      outputs: ["scenarios"]
      time_estimate: "10 minutes"
      optional: true
    
    - id: "step_7"
      name: "Report Generation"
      agent: "agent-report-writer"
      inputs: ["forecast", "metrics", "scenarios", "diagnostics"]
      outputs: ["report"]
      time_estimate: "10 minutes"
  
  dependencies:
    required:
      agents:
        - "agent-data-auditor"
        - "agent-data-analyst"
        - "agent-forecast-engineer"
        - "agent-statistician"
        - "agent-report-writer"
      knowledge:
        - "knowledge/forecasting.md"
        - "knowledge/forecasting-ecosystem.md"
      packages:
        - "prophet>=1.1.0"
        - "statsmodels>=0.13.0"
        - "sklearn>=1.0.0"
        - "pandas>=1.3.0"
        - "numpy>=1.21.0"
    optional:
      packages:
        - "xgboost>=1.5.0"
        - "lightgbm>=3.3.0"
  
  failure_modes:
    - condition: "Non-stationary data"
      handling: "Apply differencing or transformation"
      escalation: "log"
      recovery: "Try multiple differencing orders"
    - condition: "Insufficient data (<2 seasons)"
      handling: "Use simpler models (naive, moving average)"
      escalation: "warn"
      recovery: "Collect more data or accept higher uncertainty"
    - condition: "Model convergence failure"
      handling: "Try alternative algorithm"
      escalation: "log"
      recovery: "Fall back to ensemble of simpler models"
    - condition: "Extreme outliers detected"
      handling: "Flag and optionally exclude"
      escalation: "warn"
      recovery: "Use robust methods or winsorize"
    - condition: "Prediction interval too wide"
      handling: "Report uncertainty honestly"
      escalation: "log"
      recovery: "Suggest shorter forecast horizon"
  
  quality_gates:
    - name: "Data Quality"
      description: "Input data meets minimum quality standards"
      check: "completeness > 0.95 AND no_critical_issues"
      threshold: true
      on_fail: "abort"
    - name: "Model Performance"
      description: "Best model meets accuracy threshold"
      check: "mape < 0.20 OR mape_improved_over_baseline"
      threshold: true
      on_fail: "warn"
    - name: "Interval Calibration"
      description: "Prediction intervals are well-calibrated"
      check: "abs(coverage - target_coverage) < 0.05"
      threshold: true
      on_fail: "warn"
    - name: "Backtest Stability"
      description: "Performance stable across time"
      check: "std(cv_scores) < 0.1 * mean(cv_scores)"
      threshold: true
      on_fail: "warn"
  
  execution:
    estimated_time: "45-60 minutes"
    memory_requirement: "high"
    parallelizable: false
    timeout: "90 minutes"
  
  metadata:
    author: "Kimchi Data OS Team"
    created: "2024-01-15"
    updated: "2024-01-15"
    tags: ["forecasting", "time_series", "prediction"]
    complexity: "high"
```

## Contract Validation

```python
class ContractValidator:
    """Validate component contracts."""
    
    REQUIRED_FIELDS = {
        'agent': ['id', 'name', 'type', 'version', 'description', 'purpose', 
                  'inputs', 'outputs', 'failure_modes', 'quality_gates'],
        'engine': ['id', 'name', 'type', 'version', 'description', 'purpose',
                   'inputs', 'outputs', 'dependencies', 'failure_modes', 'quality_gates'],
        'workflow': ['id', 'name', 'type', 'version', 'description', 'purpose',
                     'inputs', 'outputs', 'steps', 'dependencies']
    }
    
    def validate_contract(self, contract, component_type):
        """Validate a component contract."""
        errors = []
        warnings = []
        
        # Check required fields
        required = self.REQUIRED_FIELDS.get(component_type, [])
        for field in required:
            if field not in contract:
                errors.append(f"Missing required field: {field}")
        
        # Validate inputs/outputs
        for io_type in ['inputs', 'outputs']:
            for item in contract.get(io_type, []):
                if 'name' not in item:
                    errors.append(f"{io_type}: Missing 'name'")
                if 'type' not in item:
                    errors.append(f"{io_type}: Missing 'type'")
        
        # Validate failure modes
        for fm in contract.get('failure_modes', []):
            if 'condition' not in fm:
                errors.append("failure_modes: Missing 'condition'")
            if 'handling' not in fm:
                errors.append("failure_modes: Missing 'handling'")
            if fm.get('escalation') not in ['user', 'log', 'warn', 'abort', 'continue']:
                warnings.append(f"Non-standard escalation: {fm.get('escalation')}")
        
        # Validate quality gates
        for qg in contract.get('quality_gates', []):
            if 'name' not in qg:
                errors.append("quality_gates: Missing 'name'")
            if 'check' not in qg:
                errors.append("quality_gates: Missing 'check'")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
```

## Contract Interface Definition Language (IDL)

```python
# contract_idl.py
# Formal specification for component interfaces

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum

class ComponentType(Enum):
    AGENT = "agent"
    ENGINE = "engine"
    WORKFLOW = "workflow"

class EscalationType(Enum):
    USER = "user"
    LOG = "log"
    WARN = "warn"
    ABORT = "abort"
    CONTINUE = "continue"

class OnFailType(Enum):
    ABORT = "abort"
    WARN = "warn"
    CONTINUE = "continue"

@dataclass
class InputSpec:
    name: str
    type: str
    required: bool
    description: str
    default: Optional[Any] = None
    schema: Optional[Dict] = None

@dataclass
class OutputSpec:
    name: str
    type: str
    description: str
    schema: Optional[Dict] = None

@dataclass
class Dependency:
    name: str
    type: str  # knowledge, agent, package, data
    version: Optional[str] = None

@dataclass
class FailureMode:
    condition: str
    handling: str
    escalation: EscalationType
    recovery: str

@dataclass
class QualityGate:
    name: str
    description: str
    check: str
    threshold: Any
    on_fail: OnFailType

@dataclass
class Contract:
    id: str
    name: str
    type: ComponentType
    version: str
    description: str
    purpose_summary: str
    inputs: List[InputSpec]
    outputs: List[OutputSpec]
    dependencies: List[Dependency]
    failure_modes: List[FailureMode]
    quality_gates: List[QualityGate]
    
    def validate(self) -> List[str]:
        """Validate contract completeness."""
        errors = []
        
        if not self.id:
            errors.append("Missing contract ID")
        if not self.inputs:
            errors.append("No inputs defined")
        if not self.outputs:
            errors.append("No outputs defined")
        
        return errors
    
    def to_yaml(self) -> str:
        """Export contract to YAML."""
        import yaml
        return yaml.dump(self.__dict__, default_flow_style=False)
```