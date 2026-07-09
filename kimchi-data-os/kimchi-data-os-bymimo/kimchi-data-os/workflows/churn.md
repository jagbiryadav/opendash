# Customer Churn Analysis Workflow

## Overview
Systematic approach to predicting and preventing customer churn through predictive modeling and intervention strategies.

## Phase 1: Problem Definition

### 1.1 Churn Definition
```python
CHURN_DEFINITIONS = {
    "subscription": "Cancellation of subscription",
    "transactional": "No purchase in X days/weeks",
    "engagement": "No login/activity in X days",
    "contractual": "Non-renewal of contract",
    "voluntary": "Customer-initiated departure",
    "involuntary": "Payment failure / suspension"
}

# Define churn for your business
CHURN_WINDOW = 30  # days
CHURN_DEFINITION = "No purchase in last 30 days"
```

### 1.2 Business Context
- **Revenue impact**: What's the cost of losing a customer?
- **Retention cost**: What's the cost of keeping a customer?
- **Target segment**: Which customers are worth retaining?

## Phase 2: Data Preparation

### 2.1 Feature Engineering
```python
import pandas as pd
import numpy as np

def create_churn_features(df):
    """Create features for churn prediction"""
    
    # Recency features
    df['days_since_last_purchase'] = (pd.Timestamp.now() - df['last_purchase_date']).dt.days
    df['days_since_last_login'] = (pd.Timestamp.now() - df['last_login']).dt.days
    
    # Frequency features
    df['purchase_count_30d'] = df.groupby('customer_id')['order_date'].transform(
        lambda x: x.dt.dayofyear.diff(30).count()
    )
    df['purchase_count_90d'] = df.groupby('customer_id')['order_date'].transform(
        lambda x: x.dt.dayofyear.diff(90).count()
    )
    
    # Monetary features
    df['total_revenue'] = df.groupby('customer_id')['revenue'].transform('sum')
    df['avg_order_value'] = df.groupby('customer_id')['revenue'].transform('mean')
    df['revenue_trend'] = df.groupby('customer_id')['revenue'].transform(
        lambda x: x.rolling(3).mean().iloc[-1] / x.rolling(3).mean().iloc[0] if len(x) >= 3 else 1
    )
    
    # Engagement features
    df['login_frequency'] = df.groupby('customer_id')['login_date'].transform('count') / 90
    df['session_duration_avg'] = df.groupby('customer_id')['session_duration'].transform('mean')
    df['feature_usage_count'] = df.groupby('customer_id')['feature_used'].transform('nunique')
    
    # Behavioral features
    df['support_tickets_30d'] = df.groupby('customer_id')['ticket_date'].transform(
        lambda x: x.dt.dayofyear.diff(30).count()
    )
    df['complaint_count'] = df.groupby('customer_id')['complaint'].transform('sum')
    
    return df
```

### 2.2 Label Creation
```python
def create_churn_label(df, churn_window=30):
    """Create binary churn label"""
    
    # For each customer, check if they churned
    df['churned'] = df.groupby('customer_id')['last_activity_date'].transform(
        lambda x: (pd.Timestamp.now() - x).dt.days > churn_window
    ).astype(int)
    
    return df
```

### 2.3 Handle Class Imbalance
```python
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTETomek

# Check class distribution
print("Churn distribution:")
print(df['churned'].value_counts(normalize=True))

# Apply SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

print(f"\nAfter SMOTE:")
print(pd.Series(y_resampled).value_counts())
```

## Phase 3: Model Building

### 3.1 Baseline Models
```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

# Baseline models
models = {
    'Logistic Regression': LogisticRegression(random_state=42, class_weight='balanced'),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42)
}

# Cross-validation
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='roc_auc')
    print(f"{name}: ROC-AUC = {scores.mean():.3f} ± {scores.std():.3f}")
```

### 3.2 XGBoost Model
```python
from xgboost import XGBClassifier
from sklearn.model_selection import RandomizedSearchCV

# Hyperparameter tuning
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7, 9],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.8, 0.9, 1.0],
    'colsample_bytree': [0.8, 0.9, 1.0],
    'scale_pos_weight': [1, 2, 3]  # For imbalanced classes
}

xgb_model = XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss')

random_search = RandomizedSearchCV(
    xgb_model,
    param_grid,
    n_iter=50,
    cv=5,
    scoring='roc_auc',
    random_state=42,
    n_jobs=-1
)

random_search.fit(X_train, y_train)
print(f"Best parameters: {random_search.best_params_}")
print(f"Best ROC-AUC: {random_search.best_score_:.3f}")
```

### 3.3 Model Training
```python
# Train best model
best_model = random_search.best_estimator_
best_model.fit(X_train, y_train)

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Features:")
print(feature_importance.head(10))
```

## Phase 4: Model Evaluation

### 4.1 Classification Metrics
```python
from sklearn.metrics import (classification_report, confusion_matrix, 
                             roc_auc_score, roc_curve, precision_recall_curve)

# Predictions
y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

# Metrics
print(classification_report(y_test, y_pred))

# ROC-AUC
roc_auc = roc_auc_score(y_test, y_prob)
print(f"ROC-AUC: {roc_auc:.3f}")

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()
```

### 4.2 Threshold Optimization
```python
# Find optimal threshold
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
f1_scores = 2 * (precision * recall) / (precision + recall)
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx]

print(f"Optimal threshold: {optimal_threshold:.3f}")
print(f"F1 at optimal: {f1_scores[optimal_idx]:.3f}")

# Apply optimal threshold
y_pred_optimal = (y_prob >= optimal_threshold).astype(int)
print("\nClassification Report with Optimal Threshold:")
print(classification_report(y_test, y_pred_optimal))
```

### 4.3 Business Impact Analysis
```python
# Calculate business impact
def calculate_business_impact(y_true, y_pred, y_prob, 
                              retention_cost=50, 
                              churn_cost=500):
    """
    Calculate business impact of churn prediction model
    
    retention_cost: Cost to retain a customer (e.g., discount, offer)
    churn_cost: Cost of losing a customer (lost lifetime value)
    """
    
    # True positives: Correctly predicted churners (retain)
    tp = ((y_pred == 1) & (y_true == 1)).sum()
    
    # False positives: Predicted churn, but didn't (wasted retention cost)
    fp = ((y_pred == 1) & (y_true == 0)).sum()
    
    # False negatives: Missed churners (lost customers)
    fn = ((y_pred == 0) & (y_true == 1)).sum()
    
    # True negatives: Correctly predicted non-churners (no action needed)
    tn = ((y_pred == 0) & (y_true == 0)).sum()
    
    # Calculate costs
    retention_savings = tp * churn_cost  # Saved customers
    retention_costs = (tp + fp) * retention_cost  # Cost of retention campaigns
    churn_losses = fn * churn_cost  # Lost customers
    
    net_impact = retention_savings - retention_costs - churn_losses
    
    print(f"True Positives (retained): {tp}")
    print(f"False Positives (wasted cost): {fp}")
    print(f"False Negatives (missed): {fn}")
    print(f"True Negatives (no action): {tn}")
    print(f"\nRetention Savings: ${retention_savings:,.0f}")
    print(f"Retention Costs: ${retention_costs:,.0f}")
    print(f"Churn Losses: ${churn_losses:,.0f}")
    print(f"Net Impact: ${net_impact:,.0f}")
    
    return net_impact

impact = calculate_business_impact(y_test, y_pred_optimal, y_prob)
```

## Phase 5: Model Interpretation

### 5.1 SHAP Values
```python
import shap

# SHAP values
explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)

# Summary plot
shap.summary_plot(shap_values, X_test, feature_names=X.columns)

# Dependence plots for top features
top_features = feature_importance.head(3)['feature'].tolist()
for feature in top_features:
    shap.dependence_plot(feature, shap_values, X_test)
```

### 5.2 Risk Segmentation
```python
# Segment customers by churn risk
df['churn_probability'] = best_model.predict_proba(X)[:, 1]
df['risk_segment'] = pd.cut(
    df['churn_probability'],
    bins=[0, 0.3, 0.6, 1.0],
    labels=['Low Risk', 'Medium Risk', 'High Risk']
)

# Analyze segments
segment_analysis = df.groupby('risk_segment').agg({
    'customer_id': 'count',
    'total_revenue': 'mean',
    'days_since_last_purchase': 'mean',
    'churn_probability': 'mean'
}).rename(columns={'customer_id': 'customer_count'})

print(segment_analysis)
```

## Phase 6: Intervention Strategy

### 6.1 Retention Campaigns
```python
# Define intervention strategies by risk segment
interventions = {
    'Low Risk': {
        'strategy': 'Maintain engagement',
        'actions': ['Loyalty program', 'Newsletter', 'Feature updates'],
        'budget_per_customer': 10
    },
    'Medium Risk': {
        'strategy': 'Proactive engagement',
        'actions': ['Personalized offers', 'Success check-in', 'Training'],
        'budget_per_customer': 50
    },
    'High Risk': {
        'strategy': 'Urgent intervention',
        'actions': ['Executive outreach', 'Custom solution', 'Discount'],
        'budget_per_customer': 100
    }
}

# Calculate campaign ROI
for segment, strategy in interventions.items():
    segment_customers = df[df['risk_segment'] == segment]
    churn_rate = segment_customers['churned'].mean()
    avg_revenue = segment_customers['total_revenue'].mean()
    
    customers_at_risk = len(segment_customers) * churn_rate
    retention_cost = len(segment_customers) * strategy['budget_per_customer']
    potential_savings = customers_at_risk * avg_revenue
    
    roi = (potential_savings - retention_cost) / retention_cost
    
    print(f"\n{segment}:")
    print(f"  Customers: {len(segment_customers)}")
    print(f"  Churn Rate: {churn_rate:.1%}")
    print(f"  Budget: ${retention_cost:,.0f}")
    print(f"  Potential Savings: ${potential_savings:,.0f}")
    print(f"  ROI: {roi:.1%}")
```

### 6.2 Campaign Execution
```python
# Create campaign targets
campaign_targets = df[df['risk_segment'].isin(['Medium Risk', 'High Risk'])][
    ['customer_id', 'churn_probability', 'risk_segment', 'total_revenue']
].sort_values('churn_probability', ascending=False)

# Export for execution
campaign_targets.to_csv('churn_retention_targets.csv', index=False)
print(f"Campaign targets: {len(campaign_targets)} customers")
```

## Phase 7: Monitoring

### 7.1 Model Monitoring
```python
# Monitor model performance over time
def monitor_model_performance(df, model, feature_columns, target_col):
    """Monitor model performance for drift"""
    
    # Calculate metrics
    y_pred = model.predict(df[feature_columns])
    y_prob = model.predict_proba(df[feature_columns])[:, 1]
    
    # Performance metrics
    roc_auc = roc_auc_score(df[target_col], y_prob)
    precision = precision_score(df[target_col], y_pred)
    recall = recall_score(df[target_col], y_pred)
    
    return {
        'roc_auc': roc_auc,
        'precision': precision,
        'recall': recall
    }
```

### 7.2 Business Monitoring
```python
# Monitor churn rate over time
monthly_churn = df.groupby(df['last_activity_date'].dt.to_period('M')).agg({
    'customer_id': 'count',
    'churned': 'sum'
})
monthly_churn['churn_rate'] = monthly_churn['churned'] / monthly_churn['customer_id']

print("Monthly Churn Rate:")
print(monthly_churn)
```

## Quality Checklist

- [ ] Churn definition clearly specified
- [ ] Relevant features engineered
- [ ] Class imbalance addressed
- [ ] Multiple models compared
- [ ] Hyperparameters tuned
- [ ] Model evaluated with business metrics
- [ ] Threshold optimized for business impact
- [ ] Model interpreted (SHAP)
- [ ] Risk segments defined
- [ ] Intervention strategies designed
- [ ] Campaign targets identified
- [ ] Monitoring plan established