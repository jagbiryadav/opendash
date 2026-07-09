# Analysis Prompts

## Business Context Extraction
```
Analyze the following business problem and extract:

1. Problem Statement: What is the core business problem?
2. Stakeholder: Who needs this answer? (CEO/VP/Manager/Analyst)
3. Decision Type: What decision will this inform? (Go/No-go, Budget, Strategy, Operations)
4. Success Criteria: How will we know this analysis succeeded?
5. Cost of Wrong: What happens if our answer is wrong? (Low/Medium/High/Catastrophic)
6. Timeline: When is the answer needed? (Hours/Days/Weeks)
7. Budget Constraints: Any resource limitations?
8. Known Constraints: Regulatory, technical, or political constraints?

User Request: {user_request}
```

## Hypothesis Generation
```
Based on the following business context, generate 3-5 testable hypotheses:

Business Context: {business_context}
Data Available: {data_description}

For each hypothesis provide:
- ID (H1, H2, etc.)
- Statement: Clear, testable statement
- Type: Causal, Correlational, Predictive
- Test: Specific analytical test to validate
- Expected Impact: Business impact if true
```

## Data Requirements
```
Based on the following analysis plan, identify data requirements:

Analysis Plan: {analysis_plan}
Business Context: {business_context}

Provide:
1. Required Data: What data is essential?
2. Nice-to-Have Data: What would strengthen the analysis?
3. Missing Data: What gaps exist and how to address them?
4. Data Quality: What quality issues to watch for?
5. Access Requirements: What permissions are needed?
```

## Analysis Strategy
```
Design an analysis strategy for the following problem:

Business Problem: {business_problem}
Available Data: {data_description}
Constraints: {constraints}
Timeline: {timeline}

Provide:
1. Analysis Approach: Methodology and techniques
2. Step-by-Step Plan: Ordered sequence of analyses
3. Agent Deployment: Which specialists to invoke
4. Quality Gates: What must pass before proceeding
5. Risk Mitigation: What could go wrong and how to handle it
```

## Findings Synthesis
```
Synthesize the following analysis findings into actionable insights:

Findings: {findings}
Business Context: {business_context}
Stakeholder: {stakeholder}

Provide:
1. Key Findings: Top 3-5 insights
2. Business Impact: Quantified impact ($, %, time)
3. Confidence Level: High/Medium/Low with rationale
4. Recommendations: Prioritized actions
5. Risks: What could go wrong with recommendations
```

## Root Cause Investigation
```
Investigate the root causes of the following problem:

Problem: {problem_description}
Data: {data_description}
Timeline: {timeline}

Apply multiple methods:
1. 5 Whys Analysis
2. Fishbone Diagram (People, Process, Technology, Materials, Measurement, Environment)
3. Pareto Analysis (80/20 rule)
4. Statistical Driver Analysis

Provide:
- Primary Root Cause: Main driver with evidence
- Secondary Causes: Contributing factors
- Confidence: How confident are we in this diagnosis?
- Validation: How to confirm this is the root cause?
```

## A/B Test Analysis
```
Analyze the following A/B test results:

Test: {test_description}
Primary Metric: {primary_metric}
Sample Size: {sample_size}
Duration: {duration}
Results: {results}

Provide:
1. Statistical Significance: Is the result significant?
2. Effect Size: How large is the effect?
3. Confidence Interval: Range of likely true values
4. Business Impact: What does this mean for the business?
5. Recommendation: Ship/Don't Ship/Extend Test
6. Segment Analysis: Any segments with different results?
```

## Forecast Interpretation
```
Interpret the following forecast results:

Forecast: {forecast_results}
Historical Data: {historical_context}
Business Context: {business_context}

Provide:
1. Key Predictions: Most important forecasts
2. Confidence Assessment: How reliable are these predictions?
3. Scenarios: Best/Base/Worst case outcomes
4. Business Implications: What decisions should be made?
5. Monitoring: What to watch for to validate accuracy?
```

## Model Interpretation
```
Interpret the following model results:

Model Type: {model_type}
Performance: {performance_metrics}
Feature Importance: {feature_importance}
Business Context: {business_context}

Provide:
1. Model Quality: Is this model good enough for production?
2. Key Drivers: What factors matter most?
3. Limitations: Where does the model fail?
4. Business Logic Check: Do the findings make business sense?
5. Recommendations: How to use this model in practice?
```

## Report Generation
```
Generate a {report_type} report for the following analysis:

Analysis: {analysis_summary}
Audience: {audience}
Key Findings: {findings}
Recommendations: {recommendations}

Report Type Options:
- Executive Summary (1-2 pages, for C-suite)
- Manager Report (3-5 pages, for VPs/Directors)
- Technical Report (10-20 pages, for analysts)
- Dashboard Specification

Include:
1. Executive Summary
2. Key Findings with Evidence
3. Recommendations with Impact
4. Risks and Limitations
5. Next Steps
```