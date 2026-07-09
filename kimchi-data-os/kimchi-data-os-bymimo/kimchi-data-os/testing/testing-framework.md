# Automated Testing Framework

## Overview
Comprehensive testing system for prompts, workflows, components, and outputs.

## Testing Types

### 1. Prompt Testing
Test prompt quality and consistency.

```python
# tests/test_prompts.py
import pytest
from kimchi.testing import PromptTester

class TestAnalysisPrompts:
    """Test analysis prompts."""
    
    @pytest.fixture
    def tester(self):
        return PromptTester()
    
    def test_hypothesis_generation(self, tester):
        """Test hypothesis generation prompt."""
        prompt = tester.load_prompt("analysis-prompts.md", "hypothesis_generation")
        
        result = tester.execute_prompt(
            prompt,
            context={
                "business_context": "Sales declined 18% in Q3",
                "data_description": "Transaction data with 100K records"
            }
        )
        
        # Validate output structure
        assert "hypotheses" in result
        assert len(result["hypotheses"]) >= 3
        assert len(result["hypotheses"]) <= 5
        
        # Validate hypothesis quality
        for hypothesis in result["hypotheses"]:
            assert "statement" in hypothesis
            assert "type" in hypothesis
            assert "test" in hypothesis
            assert hypothesis["type"] in ["causal", "correlational", "predictive"]
    
    def test_root_cause_analysis(self, tester):
        """Test root cause analysis prompt."""
        prompt = tester.load_prompt("analysis-prompts.md", "root_cause_investigation")
        
        result = tester.execute_prompt(
            prompt,
            context={
                "problem": "Revenue dropped 18%",
                "data": "Monthly revenue data for 2 years",
                "timeline": "Q3 2024"
            }
        )
        
        # Validate output
        assert "primary_cause" in result
        assert "secondary_causes" in result
        assert "confidence" in result
        assert result["confidence"] in ["high", "medium", "low"]
    
    def test_prompt_consistency(self, tester):
        """Test prompt produces consistent results."""
        prompt = tester.load_prompt("analysis-prompts.md", "findings_synthesis")
        
        results = []
        for _ in range(5):
            result = tester.execute_prompt(
                prompt,
                context={
                    "findings": ["Finding 1", "Finding 2", "Finding 3"],
                    "business_context": "Test context",
                    "stakeholder": "CEO"
                }
            )
            results.append(result)
        
        # Check consistency
        assert tester.check_consistency(results, key_fields=["key_findings", "recommendations"])
```

### 2. Workflow Testing
Test workflow execution and outputs.

```python
# tests/test_workflows.py
import pytest
from kimchi.testing import WorkflowTester

class TestForecastingWorkflow:
    """Test forecasting workflow."""
    
    @pytest.fixture
    def tester(self):
        return WorkflowTester()
    
    @pytest.fixture
    def sample_data(self):
        import pandas as pd
        import numpy as np
        
        dates = pd.date_range('2020-01-01', periods=1000, freq='D')
        values = np.random.randn(1000).cumsum() + 100
        
        return pd.DataFrame({
            'date': dates,
            'value': values
        })
    
    def test_workflow_execution(self, tester, sample_data):
        """Test complete workflow execution."""
        workflow = tester.load_workflow("workflows/forecasting.md")
        
        result = tester.execute_workflow(
            workflow,
            inputs={
                "time_series_data": sample_data,
                "date_column": "date",
                "value_column": "value",
                "forecast_horizon": 30
            }
        )
        
        # Validate outputs
        assert "forecast" in result
        assert "metrics" in result
        assert "scenarios" in result
        
        # Validate forecast structure
        forecast = result["forecast"]
        assert "point_forecast" in forecast
        assert "lower_bound" in forecast
        assert "upper_bound" in forecast
        assert len(forecast["point_forecast"]) == 30
    
    def test_workflow_quality_gates(self, tester, sample_data):
        """Test workflow quality gates."""
        workflow = tester.load_workflow("workflows/forecasting.md")
        
        result = tester.execute_workflow(
            workflow,
            inputs={
                "time_series_data": sample_data,
                "date_column": "date",
                "value_column": "value",
                "forecast_horizon": 30
            }
        )
        
        # Check quality gates
        assert result["quality_gates"]["data_quality"]["passed"]
        assert result["quality_gates"]["model_performance"]["passed"]
        assert result["quality_gates"]["interval_calibration"]["passed"]
    
    def test_workflow_failure_handling(self, tester):
        """Test workflow handles failures gracefully."""
        workflow = tester.load_workflow("workflows/forecasting.md")
        
        # Provide bad data
        bad_data = pd.DataFrame({'date': [], 'value': []})
        
        result = tester.execute_workflow(
            workflow,
            inputs={
                "time_series_data": bad_data,
                "date_column": "date",
                "value_column": "value",
                "forecast_horizon": 30
            }
        )
        
        # Should fail gracefully
        assert result["status"] == "failed"
        assert "error" in result
        assert "recommendation" in result
```

### 3. Component Testing
Test individual agents and engines.

```python
# tests/test_components.py
import pytest
from kimchi.testing import ComponentTester

class TestStatisticalEngine:
    """Test statistical analysis engine."""
    
    @pytest.fixture
    def tester(self):
        return ComponentTester()
    
    @pytest.fixture
    def sample_data(self):
        import pandas as pd
        import numpy as np
        
        np.random.seed(42)
        return pd.DataFrame({
            'group': ['A'] * 50 + ['B'] * 50,
            'value': np.concatenate([
                np.random.normal(100, 10, 50),
                np.random.normal(110, 10, 50)
            ])
        })
    
    def test_t_test(self, tester, sample_data):
        """Test t-test functionality."""
        engine = tester.load_engine("engines/statistics.py")
        
        result = engine.execute(
            data=sample_data,
            analysis_type="t_test_ind",
            parameters={
                "group_col": "group",
                "value_col": "value",
                "alpha": 0.05
            }
        )
        
        # Validate output
        assert "test_statistic" in result
        assert "p_value" in result
        assert "confidence_interval" in result
        assert "effect_size" in result
        assert "interpretation" in result
        
        # Validate statistical properties
        assert -3 < result["test_statistic"] < 3
        assert 0 <= result["p_value"] <= 1
    
    def test_engine_contract(self, tester):
        """Test engine follows contract."""
        engine = tester.load_engine("engines/statistics.py")
        contract = tester.load_contract("contracts/statistics-engine.yaml")
        
        # Validate inputs
        assert tester.validate_inputs(engine, contract)
        
        # Validate outputs
        assert tester.validate_outputs(engine, contract)
        
        # Validate failure modes
        assert tester.validate_failure_modes(engine, contract)
    
    def test_engine_performance(self, tester, sample_data):
        """Test engine performance."""
        engine = tester.load_engine("engines/statistics.py")
        
        # Measure execution time
        import time
        start = time.time()
        
        for _ in range(100):
            engine.execute(
                data=sample_data,
                analysis_type="t_test_ind",
                parameters={
                    "group_col": "group",
                    "value_col": "value"
                }
            )
        
        elapsed = time.time() - start
        avg_time = elapsed / 100
        
        # Should be fast
        assert avg_time < 0.1  # Less than 100ms per execution
```

### 4. Output Testing
Test output quality and format.

```python
# tests/test_outputs.py
import pytest
from kimchi.testing import OutputTester

class TestReportOutputs:
    """Test report outputs."""
    
    @pytest.fixture
    def tester(self):
        return OutputTester()
    
    def test_executive_summary(self, tester):
        """Test executive summary format."""
        output = {
            "bottom_line": "Revenue declined 18% due to competitor pricing",
            "key_findings": [
                {"finding": "Competitor X undercut prices by 30%", "impact": "$500K"},
                {"finding": "Marketing leads decreased 25%", "impact": "$300K"}
            ],
            "recommendations": [
                {"action": "Retrain sales team", "timeline": "2 weeks", "owner": "VP Sales"},
                {"action": "Launch re-engagement campaign", "timeline": "4 weeks", "owner": "CMO"}
            ]
        }
        
        # Validate structure
        assert tester.validate_structure(output, "executive_summary")
        
        # Validate content quality
        assert tester.validate_content_quality(output, {
            "bottom_line": {"min_length": 20, "max_length": 100},
            "key_findings": {"min_items": 3, "max_items": 5},
            "recommendations": {"min_items": 2, "max_items": 5}
        })
    
    def test_forecast_output(self, tester):
        """Test forecast output format."""
        output = {
            "point_forecast": [100, 102, 104, 106, 108],
            "lower_bound": [95, 97, 99, 101, 103],
            "upper_bound": [105, 107, 109, 111, 113],
            "metrics": {
                "mape": 0.12,
                "rmse": 5.2,
                "coverage": 0.94
            }
        }
        
        # Validate structure
        assert tester.validate_structure(output, "forecast")
        
        # Validate statistical properties
        assert all(output["lower_bound"][i] <= output["point_forecast"][i] <= output["upper_bound"][i] 
                   for i in range(len(output["point_forecast"])))
        
        # Validate metrics
        assert 0 <= output["metrics"]["mape"] <= 1
        assert output["metrics"]["coverage"] >= 0.8
    
    def test_model_card(self, tester):
        """Test model card format."""
        output = {
            "model_name": "Churn Prediction Model",
            "version": "1.0.0",
            "description": "Predicts customer churn probability",
            "performance": {
                "accuracy": 0.85,
                "precision": 0.82,
                "recall": 0.78,
                "f1": 0.80,
                "auc": 0.88
            },
            "limitations": [
                "Performance may degrade for new customer segments",
                "Requires at least 6 months of historical data"
            ],
            "ethical_considerations": [
                "Model may have bias against certain demographic groups",
                "Should be used as decision support, not automation"
            ]
        }
        
        # Validate structure
        assert tester.validate_structure(output, "model_card")
        
        # Validate completeness
        required_fields = ["model_name", "version", "description", "performance", "limitations"]
        assert all(field in output for field in required_fields)
```

### 5. Integration Testing
Test end-to-end integration.

```python
# tests/test_integration.py
import pytest
from kimchi.testing import IntegrationTester

class TestEndToEnd:
    """Test end-to-end integration."""
    
    @pytest.fixture
    def tester(self):
        return IntegrationTester()
    
    def test_sales_analysis_pipeline(self, tester):
        """Test complete sales analysis pipeline."""
        # Load test data
        data = tester.load_test_data("sales_data.csv")
        
        # Execute pipeline
        result = tester.execute_pipeline(
            pipeline="sales_analysis",
            inputs={"data": data}
        )
        
        # Validate pipeline completed
        assert result["status"] == "completed"
        
        # Validate all steps completed
        assert all(step["status"] == "completed" for step in result["steps"])
        
        # Validate outputs
        assert "executive_summary" in result["outputs"]
        assert "detailed_analysis" in result["outputs"]
        assert "recommendations" in result["outputs"]
    
    def test_forecast_pipeline(self, tester):
        """Test forecasting pipeline."""
        data = tester.load_test_data("time_series.csv")
        
        result = tester.execute_pipeline(
            pipeline="forecasting",
            inputs={
                "time_series_data": data,
                "forecast_horizon": 30
            }
        )
        
        assert result["status"] == "completed"
        assert "forecast" in result["outputs"]
        assert "validation_report" in result["outputs"]
    
    def test_pipeline_error_handling(self, tester):
        """Test pipeline handles errors gracefully."""
        # Provide invalid data
        result = tester.execute_pipeline(
            pipeline="forecasting",
            inputs={
                "time_series_data": None,
                "forecast_horizon": 30
            }
        )
        
        assert result["status"] == "failed"
        assert "error" in result
        assert "recommendation" in result
```

## Test Configuration

```python
# conftest.py
import pytest
from kimchi.testing import TestConfig

@pytest.fixture(scope="session")
def test_config():
    """Load test configuration."""
    return TestConfig({
        "test_data_path": "tests/data",
        "output_path": "tests/output",
        "timeout": 300,
        "parallel": True,
        "verbose": True
    })

@pytest.fixture(scope="session")
def sample_datasets():
    """Load sample datasets for testing."""
    import pandas as pd
    import numpy as np
    
    # Sales data
    sales_data = pd.DataFrame({
        'date': pd.date_range('2020-01-01', periods=1000),
        'revenue': np.random.randn(1000).cumsum() * 1000 + 100000,
        'orders': np.random.poisson(100, 1000),
        'customers': np.random.poisson(50, 1000)
    })
    
    # Customer data
    customer_data = pd.DataFrame({
        'customer_id': range(10000),
        'signup_date': pd.date_range('2019-01-01', periods=10000),
        'lifetime_value': np.random.exponential(500, 10000),
        'churned': np.random.binomial(1, 0.1, 10000)
    })
    
    return {
        'sales': sales_data,
        'customers': customer_data
    }
```

## Test Execution

```bash
# Run all tests
pytest tests/

# Run specific test type
pytest tests/test_prompts.py
pytest tests/test_workflows.py
pytest tests/test_components.py

# Run with coverage
pytest tests/ --cov=kimchi --cov-report=html

# Run performance tests
pytest tests/ -m performance

# Run integration tests
pytest tests/ -m integration

# Generate test report
pytest tests/ --html=report.html
```

## Test Metrics

```python
# metrics/test_metrics.py
class TestMetrics:
    """Collect and report test metrics."""
    
    def __init__(self):
        self.results = []
    
    def record_test(self, test_name, status, duration, coverage=None):
        """Record test result."""
        self.results.append({
            'test_name': test_name,
            'status': status,
            'duration': duration,
            'coverage': coverage,
            'timestamp': datetime.now()
        })
    
    def generate_report(self):
        """Generate test report."""
        total = len(self.results)
        passed = sum(1 for r in self.results if r['status'] == 'passed')
        failed = sum(1 for r in self.results if r['status'] == 'failed')
        skipped = sum(1 for r in self.results if r['status'] == 'skipped')
        
        avg_duration = sum(r['duration'] for r in self.results) / total
        avg_coverage = sum(r['coverage'] for r in self.results if r['coverage']) / total
        
        return {
            'summary': {
                'total': total,
                'passed': passed,
                'failed': failed,
                'skipped': skipped,
                'pass_rate': passed / total * 100
            },
            'performance': {
                'avg_duration': avg_duration,
                'total_duration': sum(r['duration'] for r in self.results)
            },
            'coverage': {
                'avg_coverage': avg_coverage
            }
        }
```

## Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-test.txt
      
      - name: Run tests
        run: pytest tests/ --cov=kimchi --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
        with:
          file: ./coverage.xml
      
      - name: Generate report
        if: always()
        run: pytest tests/ --html=report.html
      
      - name: Upload report
        uses: actions/upload-artifact@v2
        with:
          name: test-report
          path: report.html
```

## Best Practices

### Test Organization
1. **One test per behavior**: Each test should verify one specific behavior
2. **Clear naming**: Test names should describe what is being tested
3. **Independent tests**: Tests should not depend on each other
4. **Fast execution**: Tests should complete quickly
5. **Reliable**: Tests should produce consistent results

### Test Data
1. **Realistic data**: Use data that resembles production
2. **Edge cases**: Test boundary conditions
3. **Variety**: Test with different data characteristics
4. **Isolated**: Test data should be separate from production
5. **Versioned**: Track test data changes

### Test Maintenance
1. **Regular updates**: Keep tests current with code changes
2. **Delete obsolete tests**: Remove tests for removed features
3. **Refactor**: Improve tests as code evolves
4. **Document**: Explain complex test scenarios
5. **Review**: Code review test changes