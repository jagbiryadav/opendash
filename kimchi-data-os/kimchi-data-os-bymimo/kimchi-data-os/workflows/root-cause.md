# Root Cause Analysis Workflow

## Overview
Systematic methodology for identifying the fundamental causes of problems or events, moving beyond symptoms to underlying drivers.

## Phase 1: Problem Definition

### 1.1 Problem Statement
```python
PROBLEM_STATEMENT = {
    "what": "What is the observed problem/effect?",
    "when": "When did it start/occur?",
    "where": "Where is it happening (segment, region, product)?",
    "who": "Who is affected?",
    "impact": "What is the business impact?",
    "baseline": "What was the expected behavior?"
}
```

### 1.2 Scope Definition
- **In scope**: What factors to investigate
- **Out of scope**: What to exclude
- **Time frame**: Period of analysis
- **Data available**: What data sources exist

## Phase 2: Data Collection

### 2.1 Data Assembly
```python
import pandas as pd

# Gather relevant data
data_sources = {
    "transaction_data": "purchases, orders, revenue",
    "customer_data": "demographics, behavior, feedback",
    "operational_data": "system logs, performance metrics",
    "external_data": "market trends, competitor actions, economic indicators"
}

# Load and merge data
def assemble_analysis_data(data_sources):
    """Combine data from multiple sources for root cause analysis"""
    
    dfs = {}
    for source, description in data_sources.items():
        try:
            dfs[source] = pd.read_csv(f'{source}.csv')
            print(f"Loaded {source}: {len(dfs[source])} rows")
        except FileNotFoundError:
            print(f"Warning: {source} not found")
    
    return dfs
```

### 2.2 Temporal Analysis
```python
# Identify when the problem started
def detect_change_point(series, method='cusum'):
    """Detect when a change occurred in a time series"""
    
    if method == 'cusum':
        # Cumulative sum method
        mean = series.mean()
        std = series.std()
        cusum = (series - mean).cumsum()
        
        # Find point of maximum deviation
        change_point = cusum.abs().idxmax()
        return change_point
    
    elif method == 'rolling':
        # Rolling statistics method
        rolling_mean = series.rolling(window=7).mean()
        rolling_std = series.rolling(window=7).std()
        
        # Find where mean shifts significantly
        mean_shift = rolling_mean.diff().abs() > 2 * rolling_std.mean()
        change_point = mean_shift.idxmax()
        return change_point
    
    return None
```

## Phase 3: Diagnostic Analysis

### 3.1 Pareto Analysis (80/20 Rule)
```python
# Identify the vital few causes
def pareto_analysis(df, cause_col, effect_col):
    """Apply Pareto principle to identify major causes"""
    
    # Aggregate effect by cause
    cause_effect = df.groupby(cause_col)[effect_col].sum().sort_values(ascending=False)
    
    # Calculate cumulative percentage
    cumulative_pct = cause_effect.cumsum() / cause_effect.sum() * 100
    
    # Find causes contributing to 80% of effect
    vital_few = cumulative_pct[cumulative_pct <= 80].index.tolist()
    
    # Visualization
    fig, ax1 = plt.subplots(figsize=(12, 6))
    
    # Bar chart for individual causes
    ax1.bar(range(len(cause_effect)), cause_effect.values)
    ax1.set_xlabel('Causes')
    ax1.set_ylabel('Effect')
    ax1.set_xticks(range(len(cause_effect)))
    ax1.set_xticklabels(cause_effect.index, rotation=45)
    
    # Line chart for cumulative percentage
    ax2 = ax1.twinx()
    ax2.plot(range(len(cumulative_pct)), cumulative_pct.values, 'r-o')
    ax2.set_ylabel('Cumulative %')
    ax2.axhline(y=80, color='r', linestyle='--', label='80% threshold')
    
    plt.title('Pareto Analysis')
    plt.tight_layout()
    plt.show()
    
    return vital_few, cause_effect

vital_few, cause_effect = pareto_analysis(df, 'cause', 'impact')
print(f"Vital few causes (80% of impact): {vital_few}")
```

### 3.2 5 Whys Analysis
```python
def five_whys(problem, data_analysis):
    """Structured 5 Whys analysis"""
    
    whys = []
    current_problem = problem
    
    for i in range(5):
        print(f"\nWhy #{i+1}: {current_problem}")
        
        # Analyze data to find cause
        potential_causes = data_analysis(current_problem)
        
        if potential_causes:
            root_cause = potential_causes[0]  # Select most likely cause
            whys.append({
                'level': i + 1,
                'problem': current_problem,
                'cause': root_cause,
                'evidence': f"Data shows {root_cause}"
            })
            current_problem = f"{root_cause} caused {current_problem}"
        else:
            break
    
    return whys

# Example usage
whys = five_whys(
    "Sales dropped 18%",
    lambda problem: ["Marketing spend decreased 20%", "New competitor entered market"]
)
```

### 3.3 Fishbone Diagram (Ishikawa)
```python
def create_fishbone(categories, problem):
    """Create fishbone diagram structure"""
    
    fishbone = {
        'problem': problem,
        'categories': {}
    }
    
    for category in categories:
        fishbone['categories'][category] = {
            'causes': [],
            'sub-causes': {}
        }
    
    return fishbone

def add_cause_to_fishbone(fishbone, category, cause, sub_causes=None):
    """Add cause to fishbone diagram"""
    
    if category in fishbone['categories']:
        fishbone['categories'][category]['causes'].append(cause)
        if sub_causes:
            fishbone['categories'][category]['sub-causes'][cause] = sub_causes
    
    return fishbone

# Example fishbone
categories = ['People', 'Process', 'Technology', 'Materials', 'Measurement', 'Environment']
fishbone = create_fishbone(categories, "Sales dropped 18%")

# Add causes
fishbone = add_cause_to_fishbone(fishbone, 'People', 'Staff turnover', ['High turnover in sales team', 'Training gaps'])
fishbone = add_cause_to_fishbone(fishbone, 'Process', 'Sales process unclear', ['No standardized process', 'CRM not followed'])
fishbone = add_cause_to_fishbone(fishbone, 'Technology', 'CRM system issues', ['Data quality problems', 'Reporting gaps'])
```

## Phase 4: Statistical Analysis

### 4.1 Correlation Analysis
```python
import seaborn as sns

# Identify correlations with the problem
def analyze_correlations(df, target_col, feature_cols):
    """Analyze correlations between features and target"""
    
    correlations = {}
    for col in feature_cols:
        if df[col].dtype in ['int64', 'float64']:
            corr = df[col].corr(df[target_col])
            correlations[col] = corr
    
    # Sort by absolute correlation
    sorted_corr = dict(sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True))
    
    # Visualization
    plt.figure(figsize=(10, 6))
    plt.barh(list(sorted_corr.keys())[:10], list(sorted_corr.values())[:10])
    plt.xlabel('Correlation Coefficient')
    plt.title(f'Top Correlations with {target_col}')
    plt.axvline(x=0, color='black', linestyle='-', linewidth=0.5)
    plt.show()
    
    return sorted_corr

correlations = analyze_correlations(df, 'sales_drop', ['marketing_spend', 'competitor_price', 'seasonality'])
```

### 4.2 Regression Analysis
```python
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

def driver_analysis(df, target_col, feature_cols):
    """Identify key drivers using regression"""
    
    # Prepare data
    X = df[feature_cols].dropna()
    y = df.loc[X.index, target_col]
    
    # Standardize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Fit regression
    model = LinearRegression()
    model.fit(X_scaled, y)
    
    # Get coefficients
    coefficients = pd.DataFrame({
        'feature': feature_cols,
        'coefficient': model.coef_,
        'abs_coefficient': abs(model.coef_)
    }).sort_values('abs_coefficient', ascending=False)
    
    # SHAP values for interpretability
    import shap
    explainer = shap.LinearExplainer(model, X_scaled)
    shap_values = explainer.shap_values(X_scaled)
    
    # Summary plot
    shap.summary_plot(shap_values, X, feature_names=feature_cols)
    
    return coefficients, model.score(X_scaled, y)

coefficients, r_squared = driver_analysis(df, 'sales', ['price', 'marketing', 'competitor'])
print(f"R-squared: {r_squared:.3f}")
print("\nDriver coefficients:")
print(coefficients)
```

### 4.3 Counterfactual Analysis
```python
def counterfactual_analysis(model, X, original_values, target_col, feature_to_vary):
    """Analyze what would have happened if a feature was different"""
    
    # Original prediction
    original_pred = model.predict(X.values.reshape(1, -1))[0]
    
    # Create counterfactual scenarios
    scenarios = []
    for new_value in np.linspace(X[feature_to_vary] * 0.5, X[feature_to_vary] * 1.5, 10):
        X_counterfactual = X.copy()
        X_counterfactual[feature_to_vary] = new_value
        pred = model.predict(X_counterfactual.values.reshape(1, -1))[0]
        scenarios.append({
            'feature_value': new_value,
            'predicted_value': pred,
            'change': pred - original_pred
        })
    
    # Visualization
    scenarios_df = pd.DataFrame(scenarios)
    plt.figure(figsize=(10, 6))
    plt.plot(scenarios_df['feature_value'], scenarios_df['predicted_value'])
    plt.axvline(x=X[feature_to_vary], color='r', linestyle='--', label='Original')
    plt.xlabel(feature_to_vary)
    plt.ylabel(f'Predicted {target_col}')
    plt.title(f'Counterfactual Analysis: {feature_to_vary}')
    plt.legend()
    plt.show()
    
    return scenarios_df
```

## Phase 5: Validation

### 5.1 Hypothesis Testing
```python
from scipy import stats

def validate_root_cause(df, cause_col, effect_col, cause_value):
    """Validate that a suspected cause actually affects the outcome"""
    
    # Split data by cause
    group_with_cause = df[df[cause_col] == cause_value][effect_col]
    group_without_cause = df[df[cause_col] != cause_value][effect_col]
    
    # Statistical test
    t_stat, p_value = stats.ttest_ind(group_with_cause, group_without_cause)
    
    # Effect size (Cohen's d)
    pooled_std = np.sqrt((group_with_cause.std()**2 + group_without_cause.std()**2) / 2)
    cohens_d = (group_with_cause.mean() - group_without_cause.mean()) / pooled_std
    
    print(f"Cause: {cause_col} = {cause_value}")
    print(f"Mean with cause: {group_with_cause.mean():.2f}")
    print(f"Mean without cause: {group_without_cause.mean():.2f}")
    print(f"p-value: {p_value:.4f}")
    print(f"Cohen's d: {cohens_d:.2f}")
    print(f"Statistically significant: {'Yes' if p_value < 0.05 else 'No'}")
    
    return p_value < 0.05, p_value
```

### 5.2 Sensitivity Analysis
```python
def sensitivity_analysis(model, X, feature_cols, target_col, n_simulations=1000):
    """Test how sensitive the result is to changes in each feature"""
    
    sensitivities = {}
    
    for feature in feature_cols:
        original_value = X[feature]
        original_pred = model.predict(X.values.reshape(1, -1))[0]
        
        # Vary feature by ±20%
        low_value = original_value * 0.8
        high_value = original_value * 1.2
        
        X_low = X.copy()
        X_low[feature] = low_value
        pred_low = model.predict(X_low.values.reshape(1, -1))[0]
        
        X_high = X.copy()
        X_high[feature] = high_value
        pred_high = model.predict(X_high.values.reshape(1, -1))[0]
        
        sensitivity = (pred_high - pred_low) / original_pred * 100
        sensitivities[feature] = sensitivity
    
    # Sort by absolute sensitivity
    sorted_sensitivities = dict(sorted(sensitivities.items(), key=lambda x: abs(x[1]), reverse=True))
    
    return sorted_sensitivities
```

## Phase 6: Reporting

### 6.1 Root Cause Report Template
```markdown
## Root Cause Analysis Report

### Executive Summary
- **Problem**: [Clear description of the problem]
- **Root Cause(s)**: [Primary cause identified]
- **Confidence**: [High/Medium/Low]
- **Impact**: [Business impact quantified]
- **Recommendation**: [Action to address root cause]

### Problem Description
- **What happened**: [Detailed description]
- **When**: [Timeline]
- **Where**: [Affected segments/areas]
- **Impact**: [Quantified business impact]

### Analysis Methods Used
1. [Method 1] - [Purpose]
2. [Method 2] - [Purpose]
3. [Method 3] - [Purpose]

### Root Cause(s) Identified
#### Primary Cause: [Cause Name]
- **Evidence**: [Statistical evidence]
- **Mechanism**: [How this cause leads to the problem]
- **Confidence**: [High/Medium/Low]

#### Secondary Cause(s): [If applicable]
- [List secondary causes]

### Validation
- [How the root cause was validated]
- [Statistical significance]
- [Business logic confirmation]

### Recommendations
1. **Immediate**: [Quick fix]
2. **Short-term**: [Process change]
3. **Long-term**: [Systemic improvement]

### Appendix
- Detailed analysis
- Data sources
- Statistical tests
```

## Quality Checklist

- [ ] Problem clearly defined
- [ ] Relevant data collected
- [ ] Multiple analysis methods used
- [ ] Root cause(s) identified
- [ ] Cause validated statistically
- [ ] Business logic confirmed
- [ ] Recommendations provided
- [ ] Impact quantified
- [ ] Report documented
- [ ] Follow-up actions defined