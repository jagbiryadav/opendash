# Customer Segmentation Example

## Overview
Comprehensive example of customer segmentation using RFM analysis, clustering, and behavioral patterns.

## Business Context
- **Company**: E-commerce retailer
- **Problem**: One-size-fits-all marketing not effective
- **Goal**: Create actionable customer segments for personalized marketing
- **Timeline**: 3 weeks
- **Stakeholders**: CMO, VP Marketing, Head of CRM

## Data Sources

### 1. Transaction Data
```sql
CREATE TABLE transactions (
    transaction_id VARCHAR(50),
    customer_id VARCHAR(50),
    transaction_date DATE,
    amount DECIMAL(10,2),
    quantity INT,
    product_category VARCHAR(100),
    channel VARCHAR(50)
);
```

### 2. Customer Data
```sql
CREATE TABLE customers (
    customer_id VARCHAR(50),
    signup_date DATE,
    acquisition_channel VARCHAR(50),
    customer_segment VARCHAR(50),
    lifetime_value DECIMAL(10,2),
    last_activity_date DATE
);
```

### 3. Engagement Data
```sql
CREATE TABLE engagement (
    engagement_id VARCHAR(50),
    customer_id VARCHAR(50),
    event_type VARCHAR(50),
    event_date DATE,
    session_duration INT,
    pages_viewed INT
);
```

## Analysis Steps

### Phase 1: RFM Analysis (Days 1-2)

**RFM Calculation**:
```python
import pandas as pd
import numpy as np
from datetime import datetime

# Load data
transactions = pd.read_csv('transactions.csv')
transactions['transaction_date'] = pd.to_datetime(transactions['transaction_date'])

# Calculate RFM metrics
analysis_date = transactions['transaction_date'].max() + pd.Timedelta(days=1)

rfm = transactions.groupby('customer_id').agg({
    'transaction_date': lambda x: (analysis_date - x.max()).days,  # Recency
    'transaction_id': 'count',  # Frequency
    'amount': 'sum'  # Monetary
}).rename(columns={
    'transaction_date': 'recency',
    'transaction_id': 'frequency',
    'amount': 'monetary'
})

# Calculate RFM scores (1-5)
rfm['r_score'] = pd.qcut(rfm['recency'], 5, labels=[5, 4, 3, 2, 1])
rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5])
rfm['m_score'] = pd.qcut(rfm['monetary'], 5, labels=[1, 2, 3, 4, 5])

# Combined RFM score
rfm['rfm_score'] = rfm['r_score'].astype(str) + rfm['f_score'].astype(str) + rfm['m_score'].astype(str)
```

**RFM Segmentation**:
```python
# Define segments based on RFM scores
def assign_segment(row):
    r, f, m = int(row['r_score']), int(row['f_score']), int(row['m_score'])
    
    if r >= 4 and f >= 4 and m >= 4:
        return 'Champions'
    elif r >= 3 and f >= 3 and m >= 3:
        return 'Loyal Customers'
    elif r >= 4 and f <= 2:
        return 'New Customers'
    elif r >= 3 and f >= 3 and m <= 2:
        return 'Potential Loyalists'
    elif r <= 2 and f >= 3 and m >= 3:
        return 'At Risk'
    elif r <= 2 and f >= 4 and m >= 4:
        return 'Cant Lose Them'
    elif r <= 2 and f <= 2:
        return 'Lost'
    else:
        return 'Need Attention'

rfm['segment'] = rfm.apply(assign_segment, axis=1)
```

**RFM Results**:
| Segment | Count | % of Total | Avg Recency | Avg Frequency | Avg Monetary |
|---------|-------|------------|-------------|---------------|--------------|
| Champions | 2,450 | 12% | 15 days | 24 orders | $2,800 |
| Loyal Customers | 4,200 | 21% | 30 days | 15 orders | $1,500 |
| Potential Loyalists | 3,800 | 19% | 25 days | 8 orders | $800 |
| New Customers | 5,200 | 26% | 10 days | 2 orders | $250 |
| At Risk | 2,100 | 11% | 60 days | 12 orders | $1,200 |
| Cant Lose Them | 800 | 4% | 75 days | 20 orders | $2,500 |
| Lost | 1,450 | 7% | 90 days | 1 order | $150 |

### Phase 2: Behavioral Clustering (Days 3-5)

**Feature Engineering**:
```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Create behavioral features
behavioral_features = transactions.groupby('customer_id').agg({
    'amount': ['mean', 'std', 'min', 'max'],
    'quantity': ['sum', 'mean'],
    'transaction_date': [
        lambda x: (x.max() - x.min()).days,  # Tenure
        lambda x: x.dt.dayofweek.mode()[0],  # Preferred day
        lambda x: x.dt.hour.mode()[0]  # Preferred hour
    ]
})

behavioral_features.columns = [
    'avg_order_value', 'order_value_std', 'min_order', 'max_order',
    'total_quantity', 'avg_quantity',
    'tenure_days', 'preferred_day', 'preferred_hour'
]

# Add category diversity
category_diversity = transactions.groupby('customer_id')['product_category'].nunique()
behavioral_features['category_diversity'] = category_diversity

# Add channel preference
channel_preference = transactions.groupby('customer_id')['channel'].agg(lambda x: x.mode()[0])
behavioral_features['primary_channel'] = channel_preference
```

**Clustering**:
```python
# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(behavioral_features.fillna(0))

# Find optimal K
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Plot elbow curve
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Number of Clusters')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')

axes[1].plot(K_range, silhouette_scores, 'bo-')
axes[1].set_xlabel('Number of Clusters')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')

plt.tight_layout()
plt.show()

# Optimal K = 5 (based on elbow and silhouette)
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
behavioral_features['cluster'] = kmeans.fit_predict(X_scaled)
```

**Cluster Profiles**:
```python
# Analyze clusters
cluster_profiles = behavioral_features.groupby('cluster').agg({
    'avg_order_value': 'mean',
    'total_quantity': 'sum',
    'tenure_days': 'mean',
    'category_diversity': 'mean'
})

# Name clusters based on characteristics
cluster_names = {
    0: 'High-Value Regulars',
    1: 'Occasional Shoppers',
    2: 'New Explorers',
    3: 'Bulk Buyers',
    4: 'Window Shoppers'
}

behavioral_features['segment'] = behavioral_features['cluster'].map(cluster_names)
```

### Phase 3: Segment Deep Dive (Days 6-8)

**Segment Analysis**:
```python
# Comprehensive segment analysis
segment_analysis = {}

for segment in rfm['segment'].unique():
    segment_data = rfm[rfm['segment'] == segment]
    
    segment_analysis[segment] = {
        'size': len(segment_data),
        'revenue_contribution': segment_data['monetary'].sum() / rfm['monetary'].sum(),
        'avg_order_value': segment_data['monetary'].mean() / segment_data['frequency'].mean(),
        'purchase_frequency': segment_data['frequency'].mean(),
        'retention_potential': 1 - (segment_data['recency'].mean() / 90)
    }
```

**Segment Personas**:

| Segment | Persona | Characteristics | Marketing Strategy |
|---------|---------|-----------------|-------------------|
| Champions | "Power Users" | Frequent, high spend, recent | Loyalty rewards, exclusive access |
| Loyal Customers | "Reliable Regulars" | Consistent buyers, moderate spend | Upsell, cross-sell |
| Potential Loyalists | "Rising Stars" | Recent, growing frequency | Nurture, encourage frequency |
| New Customers | "Fresh Faces" | Very recent, low frequency | Onboarding, first repeat purchase |
| At Risk | "Fading Stars" | Were active, now declining | Re-engagement, win-back offers |
| Cant Lose Them | "VIPs at Risk" | High value, declining activity | Personal outreach, special offers |
| Lost | "Ghost Customers" | No recent activity, low frequency | Win-back campaign, survey |

### Phase 4: Predictive Modeling (Days 9-11)

**Churn Prediction**:
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

# Create target: Will customer churn in next 30 days?
# (simplified for example)
churn_features = behavioral_features.copy()
churn_features['churned'] = (churn_features['tenure_days'] > 60) & (churn_features['category_diversity'] < 2)

# Split data
X = churn_features.drop(['churned', 'primary_channel', 'cluster', 'segment'], axis=1)
y = churn_features['churned']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Evaluate
y_pred = rf.predict(X_test)
print(classification_report(y_test, y_pred))
print(f"ROC-AUC: {roc_auc_score(y_test, rf.predict_proba(X_test)[:, 1]):.3f}")
```

**Feature Importance**:
```python
import shap

explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test, feature_names=X.columns)
```

### Phase 5: Marketing Strategy (Days 12-13)

**Campaign Design**:
```python
campaigns = {
    'Champions': {
        'objective': 'Retention and advocacy',
        'channels': ['Email', 'App Push', 'Exclusive Events'],
        'offers': ['VIP discounts', 'Early access', 'Referral bonuses'],
        'frequency': 'Weekly',
        'budget_per_customer': 50
    },
    'Loyal Customers': {
        'objective': 'Upsell and increase frequency',
        'channels': ['Email', 'Retargeting'],
        'offers': ['Bundle deals', 'Loyalty points', 'Free shipping'],
        'frequency': 'Bi-weekly',
        'budget_per_customer': 30
    },
    'Potential Loyalists': {
        'objective': 'Convert to loyal',
        'channels': ['Email', 'Social'],
        'offers': ['First repeat purchase discount', 'Product recommendations'],
        'frequency': 'Weekly',
        'budget_per_customer': 25
    },
    'At Risk': {
        'objective': 'Re-engagement',
        'channels': ['Email', 'SMS', 'Direct Mail'],
        'offers': ['Win-back discount', 'We miss you', 'Special offer'],
        'frequency': 'Weekly for 4 weeks',
        'budget_per_customer': 40
    },
    'Cant Lose Them': {
        'objective': 'Urgent intervention',
        'channels': ['Phone', 'Email', 'Direct Mail'],
        'offers': ['Personal outreach', 'Custom solution', 'Significant discount'],
        'frequency': 'Immediate + follow-up',
        'budget_per_customer': 100
    }
}
```

### Phase 6: Implementation (Day 14)

**Implementation Checklist**:
- [ ] Segment assignments loaded into CRM
- [ ] Campaign templates created
- [ ] Automation rules configured
- [ ] Tracking pixels installed
- [ ] A/B test plans defined
- [ ] Success metrics documented

## Expected Business Impact

| Segment | Current Value | Target Improvement | Expected Impact |
|---------|---------------|-------------------|-----------------|
| Champions | $6.9M | +10% retention | +$690K |
| Loyal Customers | $6.3M | +15% frequency | +$945K |
| Potential Loyalists | $3.0M | +20% conversion | +$600K |
| At Risk | $2.5M | +25% reactivation | +$625K |
| Cant Lose Them | $2.0M | +30% retention | +$600K |
| **Total** | **$20.7M** | | **+$3.465M (17%)** |

## Files Structure
```
customer-segmentation/
├── README.md
├── data/
│   ├── transactions.csv
│   ├── customers.csv
│   └── engagement.csv
├── notebooks/
│   ├── 01_rfm_analysis.ipynb
│   ├── 02_clustering.ipynb
│   ├── 03_segment_deep_dive.ipynb
│   ├── 04_predictive_modeling.ipynb
│   └── 05_marketing_strategy.ipynb
├── models/
│   ├── churn_model.pkl
│   └── segment_model.pkl
├── reports/
│   ├── segment_profiles.md
│   ├── marketing_strategy.md
│   └── executive_summary.md
└── scripts/
    ├── rfm_calculation.py
    ├── clustering.py
    └── campaign_generator.py
```

## Key Learnings

1. **RFM + Behavioral**: Combining RFM with behavioral data creates richer segments
2. **Actionability**: Segments must map to distinct marketing strategies
3. **Predictive power**: Understanding churn risk enables proactive intervention
4. **Continuous refinement**: Segments should be refreshed monthly
