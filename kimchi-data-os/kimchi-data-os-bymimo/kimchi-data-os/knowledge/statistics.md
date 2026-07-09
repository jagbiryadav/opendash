# Statistical Methods Reference

## Descriptive Statistics

### Central Tendency
- **Mean**: Sum of values divided by count. Sensitive to outliers.
- **Median**: Middle value when sorted. Robust to outliers.
- **Mode**: Most frequent value. Useful for categorical data.

### Dispersion
- **Standard Deviation**: Square root of variance. Measures spread around mean.
- **Interquartile Range (IQR)**: Q3 - Q1. Robust measure of spread.
- **Range**: Max - Min. Sensitive to outliers.
- **Coefficient of Variation**: Standard deviation / mean. Useful for comparing variability across datasets.

### Distribution Shape
- **Skewness**: Asymmetry measure. Positive = right tail, Negative = left tail.
- **Kurtosis**: Tail heaviness. Leptokurtic (>3), Mesokurtic (3), Platykurtic (<3).

## Probability Distributions

### Continuous Distributions
1. **Normal (Gaussian)**: Bell-shaped, symmetric. Mean=Median=Mode.
   - Uses: Central Limit Theorem, many natural phenomena
   - Parameters: μ (mean), σ² (variance)

2. **Student's t-distribution**: Similar to normal but heavier tails.
   - Uses: Small sample inference, regression coefficients
   - Parameters: degrees of freedom (ν)

3. **Chi-square (χ²)**: Sum of squared standard normals.
   - Uses: Goodness-of-fit, independence tests, variance tests
   - Parameters: degrees of freedom (k)

4. **F-distribution**: Ratio of two chi-squares.
   - Uses: ANOVA, regression significance
   - Parameters: df1, df2

5. **Exponential**: Time between events in Poisson process.
   - Uses: Survival analysis, queuing theory
   - Parameters: λ (rate)

6. **Log-normal**: Variable whose log is normal.
   - Uses: Income, stock prices, survival times
   - Parameters: μ, σ of underlying normal

### Discrete Distributions
1. **Binomial**: Number of successes in n independent trials.
   - Uses: A/B testing, quality control
   - Parameters: n (trials), p (probability)

2. **Poisson**: Number of events in fixed interval.
   - Uses: Count data, arrival processes
   - Parameters: λ (rate)

3. **Negative Binomial**: Number of failures before r successes.
   - Uses: Overdispersed count data
   - Parameters: r (successes), p (probability)

## Hypothesis Testing Framework

### Steps
1. **State hypotheses**: H₀ (null) and H₁ (alternative)
2. **Choose significance level**: α (usually 0.05)
3. **Select appropriate test**: Based on data type, distribution, sample size
4. **Calculate test statistic**: From sample data
5. **Determine p-value**: Probability of observing statistic under H₀
6. **Make decision**: Reject H₀ if p-value < α

### Types of Errors
- **Type I Error (α)**: Reject true H₀ (false positive)
- **Type II Error (β)**: Fail to reject false H₀ (false negative)
- **Power (1-β)**: Probability of rejecting false H₀

### Effect Sizes
- **Cohen's d**: (Mean₁ - Mean₂) / pooled SD
  - Small: 0.2, Medium: 0.5, Large: 0.8
- **Eta-squared (η²)**: Proportion of variance explained
  - Small: 0.01, Medium: 0.06, Large: 0.14
- **Odds Ratio**: For categorical outcomes
- **Pearson's r**: Correlation coefficient
  - Small: 0.1, Medium: 0.3, Large: 0.5

## Parametric Tests

### t-tests
1. **One-sample t-test**: Compare sample mean to known value
   - Assumptions: Normality, independence
   - Formula: t = (x̄ - μ₀) / (s / √n)

2. **Independent samples t-test**: Compare two independent group means
   - Assumptions: Normality, independence, homogeneity of variance
   - Formula: t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)

3. **Paired samples t-test**: Compare means from same group at different times
   - Assumptions: Normality of differences, independence of pairs
   - Formula: t = d̄ / (s_d / √n)

### ANOVA (Analysis of Variance)
1. **One-way ANOVA**: Compare means across 3+ groups
   - Assumptions: Normality, homogeneity of variance, independence
   - F-statistic: Between-group variance / Within-group variance

2. **Two-way ANOVA**: Effects of two factors and interaction
   - Tests: Main effects + interaction effect

3. **Repeated measures ANOVA**: Same subjects measured multiple times
   - Assumptions: Sphericity (Mauchly's test)

4. **MANOVA**: Multiple dependent variables
   - Tests: Wilks' Lambda, Pillai's Trace

### Regression
1. **Simple linear regression**: Y = β₀ + β₁X + ε
   - Assumptions: Linearity, independence, homoscedasticity, normality of residuals

2. **Multiple linear regression**: Y = β₀ + β₁X₁ + ... + βₖXₖ + ε
   - Checks: Multicollinearity (VIF), model fit (R², adjusted R²)

3. **Logistic regression**: Log-odds = β₀ + β₁X₁ + ... + βₖXₖ
   - For binary outcomes
   - Metrics: Odds ratios, AUC-ROC

4. **Poisson regression**: For count outcomes
   - Link function: log
   - Check: Overdispersion

## Non-Parametric Tests

### When to Use
- Data not normally distributed
- Small sample sizes
- Ordinal data
- Outliers present

### Common Tests
1. **Mann-Whitney U test**: Independent samples (non-parametric t-test)
2. **Wilcoxon signed-rank test**: Paired samples (non-parametric paired t-test)
3. **Kruskal-Wallis test**: 3+ independent groups (non-parametric one-way ANOVA)
4. **Friedman test**: 3+ related groups (non-parametric repeated measures ANOVA)
5. **Spearman's rank correlation**: Monotonic relationships
6. **Kendall's tau**: Ordinal associations

## Multiple Comparisons Correction

### Methods
1. **Bonferroni**: α/m (most conservative)
2. **Šidák**: 1 - (1-α)^(1/m)
3. **Holm-Bonferroni**: Step-down procedure
4. **Benjamini-Hochberg**: Controls FDR (less conservative)
5. **Tukey's HSD**: For all pairwise comparisons in ANOVA

## Bayesian Statistics

### Core Concepts
- **Prior**: Belief before data
- **Likelihood**: Data evidence
- **Posterior**: Updated belief = Prior × Likelihood
- **Credible Interval**: Range containing X% of posterior probability

### Bayesian Tests
- **Bayes Factor**: Ratio of evidence for H₁ vs H₀
- **Bayesian t-test**: Posterior distribution of effect size
- **Bayesian regression**: Posterior distributions of coefficients

## Power Analysis

### Components
1. **Effect size**: Magnitude of difference (small/medium/large)
2. **Significance level (α)**: Usually 0.05
3. **Power (1-β)**: Usually 0.80
4. **Sample size**: Calculated from above

### Formulas (t-test)
- n per group = (Z_α/2 + Z_β)² × 2σ² / δ²
- Where δ = effect size, σ = standard deviation

## Correlation

### Types
1. **Pearson's r**: Linear relationships (-1 to +1)
2. **Spearman's ρ**: Monotonic relationships (rank-based)
3. **Kendall's τ**: Ordinal associations (concordant/discordant pairs)

### Interpretation
- 0.0-0.2: Very weak
- 0.2-0.4: Weak
- 0.4-0.6: Moderate
- 0.6-0.8: Strong
- 0.8-1.0: Very strong

## Statistical Decision Tree

```
Need hypothesis?
├─ Yes
│   ├─ How many groups?
│   │   ├─ 1 group
│   │   │   ├─ Continuous outcome?
│   │   │   │   ├─ Yes → One-sample t-test
│   │   │   │   └─ No → Binomial test
│   │   ├─ 2 groups
│   │   │   ├─ Independent?
│   │   │   │   ├─ Yes
│   │   │   │   │   ├─ Normal? → Independent t-test
│   │   │   │   │   └─ No → Mann-Whitney U
│   │   │   │   └─ No (paired)
│   │   │   │       ├─ Normal? → Paired t-test
│   │   │   │       └─ No → Wilcoxon signed-rank
│   │   └─ 3+ groups
│   │       ├─ Independent?
│   │       │   ├─ Yes
│   │       │   │   ├─ Normal + equal variance? → One-way ANOVA
│   │       │   │   └─ No → Kruskal-Wallis
│   │       │   └─ No (repeated)
│   │       │       ├─ Normal + sphericity? → Repeated measures ANOVA
│   │       │       └─ No → Friedman test
│   ├─ Relationship between variables?
│   │   ├─ Both continuous?
│   │   │   ├─ Linear? → Pearson's r
│   │   │   └─ Monotonic? → Spearman's ρ
│   │   ├─ Categorical?
│   │   │   ├─ 2×2 → Chi-square or Fisher's exact
│   │   │   └─ Larger → Chi-square
│   │   └─ One continuous, one categorical?
│   │       ├─ 2 groups → t-test or Mann-Whitney
│   │       └─ 3+ groups → ANOVA or Kruskal-Wallis
│   └─ Predict outcome?
│       ├─ Continuous → Regression
│       ├─ Binary → Logistic regression
│       ├─ Count → Poisson regression
│       └─ Survival → Cox regression
└─ No (exploratory)
    ├─ Clustering → K-means, DBSCAN, hierarchical
    ├─ Dimensionality reduction → PCA, t-SNE
    └─ Anomaly detection → Isolation forest, LOF
```

## Common Pitfalls

1. **P-hacking**: Testing multiple hypotheses until significance
2. **Multiple comparisons**: Not correcting for many tests
3. **Ecological fallacy**: Group-level correlations ≠ individual-level
4. **Simpson's paradox**: Trend reverses when data is aggregated
5. **Survivorship bias**: Only analyzing successful cases
6. **Confirmation bias**: Seeking evidence that confirms beliefs
7. **Overfitting**: Model fits noise, not signal
8. **Underfitting**: Model too simple to capture patterns
9. **Selection bias**: Non-random sample
10. **Attrition bias**: Dropouts not random
