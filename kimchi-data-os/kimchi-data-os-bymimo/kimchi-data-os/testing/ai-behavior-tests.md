# AI Behavior Tests

## Overview
Tests for AI agent behavior, not code correctness. Validates reasoning quality, output consistency, and confidence calibration.

## Test Structure

```yaml
test:
  id: "test_forecasting_reasoning"
  name: "Forecasting Reasoning Test"
  type: "behavior"
  
  input:
    user_request: "Our sales dropped 18% last quarter. Can you predict next quarter?"
    data_context: "Sales data for 2 years with monthly granularity"
  
  expected_behavior:
    step_1:
      action: "Ask clarifying questions"
      questions_asked:
        - "What is the target variable?"
        - "What forecast horizon do you need?"
        - "Are there known events affecting sales?"
    
    step_2:
      action: "Load appropriate workflow"
      workflow: "forecasting.md"
    
    step_3:
      action: "Execute data audit"
      checks:
        - "Check data completeness"
        - "Check for outliers"
        - "Assess stationarity"
    
    step_4:
      action: "Generate forecast"
      outputs:
        - "Point forecast"
        - "Prediction intervals"
        - "Scenario analysis"
  
  expected_output:
    format: "prediction_report"
    sections:
      - "Executive Summary"
      - "Forecast Values"
      - "Confidence Assessment"
      - "Scenario Analysis"
      - "Recommendations"
    
    confidence_calibration:
      method: "When confidence is 90%, actual should fall within interval 90% of the time"
    
    quality_checks:
      - "Confidence intervals provided"
      - "Limitations acknowledged"
      - "Business context incorporated"
```

## Test Categories

### 1. Reasoning Tests

```yaml
- id: "reasoning_root_cause"
  name: "Root Cause Reasoning"
  input:
    request: "Why did revenue drop 18%?"
    data: "Revenue data with multiple dimensions"
  
  expected_reasoning:
    - "Consider multiple hypotheses"
    - "Test each hypothesis with data"
    - "Quantify impact of each factor"
    - "Consider alternative explanations"
    - "Provide confidence levels"
  
  validation:
    - "At least 3 hypotheses generated"
    - "Each hypothesis tested statistically"
    - "Impact quantified in dollars"
    - "Alternative explanations considered"
    - "Confidence provided for each finding"
```

### 2. Output Quality Tests

```yaml
- id: "output_executive_summary"
  name: "Executive Summary Quality"
  input:
    analysis_results: "Complex multi-page analysis"
    audience: "CEO"
  
  expected_output:
    format:
      - "One page maximum"
      - "Bottom line up front"
      - "Key findings (3-5)"
      - "Recommendations with owners"
      - "Confidence levels"
    
    language:
      - "No technical jargon"
      - "Business impact quantified"
      - "Actionable recommendations"
    
    structure:
      - "Answer the question in first paragraph"
      - "Support with evidence"
      - "Prioritize by impact"
  
  validation:
    - "Length <= 1 page"
    - "Contains dollar amounts"
    - "Has clear recommendations"
    - "Technical details in appendix"
```

### 3. Confidence Calibration Tests

```yaml
- id: "confidence_calibration"
  name: "Confidence Calibration"
  method: "Monte Carlo simulation"
  
  procedure:
    - "Generate 100 forecasts with stated confidence levels"
    - "Check if actual values fall within intervals"
    - "Calculate calibration error"
  
  acceptance_criteria:
    - "90% confidence interval covers 85-95% of actuals"
    - "80% confidence interval covers 75-85% of actuals"
    - "Calibration error < 5%"
  
  example:
    stated_confidence: 90%
    actual_coverage: 92%
    calibration_error: 2%
    result: "PASS"
```

### 4. Consistency Tests

```yaml
- id: "consistency_forecasting"
  name: "Forecasting Consistency"
  input:
    same_request: "Forecast sales for Q4"
    different_runs: 5
  
  expected_behavior:
    - "Same workflow selected"
    - "Similar forecast values (within 10%)"
    - "Same confidence level approach"
    - "Consistent recommendation style"
  
  validation:
    - "Forecast std < 10% of mean"
    - "Same agents invoked"
    - "Same template used"
    - "Similar recommendations"
```

### 5. Edge Case Tests

```yaml
- id: "edge_case_missing_data"
  name: "Missing Data Handling"
  input:
    data: "Time series with 30% missing values"
    request: "Forecast next month"
  
  expected_behavior:
    - "Detect missing data pattern"
    - "Classify missingness (MCAR/MAR/MNAR)"
    - "Apply appropriate imputation"
    - "Report impact on forecast uncertainty"
    - "Recommend data collection improvements"
  
  validation:
    - "Missing pattern identified"
    - "Imputation method justified"
    - "Uncertainty increased appropriately"
    - "Data quality report generated"
```

### 6. Domain Adaptation Tests

```yaml
- id: "domain_retail"
  name: "Retail Domain Adaptation"
  input:
    data: "Retail transaction data"
    request: "Analyze sales performance"
  
  expected_behavior:
    - "Apply retail-specific metrics (same-store sales, basket size)"
    - "Consider seasonality (holiday effects)"
    - "Analyze by product category"
    - "Include inventory considerations"
  
  validation:
    - "Retail metrics calculated"
    - "Seasonality addressed"
    - "Category analysis included"
    - "Inventory impact discussed"
```

## Running Tests

```python
class AIBehaviorTest:
    """Test AI agent behavior."""
    
    def __init__(self, agent, test_config):
        self.agent = agent
        self.config = test_config
    
    def run_test(self, test_case):
        """Run a single behavior test."""
        # Execute agent with test input
        output = self.agent.execute(test_case['input'])
        
        # Validate reasoning
        reasoning_valid = self.validate_reasoning(output, test_case['expected_reasoning'])
        
        # Validate output format
        format_valid = self.validate_output_format(output, test_case['expected_output'])
        
        # Validate confidence
        confidence_valid = self.validate_confidence(output, test_case['expected_confidence'])
        
        return {
            'test_id': test_case['id'],
            'passed': reasoning_valid and format_valid and confidence_valid,
            'reasoning': reasoning_valid,
            'format': format_valid,
            'confidence': confidence_valid
        }
    
    def validate_reasoning(self, output, expected):
        """Validate reasoning steps."""
        for step in expected:
            if not self.check_step(output, step):
                return False
        return True
    
    def validate_output_format(self, output, expected):
        """Validate output format."""
        for section in expected.get('sections', []):
            if section not in output:
                return False
        return True
    
    def validate_confidence(self, output, expected):
        """Validate confidence calibration."""
        if 'confidence' not in output:
            return False
        if not (0 <= output['confidence'] <= 100):
            return False
        return True
```

## Test Reports

```json
{
  "test_suite": "AI Behavior Tests",
  "run_date": "2024-01-15",
  "total_tests": 50,
  "passed": 47,
  "failed": 3,
  "pass_rate": 94,
  
  "results": [
    {
      "category": "Reasoning",
      "tests": 10,
      "passed": 9,
      "failed": 1,
      "details": "Root cause analysis missed one alternative explanation"
    },
    {
      "category": "Output Quality",
      "tests": 15,
      "passed": 15,
      "failed": 0
    },
    {
      "category": "Confidence Calibration",
      "tests": 10,
      "passed": 9,
      "failed": 1,
      "details": "80% interval covered 78% (below threshold)"
    },
    {
      "category": "Consistency",
      "tests": 10,
      "passed": 9,
      "failed": 1,
      "details": "Forecast variance slightly high"
    },
    {
      "category": "Edge Cases",
      "tests": 5,
      "passed": 5,
      "failed": 0
    }
  ],
  
  "recommendations": [
    "Improve alternative explanation generation in root cause analysis",
    "Calibrate confidence intervals more precisely",
    "Reduce forecast variance through ensemble methods"
  ]
}
```

## Acceptance Criteria

### Minimum Requirements
- Pass rate >= 90%
- No critical reasoning failures
- Confidence calibration error < 5%
- Consistency variance < 15%

### Quality Targets
- Pass rate >= 95%
- All reasoning tests pass
- Confidence calibration error < 3%
- Consistency variance < 10%

### Regression Detection
- Compare against baseline
- Flag any new failures
- Track improvement over time