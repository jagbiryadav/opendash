# Regression Workflow

## Overview
Systematic approach to building, validating, and deploying regression models for continuous outcome prediction.

## Phase 1: Problem Definition

### 1.1 Regression Type
```python
REGRESSION_TYPE = {
    "linear": "Linear relationship between features and target",
    "nonlinear": "Complex, non-linear relationships",
    "time_series": "Temporal dependencies in data",
    "hierarchical": "Nested/grouped data structure"
}
```

### 1.2 Business Context
- **Goal**: What decision will this model inform?
- **Metrics**: What matters most - MAE, RMSE, or R²?
- **Constraints**: Interpretability, latency, fairness requirements

## Phase 2: Data Preparation

### 2.1 Target Variable Analysis
```python
# Distribution analysis
print("Target statistics:")
print(df['target'].describe())

# Check for skewness
from scipy import stats
skewness = stats.skew(df['target'].dropna())
print(f"\nSkewness: {skewness:.2f}")

# Visualization
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(df['target'], bins=30, edgecolor='black')
axes[0].set_title('Target Distribution')
axes[1].boxplot(df['target'].dropna())
axes[1].set_title('Target Box Plot')
plt.tight_layout()
plt.show()
```

### 2.2 Target Transformation
```python
# Log transformation for skewed targets
if skewness > 1:
    df['target_log'] = np.log1p(df['target'])
    print("Applied log transformation")

# Box-Cox transformation
from scipy.stats import boxcox
df['target_boxcox'], lambda_val = boxcox(df['target'].dropna())
print(f"Box-Cox lambda: {lambda_val:.2f}")
```

### 2.3 Feature Engineering
```python
# Handle missing values
from sklearn.impute import SimpleImputer, KNNImputer

# Numerical features
num_imputer = SimpleImputer(strategy='median')
df[num_cols] = num_imputer.fit_transform(df[num_cols])

# Categorical features
cat_imputer = SimpleImputer(strategy='most_frequent')
df[cat_cols] = cat_imputer.fit_transform(df[cat_cols])

# Feature scaling
from sklearn.preprocessing import StandardScaler, RobustScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

## Phase 3: Model Selection

### 3.1 Algorithm Selection Guide
| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| Linear Regression | Interpretable, fast | Assumes linearity | Baseline, interpretable |
| Ridge/Lasso | Handles multicollinearity | Still linear | High-dimensional data |
| Random Forest | Robust, handles non-linearity | Less interpretable | General purpose |
| XGBoost | High performance | Requires tuning | Competition, production |
| LightGBM | Fast, handles large data | Can overfit | Large datasets |
| Neural Networks | Captures complex patterns | Needs lots of data | Large datasets |

### 3.2 Baseline Models
```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import cross_val_score

# Baseline models
models = {
    'Linear Regression': LinearRegression(),
    'Ridge': Ridge(alpha=1.0),
    'Lasso': Lasso(alpha=1.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(random_state=42)
}

# Cross-validation comparison
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    print(f"{name}: R² = {scores.mean():.3f} ± {scores.std():.3f}")
```

## Phase 4: Model Training

### 4.1 Train-Test Split
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
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
    XGBRegressor(random_state=42),
    param_grid,
    n_iter=50,
    cv=5,
    scoring='r2',
    random_state=42,
    n_jobs=-1
)

grid_search.fit(X_train, y_train)
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV R²: {grid_search.best_score_:.3f}")
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

### 5.1 Regression Metrics
```python
from sklearn.metrics import (mean_absolute_error, mean_squared_error, 
                             r2_score, mean_absolute_percentage_error)

# Predictions
y_pred = best_model.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
mape = mean_absolute_percentage_error(y_test, y_pred) * 100

print(f"MAE: {mae:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²: {r2:.3f}")
print(f"MAPE: {mape:.2f}%")
```

### 5.2 Residual Analysis
```python
# Residuals
residuals = y_test - y_pred

fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Residuals vs Predicted
axes[0, 0].scatter(y_pred, residuals, alpha=0.5)
axes[0, 0].axhline(y=0, color='r', linestyle='--')
axes[0, 0].set_xlabel('Predicted')
axes[0, 0].set_ylabel('Residuals')
axes[0, 0].set_title('Residuals vs Predicted')

# Residuals distribution
axes[0, 1].hist(residuals, bins=30, edgecolor='black')
axes[0, 1].set_title('Residuals Distribution')

# Q-Q plot
from scipy import stats
stats.probplot(residuals, dist="norm", plot=axes[1, 0])
axes[1, 0].set_title('Q-Q Plot')

# Actual vs Predicted
axes[1, 1].scatter(y_test, y_pred, alpha=0.5)
axes[1, 1].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
axes[1, 1].set_xlabel('Actual')
axes[1, 1].set_ylabel('Predicted')
axes[1, 1].set_title('Actual vs Predicted')

plt.tight_layout()
plt.show()
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
from sklearn.model_selection import KFold

cv = KFold(n_splits=5, shuffle=True, random_state=42)

cv_scores = cross_val_score(best_model, X, y, cv=cv, scoring='r2')
print(f"CV R²: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
```

### 6.2 Robustness Checks
```python
# Stability across different splits
scores = []
for i in range(10):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=i
    )
    model = best_model.__class__(**best_model.get_params())
    model.fit(X_train, y_train)
    scores.append(r2_score(y_test, model.predict(X_test)))

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
- **MAE**: [Value]
- **RMSE**: [Value]
- **R²**: [Value]
- **MAPE**: [Value]

### Training Data
- **Size**: [Number of samples]
- **Features**: [Number of features]
- **Date Range**: [Start to End]

### Limitations
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

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
- [ ] Target distribution analyzed
- [ ] Appropriate transformations applied
- [ ] Multiple algorithms compared
- [ ] Hyperparameters tuned
- [ ] Cross-validation performed
- [ ] Residuals analyzed
- [ ] Model interpreted (SHAP/LIME)
- [ ] Robustness checked
- [ ] Model card documented
- [ ] Monitoring plan defined
- [ ] Business impact quantified