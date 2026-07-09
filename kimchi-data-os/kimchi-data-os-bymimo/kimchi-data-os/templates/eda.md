# Exploratory Data Analysis Report Template

## Report Header
```markdown
# Exploratory Data Analysis Report

**Dataset**: [Dataset Name]
**Analyst**: [Name]
**Date**: [Date]
**Purpose**: [What we're trying to understand]
```

## Executive Summary
```markdown
## Executive Summary

### Dataset Overview
- **Rows**: [Number]
- **Columns**: [Number]
- **Time Period**: [Start - End] (if applicable)
- **Data Quality Score**: [X/100]

### Key Findings
1. **[Finding 1]**: [Description]
   - Evidence: [Supporting data]
   - Business Implication: [What this means]

2. **[Finding 2]**: [Description]
   - Evidence: [Supporting data]
   - Business Implication: [What this means]

3. **[Finding 3]**: [Description]
   - Evidence: [Supporting data]
   - Business Implication: [What this means]

### Recommendations
1. **Data Quality**: [Actions needed]
2. **Feature Engineering**: [Opportunities identified]
3. **Next Steps**: [Recommended analysis]
```

## Data Overview

### Schema Information
```markdown
## Data Schema

### Column Details
| Column | Type | Non-Null % | Unique Values | Sample Values |
|--------|------|------------|---------------|---------------|
| [Col 1] | [Type] | [X%] | [Count] | [Samples] |
| [Col 2] | [Type] | [X%] | [Count] | [Samples] |
| [Col 3] | [Type] | [X%] | [Count] | [Samples] |
```

### Data Quality Assessment
```markdown
## Data Quality Assessment

### Missing Values
| Column | Missing Count | Missing % | Pattern | Recommended Action |
|--------|---------------|-----------|---------|-------------------|
| [Col 1] | [Count] | [X%] | [Pattern] | [Action] |
| [Col 2] | [Count] | [X%] | [Pattern] | [Action] |

### Duplicates
- **Exact Duplicates**: [Count] rows ([X%])
- **Potential Duplicates**: [Count] rows
- **Recommendation**: [Action]

### Data Quality Issues
1. **[Issue 1]**: [Description and impact]
2. **[Issue 2]**: [Description and impact]
3. **[Issue 3]**: [Description and impact]
```

## Univariate Analysis

### Numerical Variables
```markdown
## Numerical Variables

### Summary Statistics
| Variable | Mean | Median | Std | Min | Max | Skewness | Kurtosis |
|----------|------|--------|-----|-----|-----|----------|----------|
| [Var 1] | [Value] | [Value] | [Value] | [Value] | [Value] | [Value] | [Value] |
| [Var 2] | [Value] | [Value] | [Value] | [Value] | [Value] | [Value] | [Value] |

### Distribution Analysis
**[Variable 1]**:
- **Distribution Type**: [Normal/Skewed/Bimodal/etc.]
- **Outliers**: [Count] ([X%]) - [Method used]
- **Business Meaning**: [Interpretation]

[Charts showing distributions]
```

### Categorical Variables
```markdown
## Categorical Variables

### Value Distributions
**[Variable 1]**:
| Category | Count | Percentage | Cumulative % |
|----------|-------|------------|--------------|
| [Cat 1] | [Count] | [X%] | [X%] |
| [Cat 2] | [Count] | [X%] | [X%] |
| [Cat 3] | [Count] | [X%] | [X%] |

**Key Observations**:
- [Observation 1]
- [Observation 2]

[Charts showing distributions]
```

## Bivariate Analysis

### Correlations
```markdown
## Correlations

### Correlation Matrix
[Heatmap showing correlations]

### Strongest Correlations
| Variable 1 | Variable 2 | Correlation | Strength | Business Meaning |
|------------|------------|-------------|----------|------------------|
| [Var 1] | [Var 2] | [Value] | [Strong/Medium/Weak] | [Interpretation] |
| [Var 3] | [Var 4] | [Value] | [Strong/Medium/Weak] | [Interpretation] |

### Key Relationships
1. **[Relationship 1]**: [Description]
   - Correlation: [Value]
   - Business Implication: [What this means]

2. **[Relationship 2]**: [Description]
   - Correlation: [Value]
   - Business Implication: [What this means]
```

### Categorical vs Numerical
```markdown
## Categorical vs Numerical Analysis

### [Categorical Variable] vs [Numerical Variable]
[Box plot or similar visualization]

**Observations**:
- [Group 1]: Mean = [Value], Median = [Value]
- [Group 2]: Mean = [Value], Median = [Value]
- **Statistical Test**: [Test name], p-value = [Value]
- **Conclusion**: [Significant difference?]
```

### Categorical vs Categorical
```markdown
## Categorical vs Categorical Analysis

### [Variable 1] vs [Variable 2]
[Contingency table or visualization]

**Chi-Square Test**: [Statistic] = [Value], p-value = [Value]
**Cramér's V**: [Value] (Effect size)
**Conclusion**: [Association?]
```

## Temporal Analysis (if applicable)

### Time Series Patterns
```markdown
## Temporal Analysis

### Trend Analysis
- **Overall Trend**: [Upward/Downward/Flat]
- **Trend Strength**: [Strong/Moderate/Weak]
- **Change Points**: [Dates of significant changes]

### Seasonality
- **Seasonal Period**: [Daily/Weekly/Monthly/Quarterly]
- **Seasonal Strength**: [Strong/Moderate/Weak]
- **Peak Periods**: [When highest values occur]
- **Low Periods**: [When lowest values occur]

### Autocorrelation
- **Lag 1**: [Value]
- **Lag 7**: [Value] (if weekly pattern)
- **Lag 30**: [Value] (if monthly pattern)

[Charts showing temporal patterns]
```

## Outlier Analysis

### Outlier Detection
```markdown
## Outlier Analysis

### Detection Methods Used
1. **IQR Method**: [Count] outliers detected
2. **Z-Score Method**: [Count] outliers detected (|z| > 3)
3. **Isolation Forest**: [Count] anomalies detected

### Outlier Summary
| Variable | Method | Count | Percentage | Assessment |
|----------|--------|-------|------------|------------|
| [Var 1] | [Method] | [Count] | [X%] | [Genuine/Error] |
| [Var 2] | [Method] | [Count] | [X%] | [Genuine/Error] |

### Recommendations
1. **[Variable 1]**: [Action - Keep/Remove/Transform]
2. **[Variable 2]**: [Action - Keep/Remove/Transform]
```

## Feature Relationships

### Key Insights
```markdown
## Key Feature Relationships

### [Relationship 1]
- **Variables**: [Var 1] and [Var 2]
- **Pattern**: [Description]
- **Strength**: [Strong/Moderate/Weak]
- **Business Meaning**: [Interpretation]
- **Visualization**: [Chart reference]

### [Relationship 2]
- **Variables**: [Var 3] and [Var 4]
- **Pattern**: [Description]
- **Strength**: [Strong/Moderate/Weak]
- **Business Meaning**: [Interpretation]
- **Visualization**: [Chart reference]
```

## Dimensionality Analysis

### Principal Component Analysis
```markdown
## Dimensionality Analysis

### PCA Results
- **Components Retained**: [Number] (explaining [X%] variance)
- **Top Components**:
  1. PC1: [X%] variance - [Interpretation]
  2. PC2: [X%] variance - [Interpretation]
  3. PC3: [X%] variance - [Interpretation]

### Feature Clustering
[Visualization of feature clusters]

**Clusters Identified**:
1. **Cluster 1**: [Features] - [Interpretation]
2. **Cluster 2**: [Features] - [Interpretation]
3. **Cluster 3**: [Features] - [Interpretation]
```

## Recommendations

### Data Quality Actions
```markdown
## Recommendations

### Immediate Actions (Data Quality)
1. **[Action 1]**: [What to do]
   - **Priority**: [High/Medium/Low]
   - **Impact**: [What this improves]
   - **Effort**: [Low/Medium/High]

2. **[Action 2]**: [What to do]
   - **Priority**: [High/Medium/Low]
   - **Impact**: [What this improves]
   - **Effort**: [Low/Medium/High]
```

### Feature Engineering Opportunities
```markdown
### Feature Engineering Opportunities
1. **[Opportunity 1]**: [Description]
   - **Expected Impact**: [What this enables]
   - **Implementation**: [How to do it]

2. **[Opportunity 2]**: [Description]
   - **Expected Impact**: [What this enables]
   - **Implementation**: [How to do it]
```

### Next Steps
```markdown
### Recommended Next Steps
1. **[Step 1]**: [Analysis to perform]
   - **Purpose**: [What we'll learn]
   - **Requirements**: [Data/tools needed]

2. **[Step 2]**: [Analysis to perform]
   - **Purpose**: [What we'll learn]
   - **Requirements**: [Data/tools needed]

3. **[Step 3]**: [Analysis to perform]
   - **Purpose**: [What we'll learn]
   - **Requirements**: [Data/tools needed]
```

## Appendix

### Detailed Statistics
```markdown
## Appendix

### Table A1: Complete Summary Statistics
[Full statistical summary]

### Table A2: Correlation Matrix
[Complete correlation matrix]

### Table A3: Missing Value Patterns
[Detailed missing data analysis]
```

### Additional Visualizations
```markdown
### Additional Charts

**Figure A1**: [Supporting visualization]
**Figure A2**: [Supporting visualization]
**Figure A3**: [Supporting visualization]
```

## Report Quality Checklist

- [ ] All variables examined
- [ ] Missing values documented and handled
- [ ] Outliers identified and assessed
- [ ] Key relationships identified
- [ ] Temporal patterns analyzed (if applicable)
- [ ] Feature distributions understood
- [ ] Business context incorporated
- [ ] Findings documented with evidence
- [ ] Visualizations are clear and labeled
- [ ] Recommendations provided
- [ ] Next steps defined
- [ ] Limitations acknowledged