# Customer Churn Analysis Example

## Overview
Comprehensive example of predicting and preventing customer churn using machine learning and business analysis.

## Business Context
- **Company**: SaaS platform
- **Problem**: Monthly churn rate increased from 3% to 5%
- **Goal**: Identify at-risk customers and design intervention strategies
- **Timeline**: 2 weeks
- **Stakeholders**: VP Customer Success, CPO, CFO

## Data Sources

### 1. Customer Data
```sql
CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    signup_date DATE,
    plan_type VARCHAR(50),
    monthly_revenue DECIMAL(10,2),
    contract_length INT,
    last_login DATE,
    support_tickets INT,
    nps_score INT
);
```

### 2. Usage Data
```sql
CREATE TABLE usage (
    usage_id VARCHAR(50),
    customer_id VARCHAR(50),
    usage_date DATE,
    features_used INT,
    session_duration INT,
    actions_count INT
);
```

### 3. Support Data
```sql
CREATE TABLE support_tickets (
    ticket_id VARCHAR(50),
    customer_id VARCHAR(50),
    created_date DATE,
    resolved_date DATE,
    category VARCHAR(50),
    sentiment VARCHAR(20)
);
```

## Analysis Steps

### Phase 1: Problem Framing (Day 1)

**Churn Definition**:
- **Subscription churn**: Customer cancels subscription
- **Usage churn**: Customer stops using product (no login for 30 days)
- **Revenue churn**: Customer downgrades plan

**Business Questions**:
1. What is the current churn rate by segment?
2. What factors predict churn?
3. How early can we predict churn?
4. What interventions reduce churn?

**Success Criteria**:
- Identify top 5 churn predictors
- Build model with AUC > 0.80
- Define intervention strategy for each risk tier

### Phase 2: Feature Engineering (Days 2-3)

**RFM Features**:
```python
# Recency: Days since last login
customer_features['days_since_login'] = (
    pd.Timestamp.now() - customer_features['last_login']
).dt.days

# Frequency: Logins per month
customer_features['logins_per_month'] = (
    usage_data.groupby('customer_id')['usage_date'].count() / 
    customer_features['tenure_months']
)

# Monetary: Revenue per month
customer_features['revenue_per_month'] = (
    customer_features['total_revenue'] / 
    customer_features['tenure_months']
)
```

**Behavioral Features**:
```python
# Feature adoption
customer_features['features_used_avg'] = usage_data.groupby('customer_id')['features_used'].mean()
customer_features['feature_diversity'] = usage_data.groupby('customer_id')['feature_used'].nunique()

# Engagement trend
customer_features['engagement_trend'] = usage_data.groupby('customer_id').apply(
    lambda x: x['session_duration'].tail(30).mean() / x['session_duration'].head(30).mean()
)

# Support intensity
customer_features['tickets_per_month'] = support_data.groupby('customer_id').size() / customer_features['tenure_months']
customer_features['negative_sentiment_ratio'] = support_data[support_data['sentiment'] == 'negative'].groupby('customer_id').size() / support_data.groupby('customer_id').size()
```

**Calculated Features**:
```python
# Customer health score
customer_features['health_score'] = (
    customer_features['logins_per_month'] * 0.3 +
    customer_features['features_used_avg'] * 0.3 +
    customer_features['nps_score'] * 0.2 +
    (100 - customer_features['days_since_login']) * 0.2
)

# Churn risk score
customer_features['risk_score'] = (
    customer_features['days_since_login'] / 30 * 0.3 +
    (1 - customer_features['logins_per_month'] / 30) * 0.3 +
    customer_features['tickets_per_month'] * 0.2 +
    customer_features['negative_sentiment_ratio'] * 0.2
)
```

### Phase 3: Model Development (Days 4-6)

**Model Selection**:
```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier

models = {
    'logistic': LogisticRegression(class_weight='balanced'),
    'random_forest': RandomForestClassifier(n_estimators=100, class_weight='balanced'),
    'gradient_boosting': GradientBoostingClassifier(),
    'xgboost': XGBClassifier(scale_pos_weight=3)  # Handle class imbalance
}
```

**Cross-Validation**:
```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = {}
for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='roc_auc')
    results[name] = {
        'mean_auc': scores.mean(),
        'std_auc': scores.std()
    }
```

**Hyperparameter Tuning**:
```python
from sklearn.model_selection import RandomizedSearchCV

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7, 9],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.8, 0.9, 1.0]
}

search = RandomizedSearchCV(
    XGBClassifier(),
    param_grid,
    n_iter=20,
    cv=cv,
    scoring='roc_auc',
    random_state=42
)
search.fit(X_train, y_train)
```

### Phase 4: Model Evaluation (Days 7-8)

**Performance Metrics**:
```python
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))
print(f"AUC-ROC: {roc_auc_score(y_test, y_prob):.3f}")
```

**Threshold Optimization**:
```python
from sklearn.metrics import precision_recall_curve

precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
f1_scores = 2 * (precision * recall) / (precision + recall)
optimal_threshold = thresholds[f1_scores.argmax()]

print(f"Optimal threshold: {optimal_threshold:.3f}")
print(f"Precision at optimal: {precision[f1_scores.argmax()]:.3f}")
print(f"Recall at optimal: {recall[f1_scores.argmax()]:.3f}")
```

**SHAP Analysis**:
```python
import shap

explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test, feature_names=feature_names)
```

### Phase 5: Risk Segmentation (Days 9-10)

**Segment Definition**:
```python
# Probability thresholds
customer_features['churn_risk'] = pd.cut(
    customer_features['churn_probability'],
    bins=[0, 0.2, 0.5, 0.8, 1.0],
    labels=['Low', 'Medium', 'High', 'Critical']
)

# Segment profiles
segment_profiles = customer_features.groupby('churn_risk').agg({
    'customer_id': 'count',
    'monthly_revenue': 'mean',
    'health_score': 'mean',
    'days_since_login': 'mean'
}).rename(columns={'customer_id': 'count'})
```

**Risk Segments**:
| Segment | Count | Avg Revenue | Avg Health Score | Avg Days Since Login |
|---------|-------|-------------|------------------|---------------------|
| Low | 12,000 | $89 | 85 | 5 |
| Medium | 3,500 | $120 | 65 | 15 |
| High | 1,800 | $150 | 45 | 25 |
| Critical | 700 | $200 | 25 | 40 |

### Phase 6: Intervention Strategy (Days 11-12)

**Intervention Matrix**:
```python
interventions = {
    'Critical': {
        'action': 'Personal outreach from Customer Success Manager',
        'offer': 'Free month + dedicated support',
        'timing': 'Immediate',
        'owner': 'VP Customer Success',
        'budget': '$200 per customer'
    },
    'High': {
        'action': 'Automated email campaign + feature training',
        'offer': 'Discount on annual plan',
        'timing': 'Within 3 days',
        'owner': 'Customer Success Team',
        'budget': '$50 per customer'
    },
    'Medium': {
        'action': 'Re-engagement email + usage tips',
        'offer': 'Free upgrade to premium features',
        'timing': 'Within 1 week',
        'owner': 'Marketing Automation',
        'budget': '$20 per customer'
    },
    'Low': {
        'action': 'Monthly newsletter + success stories',
        'offer': 'Referral bonus',
        'timing': 'Regular cadence',
        'owner': 'Marketing Team',
        'budget': '$5 per customer'
    }
}
```

**ROI Calculation**:
```python
# Cost of intervention
intervention_cost = sum([
    segment_profiles.loc['Critical', 'count'] * 200,
    segment_profiles.loc['High', 'count'] * 50,
    segment_profiles.loc['Medium', 'count'] * 20,
    segment_profiles.loc['Low', 'count'] * 5
])

# Expected retention improvement
retention_improvement = {
    'Critical': 0.30,  # 30% of critical customers retained
    'High': 0.25,
    'Medium': 0.15,
    'Low': 0.05
}

revenue_saved = sum([
    segment_profiles.loc[seg, 'count'] * segment_profiles.loc[seg, 'monthly_revenue'] * 12 * retention_improvement[seg]
    for seg in ['Critical', 'High', 'Medium', 'Low']
])

roi = (revenue_saved - intervention_cost) / intervention_cost
print(f"ROI: {roi:.1%}")
```

### Phase 7: Reporting (Days 13-14)

**Executive Summary**:
```markdown
# Customer Churn Analysis - Q4 2024

## Bottom Line
- Churn rate increased from 3% to 5% (67% increase)
- Model predicts churn with 82% AUC-ROC
- Top predictors: Days since login, Feature usage, Support tickets
- Recommended intervention will save $2.1M annually

## Key Findings
1. Customers who don't use 3+ features in first 30 days have 3x churn risk
2. Support tickets with negative sentiment predict churn 60 days out
3. Monthly active users who skip 2+ weeks have 5x churn risk

## Recommendations
1. Critical segment: Personal outreach immediately ($140K investment)
2. High segment: Automated re-engagement campaign ($90K investment)
3. Product: Improve onboarding to drive feature adoption
4. Support: Proactive outreach for negative sentiment tickets

## Expected Impact
- Churn reduction: 1.5 percentage points (from 5% to 3.5%)
- Revenue saved: $2.1M annually
- ROI: 8:1 on intervention spend
```

## Files Structure
```
customer-churn/
├── README.md
├── data/
│   ├── customers.csv
│   ├── usage.csv
│   └── support_tickets.csv
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_development.ipynb
│   ├── 04_model_evaluation.ipynb
│   └── 05_intervention_strategy.ipynb
├── models/
│   ├── churn_model.pkl
│   └── model_card.md
├── reports/
│   ├── executive_summary.md
│   ├── technical_report.md
│   └── presentation.pptx
└── scripts/
    ├── feature_engineering.py
    ├── model_training.py
    └── prediction_service.py
```

## Key Learnings

1. **Feature engineering is critical**: Behavioral features outperformed demographic features
2. **Early prediction matters**: Can predict churn 30-60 days before it happens
3. **Intervention timing**: Earlier intervention is more effective and cheaper
4. **Segmentation enables personalization**: Different segments need different approaches
5. **ROI validation**: Always quantify expected impact before implementing
