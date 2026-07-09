# Model Development Prompts

## Problem Framing
```
Frame the following as a machine learning problem:

Business Problem: {business_problem}
Available Data: {data_description}
Success Criteria: {success_criteria}
Constraints: {constraints}

Provide:
1. Problem Type: Classification/Regression/Clustering/Time Series
2. Target Variable: What are we predicting?
3. Features: What inputs are available?
4. Evaluation Metrics: How to measure success?
5. Baseline: What's the simplest model to beat?
```

## Feature Engineering
```
Design features for the following modeling problem:

Target: {target_variable}
Data: {data_description}
Domain: {business_domain}
Constraints: {constraints}

Provide:
1. Numerical Features: Transformations, aggregations, ratios
2. Categorical Features: Encoding strategies
3. Temporal Features: Lags, rolling statistics, calendar features
4. Interaction Features: Combinations that might matter
5. Domain-Specific Features: Industry-specific engineering
```

## Model Selection
```
Recommend the best model for the following problem:

Problem Type: {problem_type}
Data Size: {rows} rows, {columns} columns
Constraints: {constraints}
Requirements: {requirements}

Compare:
1. Logistic/Linear Regression
2. Random Forest
3. XGBoost/LightGBM
4. Neural Networks (if applicable)

For each provide:
- Pros and cons for this problem
- Expected performance
- Interpretability level
- Training time
- Recommendation
```

## Hyperparameter Tuning
```
Design hyperparameter search for the following model:

Model: {model_type}
Data: {data_description}
Constraints: {time_budget}

Provide:
1. Search Space: Ranges for each parameter
2. Search Strategy: Grid/Random/Bayesian
3. Cross-Validation: K-folds, stratification
4. Early Stopping: When to stop
5. Expected Duration: Time estimate
```

## Model Evaluation
```
Evaluate the following model results:

Model: {model_type}
Metrics: {metrics}
Performance: {performance_data}
Business Context: {business_context}

Provide:
1. Performance Assessment: Is this good enough?
2. Error Analysis: Where does it fail?
3. Comparison: How does it compare to alternatives?
4. Business Impact: What does this mean in practice?
5. Next Steps: How to improve?
```

## Model Interpretation
```
Interpret the following model predictions:

Model: {model_type}
Features: {feature_list}
Predictions: {prediction_examples}
Business Context: {business_context}

Provide:
1. Feature Importance: What drives predictions?
2. SHAP Analysis: Individual prediction explanations
3. Partial Dependence: How features affect predictions
4. Business Logic Check: Do findings make sense?
5. Actionable Insights: What can we act on?
```

## Model Monitoring
```
Design monitoring for the following production model:

Model: {model_type}
Business Context: {business_context}
Data Pipeline: {pipeline_description}

Provide:
1. Performance Metrics: What to track
2. Data Drift: Detection methods
3. Concept Drift: Detection methods
4. Alerting: When to alert
5. Retraining: When to retrain
```

## Fairness Assessment
```
Assess fairness for the following model:

Model: {model_type}
Protected Attributes: {protected_attributes}
Performance: {performance_by_group}

Provide:
1. Fairness Metrics: Demographic parity, equalized odds, etc.
2. Disparate Impact: Ratio of outcomes across groups
3. Root Causes: Why disparities exist
4. Mitigation Strategies: How to address issues
5. Business Trade-offs: Accuracy vs fairness
```

## Model Documentation
```
Document the following model for production:

Model: {model_type}
Performance: {performance_metrics}
Features: {feature_list}
Training Data: {data_description}

Provide:
1. Model Card: Standard documentation
2. API Specification: Input/output format
3. Limitations: Known failure modes
4. Usage Guidelines: How to use correctly
5. Monitoring Plan: What to watch for
```

## Model Deployment
```
Plan deployment for the following model:

Model: {model_type}
Requirements: {deployment_requirements}
Infrastructure: {current_infrastructure}

Provide:
1. Deployment Strategy: Batch/real-time/hybrid
2. API Design: Endpoints, authentication, rate limiting
3. Infrastructure: Compute, storage, networking
4. Testing: Unit, integration, load testing
5. Rollback Plan: How to recover from issues
```