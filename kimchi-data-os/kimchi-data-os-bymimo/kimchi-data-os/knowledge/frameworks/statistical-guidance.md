# Statistical Guidance for Analysts

## When to Use What

### Descriptive Statistics
**Purpose**: Summarize and describe data

**Use When**:
- First look at data
- Understanding distributions
- Identifying outliers
- Summarizing for stakeholders

**Key Metrics**:
- Mean, Median, Mode
- Standard Deviation, Variance
- Min, Max, Range
- Percentiles, Quartiles

**Pitfalls**:
- Mean sensitive to outliers
- Don't use mean for skewed data
- Always visualize distributions

---

### Correlation Analysis
**Purpose**: Measure strength of association

**Use When**:
- Exploring relationships between variables
- Identifying potential predictors
- Screening for multicollinearity

**Key Metrics**:
- Pearson correlation (-1 to 1)
- p-value for significance
- R-squared for explained variance

**Pitfalls**:
- Correlation ≠ causation
- Sensitive to outliers
- Only captures linear relationships

**Interpretation**:
```
| r | < 0.3: Weak
0.3 ≤ | r | < 0.7: Moderate
| r | ≥ 0.7: Strong
```

---

### Regression Analysis
**Purpose**: Model relationships and predict outcomes

**Use When**:
- Predicting continuous outcomes
- Quantifying relationships
- Testing causal hypotheses
- Controlling for confounders

**Types**:
- **Linear**: Continuous outcome
- **Logistic**: Binary outcome
- **Multiple**: Multiple predictors
- **Time Series**: Temporal data

**Assumptions**:
- Linearity
- Independence
- Homoscedasticity
- Normality of residuals

**Pitfalls**:
- Overfitting with many predictors
- Multicollinearity
- Extrapolation beyond data range

---

### Hypothesis Testing
**Purpose**: Make decisions based on data

**Use When**:
- Testing if effect exists
- Comparing groups
- Validating assumptions

**Key Concepts**:
- **Null Hypothesis (H0)**: No effect
- **Alternative Hypothesis (H1)**: Effect exists
- **p-value**: Probability of observing effect if H0 true
- **Alpha**: Significance threshold (usually 0.05)
- **Power**: Probability of detecting true effect

**Decision Rules**:
```
p < alpha: Reject H0 (statistically significant)
p ≥ alpha: Fail to reject H0
```

**Pitfalls**:
- Statistical vs practical significance
- Multiple comparisons problem
- Underpowered studies

---

### Time Series Analysis
**Purpose**: Analyze temporal patterns

**Use When**:
- Forecasting future values
- Understanding trends and seasonality
- Detecting changes over time

**Key Components**:
- **Trend**: Long-term direction
- **Seasonality**: Regular periodic patterns
- **Cyclical**: Irregular oscillations
- **Residual**: Random noise

**Methods**:
- Decomposition
- Moving averages
- Exponential smoothing
- ARIMA
- Prophet

**Assumptions**:
- Stationarity (or can be made stationary)
- Sufficient historical data
- No structural breaks

---

### Classification
**Purpose**: Predict categorical outcomes

**Use When**:
- Predicting yes/no decisions
- Segmenting into groups
- Risk scoring

**Key Metrics**:
- Accuracy
- Precision, Recall, F1
- AUC-ROC
- Confusion Matrix

**Algorithms**:
- Logistic Regression
- Decision Trees
- Random Forest
- Gradient Boosting
- SVM

**Pitfalls**:
- Class imbalance
- Overfitting
- Feature leakage

---

### Clustering
**Purpose**: Identify natural groups

**Use When**:
- Customer segmentation
- Pattern discovery
- Anomaly detection

**Key Metrics**:
- Silhouette Score
- Within-cluster sum of squares
- Davies-Bouldin Index

**Algorithms**:
- K-means
- Hierarchical
- DBSCAN
- Gaussian Mixture Models

**Pitfalls**:
- Choosing number of clusters
- Sensitivity to initialization
- Curse of dimensionality

---

### A/B Testing
**Purpose**: Compare two versions

**Use When**:
- Testing feature changes
- Comparing marketing campaigns
- Validating improvements

**Key Metrics**:
- Conversion rate
- Statistical significance
- Minimum Detectable Effect (MDE)
- Sample size

**Design**:
- Random assignment
- Control vs treatment
- Pre-specify metrics
- Guard against peeking

**Pitfalls**:
- Underpowered tests
- Multiple comparisons
- Novelty effects

---

### Bayesian Analysis
**Purpose**: Update beliefs with evidence

**Use When**:
- Incorporating prior knowledge
- Small sample sizes
- Need probability statements

**Key Concepts**:
- Prior distribution
- Likelihood
- Posterior distribution
- Credible intervals

**Advantages**:
- Natural uncertainty quantification
- Works with small samples
- Incorporates prior knowledge

**Pitfalls**:
- Prior specification
- Computational complexity
- Interpretation challenges

---

## Common Statistical Tests

### Comparing Means
- **t-test**: Two groups
- **ANOVA**: Multiple groups
- **Mann-Whitney**: Non-parametric alternative

### Comparing Proportions
- **Chi-square**: Independence test
- **Fisher's exact**: Small samples
- **Z-test**: Two proportions

### Relationships
- **Correlation**: Linear association
- **Regression**: Predictive modeling
- **ANOVA**: Group differences

### Time Series
- **ADF test**: Stationarity
- **Granger causality**: Temporal precedence
- **Ljung-Box**: Autocorrelation

---

## Power Analysis

**Purpose**: Determine required sample size

**Components**:
- **Effect Size**: Magnitude of difference
- **Alpha**: Significance level (usually 0.05)
- **Power**: Probability of detection (usually 0.80)
- **Sample Size**: Number of observations

**Rule of Thumb**:
- Small effect: n > 500
- Medium effect: n > 100
- Large effect: n > 30

**When to Use**:
- Before data collection
- Designing experiments
- Justifying sample size

---

## Effect Size

**Purpose**: Measure practical significance

**Types**:
- **Cohen's d**: Difference between means
- **Eta-squared**: Variance explained
- **Odds Ratio**: Binary outcomes
- **R-squared**: Regression

**Interpretation**:
```
Small:  d = 0.2, η² = 0.01
Medium: d = 0.5, η² = 0.06
Large:  d = 0.8, η² = 0.14
```

**Why It Matters**:
- Statistical significance ≠ practical importance
- Large samples can make trivial effects significant
- Effect size indicates real-world importance

---

## Common Pitfalls

### P-Hacking
**Problem**: Searching for significant p-values
**Solution**: Pre-specify hypotheses, correct for multiple comparisons

### Overfitting
**Problem**: Model fits noise, not signal
**Solution**: Cross-validation, regularization, simpler models

### Confounding
**Problem**: Hidden variables affect results
**Solution**: Randomization, control variables, causal inference

### Selection Bias
**Problem**: Non-representative sample
**Solution**: Random sampling, weighting, sensitivity analysis

### Survivorship Bias
**Problem**: Only analyzing successes
**Solution**: Include failures, use complete data

---

## Reporting Guidelines

### What to Report
1. Descriptive statistics
2. Statistical test used
3. Test statistic and p-value
4. Effect size and confidence interval
5. Sample size and power
6. Assumptions checked

### Example Report
```
Analysis: T-test comparing conversion rates
Groups: Control (n=500) vs Treatment (n=500)
Results: Control: 12.3% (SD=2.1%), Treatment: 14.7% (SD=2.4%)
t(998) = 3.45, p < 0.001
Effect size: Cohen's d = 0.35 (medium)
95% CI for difference: [1.1%, 3.7%]
Conclusion: Treatment significantly improved conversion rate
```

### Visualization Guidelines
1. Show distributions, not just means
2. Include uncertainty (error bars, confidence intervals)
3. Label axes clearly
4. Use appropriate chart types
5. Tell a story with data