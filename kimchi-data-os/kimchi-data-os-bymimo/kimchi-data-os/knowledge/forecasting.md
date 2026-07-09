# Forecasting Methods Reference

## Time Series Components

### Decomposition
- **Trend (T)**: Long-term direction (upward, downward, flat)
- **Seasonality (S)**: Regular periodic patterns (daily, weekly, monthly, yearly)
- **Cyclic (C)**: Longer-term fluctuations (business cycles, 2-10 years)
- **Residual (R)**: Random noise after removing T, S, C

### Models
- **Additive**: Y = T + S + C + R (seasonal magnitude constant)
- **Multiplicative**: Y = T × S × C × R (seasonal magnitude scales with level)
- **Mixed**: Combination of additive and multiplicative

## Stationarity

### Definition
A process is stationary if its statistical properties (mean, variance, autocorrelation) are constant over time.

### Tests
1. **Augmented Dickey-Fuller (ADF)**: H₀ = unit root (non-stationary)
2. **Kwiatkowski-Phillips-Schmidt-Shin (KPSS)**: H₀ = stationary
3. **Philipps-Perron (PP)**: Non-parametric version of ADF

### Making Series Stationary
1. **Differencing**: Y'ₜ = Yₜ - Yₜ₋₁ (first order)
2. **Log transformation**: Stabilizes variance
3. **Box-Cox transformation**: Y(λ) = (Y^λ - 1)/λ if λ≠0, log(Y) if λ=0
4. **Seasonal differencing**: Y'ₜ = Yₜ - Yₜ₋ₛ (s = seasonal period)

## Autocorrelation

### ACF (Autocorrelation Function)
- Correlation between Yₜ and Yₜ₋ₖ for all lags k
- Shows direct and indirect relationships
- Cuts off after q lags → MA(q) process

### PACF (Partial Autocorrelation Function)
- Correlation between Yₜ and Yₜ₋ₖ after removing intermediate effects
- Shows direct relationships only
- Cuts off after p lags → AR(p) process

### Interpretation
- **AR(p)**: PACF cuts off at lag p, ACF decays exponentially
- **MA(q)**: ACF cuts off at lag q, PACF decays exponentially
- **ARMA(p,q)**: Both ACF and PACF decay exponentially

## Classical Methods

### Naive Methods
1. **Naive**: Ŷₜ₊₁ = Yₜ (last value)
2. **Seasonal Naive**: Ŷₜ₊₁ = Yₜ₋ₛ₊₁ (same season last period)
3. **Drift method**: Ŷₜ₊₁ = Yₜ + (Yₜ - Y₁)/(n-1) × h
4. **Average method**: Ŷₜ₊₁ = Ȳ (mean of all observations)

### Exponential Smoothing

#### Simple Exponential Smoothing (SES)
- For data with no trend or seasonality
- Ŷₜ₊₁ = αYₜ + (1-α)Ŷₜ
- α ∈ [0,1]: smoothing parameter
- Higher α = more weight on recent observations

#### Holt's Linear Trend
- For data with trend but no seasonality
- Level: ℓₜ = αYₜ + (1-α)(ℓₜ₋₁ + bₜ₋₁)
- Trend: bₜ = β(ℓₜ - ℓₜ₋₁) + (1-β)bₜ₋₁
- Forecast: Ŷₜ₊ₕ = ℓₜ + h × bₜ

#### Holt-Winters Seasonal
- For data with trend AND seasonality
- Additive: Ŷₜ₊ₕ = ℓₜ + h×bₜ + sₜ₊ₕ₋ₛ
- Multiplicative: Ŷₜ₊ₕ = (ℓₜ + h×bₜ) × sₜ₊ₕ₋ₛ
- s = seasonal component, s = seasonal period

### ARIMA (AutoRegressive Integrated Moving Average)

#### ARIMA(p,d,q)
- p: AR order (from PACF)
- d: degree of differencing (to achieve stationarity)
- q: MA order (from ACF)

#### Seasonal ARIMA: ARIMA(p,d,q)(P,D,Q)s
- P: seasonal AR order
- D: seasonal differencing
- Q: seasonal MA order
- s: seasonal period

#### Auto-ARIMA
- Automatically selects p,d,q and P,D,Q
- Criteria: AIC, BIC, AICc
- Stepwise search or exhaustive search

## Modern Methods

### Prophet (Facebook/Meta)
- Additive model: Y = g(t) + s(t) + h(t) + εₜ
  - g(t): trend function (linear or logistic)
  - s(t): seasonal components (Fourier series)
  - h(t): holiday effects
- Robust to missing data and outliers
- Automatic changepoint detection

### TBATS
- Trigonometric seasonality
- Box-Cox transformation
- ARMA errors
- Trend
- Seasonal components
- Handles multiple seasonal periods

### ETS (Error, Trend, Seasonal)
- State-space framework
- Automatic model selection
- Damped trend option
- Additive or multiplicative errors/trend/seasonal

### Machine Learning Approaches

#### XGBoost/LightGBM for Time Series
- Feature engineering: lags, rolling statistics, calendar features
- Handles non-linear relationships
- Requires careful validation (temporal split)

#### Random Forest for Time Series
- Ensemble of decision trees
- Feature importance
- Less prone to overfitting than single trees

#### LSTM (Long Short-Term Memory)
- Deep learning for sequence data
- Captures long-term dependencies
- Requires large datasets
- Complex hyperparameter tuning

#### Temporal Fusion Transformer (TFT)
- Attention-based architecture
- Handles multiple inputs (static, known future, observed past)
- Interpretable attention weights
- State-of-the-art for many benchmarks

### N-BEATS
- Neural basis expansion
- Interpretable by design
- Trend and seasonality components
- No feature engineering needed

## Uncertainty Quantification

### Prediction Intervals
- **Point forecast**: Single best estimate
- **Prediction interval**: Range likely to contain future value
- **Confidence interval**: Range likely to contain true mean

### Methods
1. **Analytical**: Based on model assumptions (ARIMA, ETS)
2. **Bootstrap**: Resample residuals
3. **Quantile regression**: Direct estimation of quantiles
4. **Conformal prediction**: Distribution-free coverage guarantees
5. **Monte Carlo simulation**: Simulate future paths

### Coverage
- 80% PI: Contains true value 80% of time
- 95% PI: Contains true value 95% of time
- Calibration: Actual coverage should match nominal coverage

## Backtesting

### Time Series Cross-Validation
1. **Expanding window**: Train on all past, test on next period
2. **Sliding window**: Train on fixed window, test on next period
3. **Origin-based**: Fixed origin, varying forecast horizon

### Error Metrics

#### Scale-Dependent
- **MAE**: Mean Absolute Error = Σ|Yₜ - Ŷₜ|/n
- **RMSE**: Root Mean Squared Error = √(Σ(Yₜ - Ŷₜ)²/n)
- **MPE**: Mean Percentage Error = Σ(Yₜ - Ŷₜ)/Yₜ/n

#### Scale-Independent
- **MAPE**: Mean Absolute Percentage Error = Σ|Yₜ - Ŷₜ|/|Yₜ|/n
  - Problem: Undefined when Yₜ = 0, biased for low values
- **sMAPE**: Symmetric MAPE = Σ|Yₜ - Ŷₜ|/(|Yₜ|+|Ŷₜ|)/2/n
- **MASE**: Mean Absolute Scaled Error = MAE / MAE_naive
  - Comparison to naive forecast

#### Directional
- **DA**: Direction Accuracy = % correct direction changes
- **CUSUM**: Cumulative sum of errors

### Model Selection
- Compare multiple models on same test set
- Statistical significance of differences (Diebold-Mariano test)
- Consider: accuracy, interpretability, complexity, maintenance

## Scenario Planning

### What-If Analysis
1. **Baseline scenario**: Current conditions continue
2. **Optimistic scenario**: Best realistic outcome
3. **Pessimistic scenario**: Worst realistic outcome
4. **Custom scenarios**: Based on specific assumptions

### Sensitivity Analysis
- Vary one input at a time
- Tornado diagrams: Show which inputs have largest impact
- Monte Carlo: Vary all inputs simultaneously

### Demand Planning
- Forecast demand by product/SKU/location
- Incorporate promotions, events, competitor actions
- Safety stock = Z × σ_LT × √LT (Z = service level, σ_LT = lead time demand std, LT = lead time)

## Forecasting Laboratory

### Forecast Confidence
- **High confidence**: Multiple models agree, stable pattern, large sample
- **Medium confidence**: Models somewhat agree, some uncertainty
- **Low confidence**: Models disagree, volatile pattern, limited data

### Scenario Planning
- **Best case**: 70th percentile forecast
- **Base case**: 50th percentile (median) forecast
- **Worst case**: 30th percentile forecast

### What-If Scenarios
- Price change impact
- Marketing spend optimization
- Capacity planning
- Budget allocation

### Demand Planning
- Short-term (1-4 weeks): Operational decisions
- Medium-term (1-6 months): Tactical planning
- Long-term (6+ months): Strategic decisions

### Supply Planning
- Raw material requirements
- Production scheduling
- Inventory optimization
- Lead time considerations

### Pricing Optimization
- Price elasticity estimation
- Demand response to price changes
- Optimal pricing under constraints

### Budget Forecasting
- Revenue projections
- Cost forecasting
- Cash flow planning
- Variance analysis

### Capacity Planning
- Resource utilization forecasting
- Bottleneck identification
- Investment timing
- Scalability assessment

### Revenue Forecasting
- Product-level revenue
- Channel-level revenue
- Geographic revenue
- Customer segment revenue

### Profit Forecasting
- Margin analysis
- Cost structure modeling
- Break-even analysis
- Profitability optimization

## Common Pitfalls

1. **Look-ahead bias**: Using future information in features
2. **Data leakage**: Target information in training features
3. **Overfitting**: Model captures noise, not signal
4. **Underfitting**: Model too simple
5. **Ignoring seasonality**: Missing periodic patterns
6. **Extrapolation risk**: Forecasts far beyond historical range
7. **Point forecast obsession**: Ignoring uncertainty
8. **Model monotony**: Using only one method
9. **Ignoring external factors**: Competitors, economy, regulations
10. **Recency bias**: Overweighting recent observations