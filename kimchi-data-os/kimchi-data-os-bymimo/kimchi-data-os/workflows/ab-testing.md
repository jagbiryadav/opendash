# A/B Testing Workflow

## Overview
Rigorous experimental methodology for measuring the causal impact of changes on user behavior.

## Phase 1: Experiment Design

### 1.1 Hypothesis Formulation
```python
EXPERIMENT_HYPOTHESIS = {
    "null_hypothesis": "H₀: No difference between control and treatment",
    "alternative_hypothesis": "H₁: Treatment has effect on metric",
    "primary_metric": "What we're optimizing (conversion, revenue, etc.)",
    "guardrail_metrics": "What we're protecting (engagement, latency, etc.)",
    "secondary_metrics": "Additional insights (segment analysis, etc.)"
}
```

### 1.2 Sample Size Calculation
```python
from statsmodels.stats.power import NormalIndPower

# Parameters
effect_size = 0.02  # 2% lift (minimum detectable effect)
alpha = 0.05  # Significance level
power = 0.80  # Statistical power

# Calculate sample size
analysis = NormalIndPower()
sample_size = analysis.solve_power(
    effect_size=effect_size,
    alpha=alpha,
    power=power,
    ratio=1.0  # Equal allocation
)

print(f"Required sample size per group: {int(sample_size):,}")
print(f"Total sample size: {int(sample_size * 2):,}")

# Duration calculation
daily_traffic = 10000
days_needed = (sample_size * 2) / daily_traffic
print(f"Experiment duration: {int(days_needed)} days")
```

### 1.3 Randomization
```python
import hashlib

def assign_variant(user_id, experiment_id, salt=""):
    """Deterministic variant assignment using hashing"""
    hash_input = f"{user_id}:{experiment_id}:{salt}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    return "treatment" if hash_value % 2 == 0 else "control"

# Verify randomization
users = [f"user_{i}" for i in range(10000)]
assignments = [assign_variant(user, "exp_123") for user in users]
print(f"Control: {assignments.count('control')}")
print(f"Treatment: {assignments.count('treatment')}")
```

## Phase 2: Data Collection

### 2.1 Event Tracking
```python
# Event schema
event_schema = {
    "user_id": "string",
    "experiment_id": "string",
    "variant": "string",
    "event_type": "string",
    "event_data": "json",
    "timestamp": "datetime",
    "session_id": "string"
}

# Example events
events = [
    {"event_type": "page_view", "page": "/checkout"},
    {"event_type": "button_click", "button": "buy_now"},
    {"event_type": "purchase", "revenue": 49.99}
]
```

### 2.2 Data Validation
```python
# Check for Sample Ratio Mismatch (SRM)
from scipy.stats import chisquare

control_count = 4950
treatment_count = 5050
total = control_count + treatment_count

expected_ratio = 0.5
expected_control = total * expected_ratio
expected_treatment = total * (1 - expected_ratio)

chi2, p_value = chisquare([control_count, treatment_count], 
                          [expected_control, expected_treatment])

print(f"Control: {control_count} ({control_count/total*100:.1f}%)")
print(f"Treatment: {treatment_count} ({treatment_count/total*100:.1f}%)")
print(f"Chi-square p-value: {p_value:.4f}")
print("SRM detected!" if p_value < 0.05 else "No SRM detected")
```

## Phase 3: Analysis

### 3.1 Primary Metric Analysis
```python
import pandas as pd
from scipy import stats

# Load experiment data
df = pd.read_csv('experiment_data.csv')

# Calculate metrics per variant
metrics = df.groupby('variant').agg(
    users=('user_id', 'nunique'),
    conversions=('converted', 'sum'),
    revenue=('revenue', 'sum')
).assign(
    conversion_rate=lambda x: x['conversions'] / x['users'],
    arpu=lambda x: x['revenue'] / x['users']
)

print(metrics)

# Statistical test for conversion rate
control = df[df['variant'] == 'control']
treatment = df[df['variant'] == 'treatment']

# Proportion test
from statsmodels.stats.proportion import proportions_ztest

successes = [control['converted'].sum(), treatment['converted'].sum()]
nobs = [len(control), treatment['users'].sum()]

z_stat, p_value = proportions_ztest(successes, nobs, alternative='two-sided')

print(f"\nZ-statistic: {z_stat:.3f}")
print(f"P-value: {p_value:.4f}")
print("Statistically significant!" if p_value < 0.05 else "Not significant")
```

### 3.2 Confidence Intervals
```python
import numpy as np
from scipy import stats

def calculate_ci(data, confidence=0.95):
    """Calculate confidence interval for mean"""
    n = len(data)
    mean = np.mean(data)
    se = stats.sem(data)
    ci = stats.t.interval(confidence, n-1, loc=mean, scale=se)
    return mean, ci[0], ci[1]

# Conversion rate CIs
control_cr = control['converted']
treatment_cr = treatment['converted']

control_mean, control_ci_low, control_ci_high = calculate_ci(control_cr)
treatment_mean, treatment_ci_low, treatment_ci_high = calculate_ci(treatment_cr)

print(f"Control CR: {control_mean:.4f} [{control_ci_low:.4f}, {control_ci_high:.4f}]")
print(f"Treatment CR: {treatment_mean:.4f} [{treatment_ci_low:.4f}, {treatment_ci_high:.4f}]")

# Lift with CI
lift = (treatment_mean - control_mean) / control_mean
print(f"\nLift: {lift:.2%}")
```

### 3.3 Segment Analysis
```python
# Analyze by segments
segments = ['device', 'country', 'user_type']

for segment in segments:
    print(f"\n{segment.upper()} Analysis:")
    print("-" * 50)
    
    for group in df[segment].unique():
        group_data = df[df[segment] == group]
        
        control_group = group_data[group_data['variant'] == 'control']['converted']
        treatment_group = group_data[group_data['variant'] == 'treatment']['converted']
        
        if len(control_group) > 0 and len(treatment_group) > 0:
            z_stat, p_value = proportions_ztest(
                [control_group.sum(), treatment_group.sum()],
                [len(control_group), len(treatment_group)]
            )
            
            print(f"{group}: p={p_value:.4f}", end="")
            if p_value < 0.05:
                print(" *", end="")
            print()
```

## Phase 4: Decision Making

### 4.1 Decision Framework
```python
def make_decision(p_value, lift, ci_low, ci_high, guardrails):
    """Framework for experiment decisions"""
    
    # Check guardrails first
    for metric, value in guardrails.items():
        if value < threshold:
            return "NO_GO", f"Guardrail {metric} failed"
    
    # Statistical significance
    if p_value > 0.05:
        return "NO_DECISION", "Not statistically significant"
    
    # Practical significance
    if abs(lift) < 0.01:  # Less than 1% lift
        return "NO_DECISION", "Lift too small to be meaningful"
    
    # Confidence interval
    if ci_low > 0 and ci_high > 0:
        return "SHIP", "Positive and significant"
    elif ci_low < 0 and ci_high < 0:
        return "REVERT", "Negative impact detected"
    else:
        return "NO_DECISION", "CI crosses zero"

# Example decision
decision, reason = make_decision(
    p_value=0.02,
    lift=0.03,
    ci_low=0.01,
    ci_high=0.05,
    guardrails={'latency': 200, 'error_rate': 0.01}
)
print(f"Decision: {decision}")
print(f"Reason: {reason}")
```

### 4.2 Power Analysis
```python
from statsmodels.stats.power import NormalIndPower

# Post-hoc power analysis
observed_effect = abs(treatment_mean - control_mean) / control_mean
sample_size = len(control)

power_analysis = NormalIndPower()
achieved_power = power_analysis.solve_power(
    effect_size=observed_effect,
    nobs1=sample_size,
    alpha=0.05,
    ratio=1.0
)

print(f"Observed effect size: {observed_effect:.4f}")
print(f"Achieved power: {achieved_power:.2%}")
print("Underpowered!" if achieved_power < 0.8 else "Adequately powered")
```

## Phase 5: Reporting

### 5.1 Experiment Report Template
```markdown
## A/B Test Report

### Executive Summary
- **Experiment**: [Name]
- **Duration**: [Start] to [End]
- **Decision**: [Ship/No Ship/Extend]
- **Lift**: [X%] in [primary metric]
- **Confidence**: [X%]

### Methodology
- **Hypothesis**: [What we tested]
- **Sample size**: [N] per group
- **Duration**: [X days]
- **Primary metric**: [Metric and definition]

### Results
| Metric | Control | Treatment | Lift | P-value | Significant? |
|--------|---------|-----------|------|---------|--------------|
| Conversion Rate | X% | Y% | +Z% | 0.0XX | Yes/No |
| Revenue per User | $X | $Y | +Z% | 0.0XX | Yes/No |

### Guardrail Metrics
| Metric | Control | Treatment | Threshold | Status |
|--------|---------|-----------|-----------|--------|
| Page Load Time | Xms | Yms | <500ms | Pass/Fail |
| Error Rate | X% | Y% | <1% | Pass/Fail |

### Segment Analysis
[Key findings by segment]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

### Appendix
- Statistical methods
- Raw data
- Code repository
```

## Phase 6: Follow-up

### 6.1 Long-term Monitoring
```python
# Monitor for novelty effects
def check_novelty_effect(df, window_days=7):
    """Check if treatment effect decays over time"""
    
    for window in range(1, len(df) // window_days + 1):
        start = (window - 1) * window_days
        end = window * window_days
        
        period_data = df.iloc[start:end]
        control = period_data[period_data['variant'] == 'control']['converted']
        treatment = period_data[period_data['variant'] == 'treatment']['converted']
        
        if len(control) > 0 and len(treatment) > 0:
            lift = (treatment.mean() - control.mean()) / control.mean()
            print(f"Window {window}: Lift = {lift:.2%}")
```

### 6.2 Document Learnings
```python
# Experiment log
experiment_log = {
    "experiment_id": "EXP_123",
    "hypothesis": "Adding social proof increases checkout conversion",
    "result": "SHIPPED - 3.2% lift in conversion rate",
    "learnings": [
        "Social proof most effective for new users",
        "Effect stronger on mobile than desktop",
        "No impact on average order value"
    ],
    "next_steps": [
        "Test different social proof types",
        "Explore personalization opportunities"
    ]
}
```

## Quality Checklist

- [ ] Hypothesis clearly stated
- [ ] Sample size calculated
- [ ] Randomization verified (SRM check)
- [ ] Primary metric analyzed
- [ ] Statistical significance assessed
- [ ] Practical significance evaluated
- [ ] Confidence intervals reported
- [ ] Segment analysis performed
- [ ] Guardrail metrics checked
- [ ] Decision framework applied
- [ ] Results documented
- [ ] Learnings captured