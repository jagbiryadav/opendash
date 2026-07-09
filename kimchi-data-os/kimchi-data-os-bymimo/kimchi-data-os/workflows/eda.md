# Exploratory Data Analysis (EDA) Workflow

## Overview
Systematic exploration of data to understand structure, relationships, and patterns before formal analysis.

## Phase 1: Data Overview

### 1.1 Data Loading and Inspection
```python
# Load data
df = pd.read_csv('data.csv')

# Basic inspection
print(f"Shape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Data types:\n{df.dtypes}")
print(f"\nFirst 5 rows:\n{df.head()}")
print(f"\nLast 5 rows:\n{df.tail()}")
```

### 1.2 Data Quality Assessment
```python
# Missing values
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
print("Missing values:\n", missing[missing > 0].sort_values(ascending=False))

# Duplicates
duplicates = df.duplicated().sum()
print(f"\nDuplicate rows: {duplicates} ({duplicates/len(df)*100:.2f}%)")

# Data types
print(f"\nData types:\n{df.dtypes.value_counts()}")
```

## Phase 2: Univariate Analysis

### 2.1 Numerical Variables
```python
# Summary statistics
print(df.describe())

# Distribution plots
for col in df.select_dtypes(include=[np.number]).columns:
    fig, axes = plt.subplots(1, 2, figsize=(12, 4))
    
    # Histogram
    axes[0].hist(df[col].dropna(), bins=30, edgecolor='black')
    axes[0].set_title(f'{col} Distribution')
    axes[0].set_xlabel(col)
    axes[0].set_ylabel('Frequency')
    
    # Box plot
    axes[1].boxplot(df[col].dropna())
    axes[1].set_title(f'{col} Box Plot')
    
    plt.tight_layout()
    plt.show()
```

### 2.2 Categorical Variables
```python
# Value counts
for col in df.select_dtypes(include=['object', 'category']).columns:
    print(f"\n{col}:")
    print(df[col].value_counts())
    
    # Bar plot
    plt.figure(figsize=(10, 4))
    df[col].value_counts().plot(kind='bar')
    plt.title(f'{col} Distribution')
    plt.xticks(rotation=45)
    plt.show()
```

## Phase 3: Bivariate Analysis

### 3.1 Numerical vs Numerical
```python
# Correlation matrix
corr_matrix = df.corr()

# Heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()

# Scatter plots for highly correlated pairs
high_corr = [(i, j) for i in corr_matrix.columns 
             for j in corr_matrix.columns 
             if i != j and abs(corr_matrix.loc[i, j]) > 0.7]

for i, j in high_corr[:5]:  # Top 5
    plt.figure(figsize=(8, 6))
    plt.scatter(df[i], df[j], alpha=0.5)
    plt.xlabel(i)
    plt.ylabel(j)
    plt.title(f'{i} vs {j} (r={corr_matrix.loc[i, j]:.2f})')
    plt.show()
```

### 3.2 Numerical vs Categorical
```python
# Box plots by category
for num_col in df.select_dtypes(include=[np.number]).columns[:3]:
    for cat_col in df.select_dtypes(include=['object']).columns[:2]:
        plt.figure(figsize=(10, 6))
        sns.boxplot(x=cat_col, y=num_col, data=df)
        plt.title(f'{num_col} by {cat_col}')
        plt.xticks(rotation=45)
        plt.show()
```

### 3.3 Categorical vs Categorical
```python
# Chi-square test
from scipy.stats import chi2_contingency

for cat1 in df.select_dtypes(include=['object']).columns[:3]:
    for cat2 in df.select_dtypes(include=['object']).columns[1:4]:
        if cat1 != cat2:
            contingency = pd.crosstab(df[cat1], df[cat2])
            chi2, p, dof, expected = chi2_contingency(contingency)
            print(f"{cat1} vs {cat2}: chi2={chi2:.2f}, p={p:.4f}")
```

## Phase 4: Temporal Analysis

### 4.1 Time Series Patterns
```python
# If datetime column exists
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    
    # Trend
    plt.figure(figsize=(12, 6))
    plt.plot(df['date'], df['value'])
    plt.title('Value Over Time')
    plt.xlabel('Date')
    plt.ylabel('Value')
    plt.show()
    
    # Seasonality (if monthly data)
    if len(df) > 365:
        df['month'] = df['date'].dt.month
        monthly = df.groupby('month')['value'].mean()
        plt.figure(figsize=(10, 6))
        monthly.plot(kind='bar')
        plt.title('Average Value by Month')
        plt.show()
```

## Phase 5: Outlier Detection

### 5.1 Statistical Methods
```python
# IQR method
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
outliers = ((df < (Q1 - 1.5 * IQR)) | (df > (Q3 + 1.5 * IQR))).sum()
print("Outliers (IQR method):\n", outliers[outliers > 0])

# Z-score method
from scipy import stats
z_scores = np.abs(stats.zscore(df.select_dtypes(include=[np.number])))
outliers_z = (z_scores > 3).sum(axis=0)
print("\nOutliers (Z-score > 3):\n", outliers_z[outliers_z > 0])
```

## Phase 6: Feature Relationships

### 6.1 Dimensionality Reduction
```python
# PCA for numerical features
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

numerical_cols = df.select_dtypes(include=[np.number]).columns
X_scaled = StandardScaler().fit_transform(df[numerical_cols].dropna())

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1], alpha=0.5)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)')
plt.title('PCA Projection')
plt.show()
```

## Phase 7: Key Findings Documentation

### 7.1 Summary Template
```markdown
## EDA Summary

### Data Overview
- Shape: {rows} rows, {columns} columns
- Missing values: {percentage}%
- Duplicates: {count}

### Key Findings
1. **Distribution**: {finding about distributions}
2. **Correlations**: {finding about relationships}
3. **Outliers**: {finding about outliers}
4. **Patterns**: {finding about temporal patterns}

### Recommendations
1. {recommendation 1}
2. {recommendation 2}
3. {recommendation 3}

### Next Steps
1. {next step 1}
2. {next step 2}
```

## Quality Checklist

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