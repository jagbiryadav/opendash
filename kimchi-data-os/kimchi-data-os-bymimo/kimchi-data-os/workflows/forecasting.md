# Forecasting Workflow

## Overview
Systematic approach to time series forecasting with uncertainty quantification and scenario planning.

## Phase 1: Problem Definition

### 1.1 Forecast Requirements
```python
FORECAST_REQUIREMENTS = {
    "objective": "What decision will this forecast inform?",
    "horizon": "How far ahead? (days/weeks/months/quarters)",
    "granularity": "What level? (daily/weekly/monthly)",
    "segments": "By product/region/channel/customer?",
    "accuracy_target": "What accuracy is needed?",
    "update_frequency": "How often will forecast be updated?"
}
```

### 1.2 Business Context
- Revenue forecasting: Budget, hiring, investment
- Demand forecasting: Inventory, production, staffing
- Capacity forecasting: Infrastructure, hiring, expansion

## Phase 2: Data Preparation

### 2.1 Time Series Data Validation
```python
# Check temporal coverage
print(f"Date range: {df['date'].min()} to {df['date'].max()}")
print(f"Total days: {(df['date'].max() - df['date'].min()).days}")

# Check frequency
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date').sort_index()

# Check for gaps
expected_dates = pd.date_range(start=df.index.min(), 
                               end=df.index.max(), 
                               freq='D')
missing_dates = expected_dates.difference(df.index)
print(f"Missing dates: {len(missing_dates)}")

# Check for duplicates
print(f"Duplicate dates: {df.index.duplicated().sum()}")
```

### 2.2 Missing Value Handling
```python
# Interpolation for time series
df['value'] = df['value'].interpolate(method='time')

# Forward/backward fill for short gaps
df['value'] = df['value'].fillna(method='ffill', limit=7)

# Seasonal decomposition to understand patterns
from statsmodels.tsa.seasonal import seasonal_decompose
decomposition = seasonal_decompose(df['value'], model='additive', period=12)
```

## Phase 3: Exploratory Analysis

### 3.1 Time Series Components
```python
# Trend
plt.figure(figsize=(12, 8))
plt.subplot(411)
plt.plot(df['value'], label='Original')
plt.legend(loc='upper left')

plt.subplot(412)
plt.plot(decomposition.trend, label='Trend')
plt.legend(loc='upper left')

plt.subplot(413)
plt.plot(decomposition.seasonal, label='Seasonal')
plt.legend(loc='upper left')

plt.subplot(414)
plt.plot(decomposition.resid, label='Residual')
plt.legend(loc='upper left')
plt.tight_layout()
plt.show()
```

### 3.2 Autocorrelation Analysis
```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(df['value'], lags=40, ax=axes[0])
plot_pacf(df['value'], lags=40, ax=axes[1])
plt.show()
```

### 3.3 Stationarity Testing
```python
from statsmodels.tsa.stattools import adfuller, kpss

# ADF test
adf_result = adfuller(df['value'])
print(f"ADF Statistic: {adf_result[0]:.4f}")
print(f"p-value: {adf_result[1]:.4f}")
print("Stationary" if adf_result[1] < 0.05 else "Non-stationary")

# KPSS test
kpss_result = kpss(df['value'])
print(f"\nKPSS Statistic: {kpss_result[0]:.4f}")
print(f"p-value: {kpss_result[1]:.4f}")
```

## Phase 4: Model Selection

### 4.1 Baseline Models
```python
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Naive forecast
naive_forecast = df['value'].shift(1)

# Seasonal naive (period=7 for weekly)
seasonal_naive = df['value'].shift(7)

# Moving average (window=7)
ma_forecast = df['value'].rolling(window=7).mean()

# Calculate metrics
def evaluate_forecast(actual, predicted, name):
    mae = mean_absolute_error(actual.dropna(), predicted.dropna())
    rmse = np.sqrt(mean_squared_error(actual.dropna(), predicted.dropna()))
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    print(f"{name}: MAE={mae:.2f}, RMSE={rmse:.2f}, MAPE={mape:.2f}%")
```

### 4.2 Advanced Models
```python
# ARIMA
from statsmodels.tsa.arima.model import ARIMA

model_arima = ARIMA(df['value'], order=(1, 1, 1))
results_arima = model_arima.fit()
print(results_arima.summary())

# Prophet
from prophet import Prophet

df_prophet = df.reset_index().rename(columns={'date': 'ds', 'value': 'y'})
model_prophet = Prophet yearly_seasonality=True)
model_prophet.fit(df_prophet)

# Future dataframe
future = model_prophet.make_future_dataframe(periods=30)
forecast_prophet = model_prophet.predict(future)

# XGBoost with lag features
def create_features(df):
    df = df.copy()
    df['lag_1'] = df['value'].shift(1)
    df['lag_7'] = df['value'].shift(7)
    df['rolling_mean_7'] = df['value'].rolling(7).mean()
    df['rolling_std_7'] = df['value'].rolling(7).std()
    df['dayofweek'] = df.index.dayofweek
    df['month'] = df.index.month
    return df.dropna()

df_features = create_features(df)
```

## Phase 5: Model Validation

### 5.1 Time Series Cross-Validation
```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

scores = []
for train_idx, test_idx in tscv.split(df):
    train = df.iloc[train_idx]
    test = df.iloc[test_idx]
    
    # Train model
    model = ARIMA(train['value'], order=(1, 1, 1))
    results = model.fit()
    
    # Predict
    predictions = results.forecast(steps=len(test))
    
    # Evaluate
    mae = mean_absolute_error(test['value'], predictions)
    scores.append(mae)

print(f"CV MAE: {np.mean(scores):.2f} ± {np.std(scores):.2f}")
```

### 5.2 Backtesting
```python
# Expanding window backtest
train_size = int(len(df) * 0.8)
train = df[:train_size]
test = df[train_size:]

model = ARIMA(train['value'], order=(1, 1, 1))
results = model.fit()

forecast = results.forecast(steps=len(test))

# Plot results
plt.figure(figsize=(12, 6))
plt.plot(train.index, train['value'], label='Train')
plt.plot(test.index, test['value'], label='Actual')
plt.plot(test.index, forecast, label='Forecast', linestyle='--')
plt.legend()
plt.title('Backtest Results')
plt.show()
```

## Phase 6: Uncertainty Quantification

### 6.1 Prediction Intervals
```python
# ARIMA prediction intervals
forecast = results.get_forecast(steps=30)
conf_int = forecast.conf_int(alpha=0.05)  # 95% PI

plt.figure(figsize=(12, 6))
plt.plot(df.index[-60:], df['value'][-60:], label='Historical')
plt.plot(forecast.index, forecast.predicted_mean, label='Forecast')
plt.fill_between(forecast.index, 
                 conf_int.iloc[:, 0], 
                 conf_int.iloc[:, 1], 
                 alpha=0.3, label='95% PI')
plt.legend()
plt.title('Forecast with Prediction Intervals')
plt.show()
```

### 6.2 Scenario Planning
```python
# Best/Base/Worst case scenarios
scenarios = {
    'optimistic': forecast * 1.1,  # +10%
    'base': forecast,
    'pessimistic': forecast * 0.9   # -10%
}

# Visualization
plt.figure(figsize=(12, 6))
for scenario, values in scenarios.items():
    plt.plot(forecast.index, values, label=scenario)
plt.fill_between(forecast.index, 
                 scenarios['pessimistic'], 
                 scenarios['optimistic'], 
                 alpha=0.2)
plt.legend()
plt.title('Scenario Analysis')
plt.show()
```

## Phase 7: Forecast Delivery

### 7.1 Forecast Report Template
```markdown
## Forecast Report

### Executive Summary
- **Forecast Period**: [Start] to [End]
- **Key Finding**: [Main insight]
- **Confidence Level**: [High/Medium/Low]
- **Business Impact**: [Dollar/time impact]

### Forecast Values
| Period | Point Forecast | 80% PI | 95% PI |
|--------|----------------|--------|--------|
| Month 1 | $X | $Y-$Z | $A-$B |
| Month 2 | $X | $Y-$Z | $A-$B |

### Scenario Analysis
| Scenario | Forecast | Assumptions |
|----------|----------|-------------|
| Optimistic | $X | [Assumptions] |
| Base | $X | [Assumptions] |
| Pessimistic | $X | [Assumptions] |

### Key Assumptions
1. [Assumption 1]
2. [Assumption 2]
3. [Assumption 3]

### Risk Factors
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
```

## Quality Checklist

- [ ] Data quality assessed and issues addressed
- [ ] Stationarity tested and handled
- [ ] Multiple models benchmarked
- [ ] Cross-validation performed
- [ ] Backtesting completed
- [ ] Prediction intervals provided
- [ ] Scenarios analyzed (best/base/worst)
- [ ] Key assumptions documented
- [ ] Risk factors identified
- [ ] Business recommendations provided
- [ ] Forecast accuracy metrics reported
- [ ] Limitations clearly stated