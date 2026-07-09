# Cohort Analysis Workflow

## Overview
Systematic approach to analyzing customer behavior over time by grouping customers into cohorts based on shared characteristics or experiences.

## Phase 1: Problem Definition

### 1.1 Cohort Types
```python
COHORT_TYPES = {
    "acquisition": "Group by when customers first interacted",
    "behavioral": "Group by specific actions taken",
    "segment": "Group by customer characteristics",
    "geographic": "Group by location",
    "channel": "Group by acquisition channel"
}
```

### 1.2 Analysis Objectives
- **Retention analysis**: How long do customers stay?
- **Revenue analysis**: How does revenue evolve over time?
- **Behavior analysis**: How do engagement patterns change?
- **Comparison analysis**: Which cohorts perform best?

## Phase 2: Data Preparation

### 2.1 Data Structure
```python
import pandas as pd
import numpy as np

# Required data structure
data_schema = {
    "customer_id": "Unique customer identifier",
    "event_date": "Date of activity/purchase",
    "event_type": "Type of activity (purchase, login, etc.)",
    "revenue": "Revenue generated (if applicable)",
    "cohort_date": "Date of cohort assignment (first activity)"
}

# Example data structure
df = pd.DataFrame({
    'customer_id': ['C001', 'C002', 'C003', 'C001', 'C002'],
    'event_date': ['2024-01-15', '2024-01-20', '2024-02-01', '2024-02-15', '2024-03-01'],
    'event_type': ['purchase', 'purchase', 'purchase', 'purchase', 'purchase'],
    'revenue': [100, 150, 200, 120, 180]
})
```

### 2.2 Cohort Assignment
```python
# Assign cohorts based on first activity
df['event_date'] = pd.to_datetime(df['event_date'])
df['cohort_date'] = df.groupby('customer_id')['event_date'].transform('min')

# Calculate period number (months/days since cohort)
df['period_number'] = (
    (df['event_date'].dt.year - df['cohort_date'].dt.year) * 12 +
    (df['event_date'].dt.month - df['cohort_date'].dt.month)
)

# For daily cohorts
df['days_since_cohort'] = (df['event_date'] - df['cohort_date']).dt.days
```

## Phase 3: Retention Analysis

### 3.1 Retention Table
```python
# Create cohort retention table
def calculate_retention_table(df, cohort_col='cohort_date', period_col='period_number'):
    """Calculate retention rates by cohort and period"""
    
    # Count unique customers per cohort per period
    cohort_data = df.groupby([cohort_col, period_col])['customer_id'].nunique().reset_index()
    cohort_data.columns = [cohort_col, period_col, 'customers']
    
    # Pivot to create retention table
    cohort_table = cohort_data.pivot(index=cohort_col, columns=period_col, values='customers')
    
    # Calculate retention rates
    cohort_sizes = cohort_table[0]  # Period 0 is the cohort size
    retention_table = cohort_table.divide(cohort_sizes, axis=0) * 100
    
    return retention_table

retention_table = calculate_retention_table(df)
print(retention_table)
```

### 3.2 Retention Visualization
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Heatmap
plt.figure(figsize=(12, 8))
sns.heatmap(retention_table, annot=True, fmt='.1f', cmap='YlOrRd', 
            vmin=0, vmax=100, cbar_kws={'label': 'Retention Rate (%)'})
plt.title('Cohort Retention Rates')
plt.xlabel('Months Since Acquisition')
plt.ylabel('Cohort Month')
plt.show()

# Line plot for selected cohorts
plt.figure(figsize=(12, 6))
for cohort in retention_table.index[:6]:  # First 6 cohorts
    plt.plot(retention_table.columns, retention_table.loc[cohort], 
             marker='o', label=str(cohort))
plt.title('Retention Curves by Cohort')
plt.xlabel('Months Since Acquisition')
plt.ylabel('Retention Rate (%)')
plt.legend(title='Cohort')
plt.grid(True, alpha=0.3)
plt.show()
```

## Phase 4: Revenue Analysis

### 4.1 Revenue Per Cohort
```python
# Calculate cumulative revenue per cohort
revenue_by_cohort = df.groupby(['cohort_date', 'period_number']).agg({
    'revenue': 'sum',
    'customer_id': 'nunique'
}).reset_index()

# Calculate revenue per customer
revenue_by_cohort['revenue_per_customer'] = (
    revenue_by_cohort['revenue'] / revenue_by_cohort['customer_id']
)

# Pivot for visualization
revenue_table = revenue_by_cohort.pivot(
    index='cohort_date', 
    columns='period_number', 
    values='revenue_per_customer'
)

print("Revenue per Customer by Cohort:")
print(revenue_table)
```

### 4.2 Cumulative Revenue Analysis
```python
# Calculate cumulative revenue
cumulative_revenue = revenue_table.cumsum(axis=1)

# Visualize cumulative revenue
plt.figure(figsize=(12, 6))
for cohort in cumulative_revenue.index[:6]:
    plt.plot(cumulative_revenue.columns, cumulative_revenue.loc[cohort], 
             marker='o', label=str(cohort))
plt.title('Cumulative Revenue per Customer by Cohort')
plt.xlabel('Months Since Acquisition')
plt.ylabel('Cumulative Revenue ($)')
plt.legend(title='Cohort')
plt.grid(True, alpha=0.3)
plt.show()
```

### 4.3 Revenue Segmentation
```python
# Analyze revenue by customer segments within cohorts
def analyze_revenue_segments(df, cohort_col='cohort_date', segment_col='customer_segment'):
    """Analyze revenue by segment within cohorts"""
    
    segment_revenue = df.groupby([cohort_col, segment_col, 'period_number']).agg({
        'revenue': 'sum',
        'customer_id': 'nunique'
    }).reset_index()
    
    segment_revenue['revenue_per_customer'] = (
        segment_revenue['revenue'] / segment_revenue['customer_id']
    )
    
    return segment_revenue
```

## Phase 5: Behavior Analysis

### 5.1 Engagement Metrics
```python
# Calculate engagement metrics by cohort
engagement_metrics = df.groupby(['cohort_date', 'period_number']).agg({
    'customer_id': ['nunique', 'count'],  # Unique customers and total events
    'event_date': 'count'  # Total events
}).reset_index()

engagement_metrics.columns = ['cohort_date', 'period_number', 'unique_customers', 'total_events', 'event_count']
engagement_metrics['events_per_customer'] = (
    engagement_metrics['total_events'] / engagement_metrics['unique_customers']
)

# Pivot for visualization
engagement_table = engagement_metrics.pivot(
    index='cohort_date',
    columns='period_number',
    values='events_per_customer'
)

print("Events per Customer by Cohort:")
print(engagement_table)
```

### 5.2 Feature Adoption
```python
# Track feature adoption by cohort
def track_feature_adoption(df, cohort_col='cohort_date', feature_col='feature_used'):
    """Track feature adoption rates by cohort"""
    
    adoption_data = df.groupby([cohort_col, 'period_number', feature_col])['customer_id'].nunique().reset_index()
    adoption_data.columns = [cohort_col, 'period_number', 'feature', 'customers']
    
    # Calculate adoption rate
    cohort_sizes = df.groupby(cohort_col)['customer_id'].nunique()
    adoption_data['adoption_rate'] = adoption_data.apply(
        lambda x: x['customers'] / cohort_sizes[x[cohort_col]], axis=1
    ) * 100
    
    return adoption_data
```

## Phase 6: Comparative Analysis

### 6.1 Cohort Comparison
```python
# Compare cohort performance
def compare_cohorts(retention_table, revenue_table):
    """Compare key metrics across cohorts"""
    
    comparison = pd.DataFrame({
        'cohort_size': retention_table[0],
        'retention_3m': retention_table[3] if 3 in retention_table.columns else np.nan,
        'retention_6m': retention_table[6] if 6 in retention_table.columns else np.nan,
        'retention_12m': retention_table[12] if 12 in retention_table.columns else np.nan,
        'cumulative_revenue_6m': revenue_table.sum(axis=1) if revenue_table is not None else np.nan
    })
    
    return comparison.sort_values('retention_6m', ascending=False)

comparison = compare_cohorts(retention_table, revenue_table)
print("Cohort Comparison:")
print(comparison)
```

### 6.2 Statistical Significance
```python
from scipy import stats

def test_cohort_significance(cohort1_data, cohort2_data, metric='retention'):
    """Test if difference between cohorts is statistically significant"""
    
    if metric == 'retention':
        # Chi-square test for retention rates
        contingency = pd.crosstab(
            cohort1_data['retained'], 
            cohort2_data['retained']
        )
        chi2, p_value, dof, expected = stats.chi2_contingency(contingency)
    else:
        # t-test for continuous metrics
        t_stat, p_value = stats.ttest_ind(cohort1_data[metric], cohort2_data[metric])
    
    return p_value < 0.05, p_value
```

## Phase 7: Insights and Recommendations

### 7.1 Key Findings Template
```markdown
## Cohort Analysis Insights

### Retention Patterns
- **Best performing cohort**: [Cohort] with [X%] retention at [time]
- **Worst performing cohort**: [Cohort] with [X%] retention at [time]
- **Key insight**: [What drives retention differences]

### Revenue Insights
- **Highest LTV cohort**: [Cohort] with $[X] cumulative revenue
- **Revenue growth rate**: [X%] month-over-month for recent cohorts
- **Key insight**: [What drives revenue differences]

### Behavior Insights
- **Engagement trend**: [Increasing/Decreasing/Stable] over time
- **Feature adoption**: [Which features correlate with retention]
- **Key insight**: [What behaviors predict success]

### Recommendations
1. [Recommendation based on findings]
2. [Recommendation based on findings]
3. [Recommendation based on findings]
```

### 7.2 Actionable Recommendations
```python
def generate_recommendations(retention_table, revenue_table):
    """Generate actionable recommendations from cohort analysis"""
    
    recommendations = []
    
    # Analyze retention trends
    recent_cohorts = retention_table.tail(3)
    if recent_cohorts.mean(axis=1).is_monotonic_decreasing:
        recommendations.append("Recent cohorts show declining retention - investigate onboarding changes")
    
    # Analyze revenue trends
    if revenue_table is not None:
        revenue_trend = revenue_table.sum(axis=1).tail(3)
        if revenue_trend.is_monotonic_decreasing:
            recommendations.append("Revenue per customer declining - review pricing or value proposition")
    
    # Identify best practices
    best_cohort = retention_table[6].idxmax() if 6 in retention_table.columns else None
    if best_cohort:
        recommendations.append(f"Study cohort {best_cohort} for best practices - highest 6-month retention")
    
    return recommendations
```

## Quality Checklist

- [ ] Cohort definition clearly specified
- [ ] Data properly structured and validated
- [ ] Retention table calculated correctly
- [ ] Revenue analysis performed
- [ ] Behavior metrics analyzed
- [ ] Cohorts compared statistically
- [ ] Visualizations created and labeled
- [ ] Key insights documented
- [ ] Actionable recommendations provided
- [ ] Limitations acknowledged