# Feature Engineering Reference

## Numerical Features

### Scaling Methods
1. **StandardScaler**: (x - μ) / σ
   - Mean = 0, Std = 1
   - Assumes Gaussian distribution
   - Sensitive to outliers

2. **MinMaxScaler**: (x - min) / (max - min)
   - Range [0, 1]
   - Preserves zero entries in sparse data
   - Sensitive to outliers

3. **RobustScaler**: (x - median) / IQR
   - Robust to outliers
   - Uses median and IQR instead of mean and std

4. **MaxAbsScaler**: x / max(|x|)
   - Range [-1, 1]
   - Preserves sparsity

### Transformations
1. **Log transform**: log(x + 1)
   - Handles right-skewed data
   - Stabilizes variance

2. **Box-Cox transform**: (x^λ - 1) / λ if λ≠0, log(x) if λ=0
   - Requires positive values
   - Finds optimal λ to normalize distribution

3. **Yeo-Johnson transform**: Extension of Box-Cox for negative values
   - Works with any real numbers
   - Finds optimal λ

4. **Square root transform**: √x
   - Moderate skewness reduction
   - Works with zeros

5. **Power transform**: x^p
   - p < 1: Reduces right skew
   - p > 1: Reduces left skew

### Binning
1. **Equal-width**: Divides range into equal bins
   - Sensitive to outliers
   - Simple to implement

2. **Equal-frequency**: Same number of observations per bin
   - Handles outliers
   - May distort relationships

3. **Custom bins**: Domain-specific boundaries
   - Business logic driven
   - Most meaningful

4. **Decision tree binning**: Optimal splits using tree
   - Data-driven
   - Preserves relationship with target

### Polynomial Features
- **Degree 2**: x₁², x₂², x₁x₂
- **Degree 3**: x₁³, x₂³, x₁²x₂, x₁x₂²
- **Interaction terms**: x₁ × x₂
- **Caution**: Curse of dimensionality

### Aggregations
1. **Group-by aggregations**: mean, median, std, min, max, count
2. **Rolling window**: Moving statistics over time
3. **Expanding window**: Cumulative statistics
4. **Cross aggregations**: Statistics across multiple groups

## Categorical Features

### Encoding Methods
1. **One-Hot Encoding**: Binary columns per category
   - Creates sparse matrix
   - Good for nominal data
   - Increases dimensionality

2. **Label Encoding**: Integer mapping (0, 1, 2...)
   - Preserves ordinal relationships
   - Assumes order matters
   - Risk: Misinterpreted as continuous

3. **Ordinal Encoding**: Ordered integer mapping
   - For truly ordinal data
   - Example: low=0, medium=1, high=2

4. **Target Encoding**: Mean of target per category
   - Uses target information
   - Risk: Data leakage (use cross-validation)

5. **Frequency Encoding**: Count or frequency of category
   - Captures popularity
   - Simple and effective

6. **Binary Encoding**: Category → integer → binary digits
   - Fewer columns than one-hot
   - Good for high cardinality

7. **Hash Encoding**: Fixed-size representation
   - Handles high cardinality
   - Fixed memory usage
   - May have collisions

8. **Leave-One-Out Encoding**: Target encoding with LOO
   - Reduces overfitting
   - Each observation encoded without itself

### High Cardinality Handling
1. **Target encoding**: Most effective
2. **Frequency encoding**: Simple alternative
3. **Grouping**: Combine rare categories
4. **Embedding**: Neural network learned representation
5. **Feature hashing**: Fixed-size output

### Text Features
1. **Bag of Words**: Word counts
2. **TF-IDF**: Term frequency × inverse document frequency
3. **Word embeddings**: Word2Vec, GloVe, FastText
4. **Sentence embeddings**: BERT, Sentence-BERT
5. **N-grams**: Word combinations (2-grams, 3-grams)
6. **Character n-grams**: Character-level patterns

## Temporal Features

### Date/Time Extraction
1. **Year**: 2024
2. **Month**: 1-12
3. **Day**: 1-31
4. **Day of week**: 0-6 (Monday-Sunday)
5. **Day of year**: 1-365
6. **Week of year**: 1-52
7. **Quarter**: 1-4
8. **Hour**: 0-23
9. **Minute**: 0-59
10. **Is weekend**: Boolean
11. **Is month end**: Boolean
12. **Is quarter end**: Boolean

### Cyclical Encoding
- **Hour**: sin(2π × hour/24), cos(2π × hour/24)
- **Day of week**: sin(2π × day/7), cos(2π × day/7)
- **Month**: sin(2π × month/12), cos(2π × month/12)
- **Preserves cyclical nature**: 23:00 close to 00:00

### Lag Features
- **Previous values**: Yₜ₋₁, Yₜ₋₂, ..., Yₜ₋ₚ
- **Seasonal lags**: Yₜ₋ₛ, Yₜ₋₂ₛ (s = seasonal period)
- **Business lags**: Yₜ₋₇ (weekly), Yₜ₋₃₀ (monthly)

### Rolling Statistics
1. **Rolling mean**: Moving average
2. **Rolling std**: Volatility measure
3. **Rolling min/max**: Range within window
4. **Rolling median**: Robust central tendency
5. **Rolling skewness/kurtosis**: Distribution shape
6. **Rolling correlation**: Relationship stability

### Expanding Statistics
1. **Cumulative sum**: Running total
2. **Cumulative mean**: Running average
3. **Cumulative min/max**: Running extremes
4. **Expanding window**: All history up to current point

### Time Since Events
1. **Days since last purchase**
2. **Days since account creation**
3. **Time since last login**
4. **Recency features**

## Interaction Features

### Pairwise Interactions
- **Multiplication**: x₁ × x₂
- **Division**: x₁ / x₂ (if x₂ ≠ 0)
- **Addition**: x₁ + x₂
- **Subtraction**: x₁ - x₂

### Ratios
- **Price per unit**: revenue / quantity
- **Conversion rate**: conversions / visits
- **Growth rate**: (current - previous) / previous
- **Market share**: company_sales / total_market_sales

### Differences
- **Period-over-period**: current - previous
- **Year-over-year**: current - same_period_last_year
- **Gap from target**: actual - target

### Grouped Features
- **Mean encoding**: Category → mean of target
- **Group statistics**: Statistics within groups
- **Cross-group ratios**: Ratios between groups

## Missing Value Features

### Imputation Methods
1. **Mean/Median/Mode**: Simple baseline
2. **KNN imputation**: Use k-nearest neighbors
3. **Iterative imputation**: MICE (Multiple Imputation by Chained Equations)
4. **Regression imputation**: Predict missing values
5. **Forward/backward fill**: Time series specific

### Missing Value Indicators
- **Missing flag**: Boolean indicator
- **Missing count**: Number of missing features
- **Missing ratio**: Proportion of missing features

## Feature Selection

### Filter Methods
1. **Correlation**: Pearson, Spearman, Kendall
2. **Chi-square**: For categorical features
3. **Mutual information**: Non-linear relationships
4. **Variance threshold**: Remove low variance

### Wrapper Methods
1. **Forward selection**: Add features one by one
2. **Backward elimination**: Remove features one by one
3. **Recursive feature elimination**: Iteratively remove least important

### Embedded Methods
1. **L1 regularization**: Lasso (automatic feature selection)
2. **Tree-based importance**: Feature importance from trees
3. **Boruta**: All-relevant feature selection

### Dimensionality Reduction
1. **PCA**: Linear, unsupervised
2. **LDA**: Linear, supervised
3. **t-SNE**: Non-linear, visualization
4. **UMAP**: Non-linear, faster than t-SNE

## Feature Engineering Pipeline

### Step-by-Step Process
1. **Understand domain**: Business context and relationships
2. **Explore data**: Distributions, correlations, patterns
3. **Generate hypotheses**: What features might be predictive?
4. **Create features**: Based on domain knowledge and hypotheses
5. **Transform features**: Scaling, encoding, transformations
6. **Select features**: Remove redundant/irrelevant features
7. **Validate**: Test impact on model performance
8. **Document**: Record rationale and decisions

### Best Practices
1. **Domain knowledge first**: Features should make business sense
2. **Start simple**: Baseline features before complex ones
3. **Avoid leakage**: No future information in features
4. **Test impact**: Validate each feature improves model
5. **Document everything**: Rationale, formulas, decisions
6. **Reproducibility**: Pipeline should be deterministic
7. **Monitor drift**: Features may change over time

## Common Pitfalls

1. **Data leakage**: Using future information
2. **Target leakage**: Using target-derived features
3. **Over-engineering**: Too many features for small data
4. **Ignoring distributions**: Non-normal features
5. **Missing values**: Improper handling
6. **High cardinality**: Too many categories
7. **Multicollinearity**: Highly correlated features
8. **Feature explosion**: Too many polynomial/interaction terms
9. **Not validating**: Assuming features help without testing
10. **Ignoring drift**: Features that change over time