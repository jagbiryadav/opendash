# Classification Workflow

## Overview
Systematic approach to building, validating, and deploying classification models.

## Phase 1: Problem Definition

### 1.1 Classification Type
```python
CLASSIFICATION_TYPE = {
    "binary": "Two classes (e.g., churn/no churn)",
    "multiclass": "Multiple classes (e.g., product categories)",
    "multilabel": "Multiple labels per instance (e.g., topic tagging)"
}
```

### 1.2 Business Context
- **Goal**: What decision will this model inform?
- **Metrics**: What matters most - precision, recall, or F1?
- **Cost**: What's the cost of false positives vs false negatives?
- **Constraints**: Latency, interpretability, fairness requirements

## Phase 2: Data Preparation

### 2.1 Target Variable Analysis
```python
# Class distribution
print("Class distribution:")
print(df['target'].value_counts())
print(f"\nClass balance ratio: {df['target'].value_counts().min() / df['target'].value_counts().max():.2f}")

# Visualize
plt.figure(figsize=(8, 4))
df['target'].value_counts().plot(kind='bar')
plt.title('Target Distribution')
plt.show()
```

### 2.2 Handle Class Imbalance
```python
from imblearn.over_sampling import SMOTE, RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTETomek

# SMOTE for moderate imbalance
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Random oversampling for severe imbalance
oversampler = RandomOverSampler(random_state=42)
X_resampled, y_resampled = oversampler.fit_resample(X, y)

# Class weights for model training
from sklearn.utils.class_weight import compute_class_weight
class_weights = compute_class_weight('balanced', classes=np.unique(y), y=y)
```

### 2.3 Feature Engineering
```python
# Encoding categorical variables
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Label encoding for ordinal
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# One-hot encoding for nominal
df_encoded = pd.get_dummies(df, columns=['category'], drop_first=True)

# Feature scaling
from sklearn.preprocessing import StandardScaler, RobustScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

## Phase 3: Model Selection

### 3.1 Algorithm Selection Guide
| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| Logistic Regression | Interpretable, fast | Linear boundaries | Baseline, interpretable |
| Random Forest | Robust, handles non-linearity | Less interpretable | General purpose |
| XGBoost | High performance | Requires tuning | Competition, production |
| LightGBM | Fast, handles categoricals | Can overfit small data | Large datasets |
| SVM | Effective in high dimensions | Slow on large data | Medium datasets |
| Neural Networks | Captures complex patterns | Needs lots of data, black box | Large datasets, images |

### 3.2 Baseline Models
```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# Baseline models
models = {
    'Logistic Regression': LogisticRegression(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(random_state=42)
}

# Cross-validation comparison
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='f1_weighted')
    print(f"{name}: F1 = {scores.mean():.3f} ± {scores.std():.3f}")
```

## Phase 4: Model Training

### 4.1 Train-Test Split
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```

### 4.2 Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

# XGBoost hyperparameter search
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7, 9],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.8, 0.9, 1.0],
    'colsample_bytree': [0.8, 0.9, 1.0]
}

grid_search = RandomizedSearchCV(
    XGBClassifier(random_state=42),
    param_grid,
    n_iter=50,
    cv=5,
    scoring='f1_weighted',
    random_state=42,
    n_jobs=-1
)

grid_search.fit(X_train, y_train)
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.3f}")
```

### 4.3 Model Training
```python
# Train best model
best_model = grid_search.best_estimator_
best_model.fit(X_train, y_train)

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance.head(10))
```

## Phase 5: Model Evaluation

### 5.1 Classification Metrics
```python
from sklearn.metrics import (classification_report, confusion_matrix, 
                             roc_auc_score, roc_curve, precision_recall_curve)

# Predictions
y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

# Classification report
print(classification_report(y_test, y_pred))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

# ROC-AUC
roc_auc = roc_auc_score(y_test, y_prob)
print(f"ROC-AUC: {roc_auc:.3f}")

# ROC curve
fpr, tpr, _ = roc_curve(y_test, y_prob)
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()
```

### 5.2 Threshold Optimization
```python
# Precision-Recall curve
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)

# Find optimal threshold (F1 score)
f1_scores = 2 * (precision * recall) / (precision + recall)
optimal_idx = np.argmax(f1_scores)
optimal_threshold = thresholds[optimal_idx]

print(f"Optimal threshold: {optimal_threshold:.3f}")
print(f"Precision at optimal: {precision[optimal_idx]:.3f}")
print(f"Recall at optimal: {recall[optimal_idx]:.3f}")
print(f"F1 at optimal: {f1_scores[optimal_idx]:.3f}")

# Apply optimal threshold
y_pred_optimal = (y_prob >= optimal_threshold).astype(int)
print("\nClassification Report with Optimal Threshold:")
print(classification_report(y_test, y_pred_optimal))
```

### 5.3 Model Interpretability
```python
# SHAP values
import shap

explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)

# Summary plot
shap.summary_plot(shap_values, X_test, feature_names=X.columns)

# Dependence plot for top feature
top_feature = feature_importance.iloc[0]['feature']
shap.dependence_plot(top_feature, shap_values, X_test)
```

## Phase 6: Validation

### 6.1 Cross-Validation
```python
from sklearn.model_selection import StratifiedKFold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores = cross_val_score(best_model, X, y, cv=cv, scoring='f1_weighted')
print(f"CV F1: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
```

### 6.2 Robustness Checks
```python
# Stability across different splits
scores = []
for i in range(10):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=i, stratify=y
    )
    model = best_model.__class__(**best_model.get_params())
    model.fit(X_train, y_train)
    scores.append(model.score(X_test, y_test))

print(f"Score stability: {np.mean(scores):.3f} ± {np.std(scores):.3f}")
```

## Phase 7: Deployment

### 7.1 Model Card
```markdown
## Model Card

### Model Details
- **Model Type**: [Algorithm]
- **Version**: [Version]
- **Date**: [Date]
- **Owner**: [Team/Person]

### Performance Metrics
- **Accuracy**: [Value]
- **Precision**: [Value]
- **Recall**: [Value]
- **F1 Score**: [Value]
- **ROC-AUC**: [Value]

### Training Data
- **Size**: [Number of samples]
- **Features**: [Number of features]
- **Date Range**: [Start to End]
- **Class Distribution**: [Distribution]

### Limitations
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

### Ethical Considerations
- [Fairness concern 1]
- [Fairness concern 2]

### Usage Guidelines
- [Guideline 1]
- [Guideline 2]

### Monitoring
- **Metrics to monitor**: [List]
- **Retraining trigger**: [Condition]
- **Drift detection**: [Method]
```

## Quality Checklist

- [ ] Problem clearly defined
- [ ] Class imbalance addressed
- [ ] Multiple algorithms compared
- [ ] Hyperparameters tuned
- [ ] Cross-validation performed
- [ ] Threshold optimized
- [ ] Model interpreted (SHAP/LIME)
- [ ] Robustness checked
- [ ] Fairness assessed
- [ ] Model card documented
- [ ] Monitoring plan defined
- [ ] Business impact quantified