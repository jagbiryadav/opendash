# Forecasting Ecosystem

## Overview
Complete forecasting subsystem with scenario planning, simulation, uncertainty quantification, and optimization.

## 1. Scenario Planning

### Scenario Types
| Scenario | Description | Use Case |
|----------|-------------|----------|
| Baseline | Current conditions continue | Standard planning |
| Optimistic | Best realistic outcome | Growth targets |
| Pessimistic | Worst realistic outcome | Risk assessment |
| Stress Test | Extreme conditions | Resilience planning |
| What-If | Specific variable changes | Decision support |

### Scenario Generation
```python
def generate_scenarios(base_forecast, assumptions):
    """
    Generate forecast scenarios based on assumptions.
    
    Args:
        base_forecast: Base case forecast
        assumptions: Dictionary of assumption variations
    
    Returns:
        Dictionary of scenario forecasts
    """
    scenarios = {}
    
    for scenario_name, assumption_variations in assumptions.items():
        scenario_forecast = base_forecast.copy()
        for variable, change in assumption_variations.items():
            scenario_forecast = apply_assumption(scenario_forecast, variable, change)
        scenarios[scenario_name] = scenario_forecast
    
    return scenarios
```

### Scenario Analysis
```python
def analyze_scenarios(scenarios, business_metrics):
    """
    Analyze scenario impacts on business metrics.
    
    Returns:
        DataFrame with scenario impacts
    """
    results = []
    for scenario_name, forecast in scenarios.items():
        for metric_name, metric_func in business_metrics.items():
            value = metric_func(forecast)
            results.append({
                'scenario': scenario_name,
                'metric': metric_name,
                'value': value
            })
    return pd.DataFrame(results)
```

## 2. Simulation

### Monte Carlo Simulation
```python
def monte_carlo_forecast(historical_data, n_simulations=10000, horizon=30):
    """
    Generate forecast using Monte Carlo simulation.
    
    Args:
        historical_data: Historical time series
        n_simulations: Number of simulations
        horizon: Forecast horizon
    
    Returns:
        Simulated paths and statistics
    """
    # Fit distribution to historical data
    fitted_dist = fit_distribution(historical_data)
    
    # Generate simulations
    simulations = np.zeros((n_simulations, horizon))
    for i in range(n_simulations):
        simulations[i] = generate_path(fitted_dist, horizon)
    
    return {
        'simulations': simulations,
        'mean': np.mean(simulations, axis=0),
        'median': np.median(simulations, axis=0),
        'std': np.std(simulations, axis=0),
        'percentiles': {
            '5': np.percentile(simulations, 5, axis=0),
            '25': np.percentile(simulations, 25, axis=0),
            '75': np.percentile(simulations, 75, axis=0),
            '95': np.percentile(simulations, 95, axis=0)
        }
    }
```

### Bootstrap Simulation
```python
def bootstrap_forecast(residuals, base_forecast, n_bootstrap=1000):
    """
    Generate forecast intervals using bootstrap.
    
    Args:
        residuals: Model residuals
        base_forecast: Point forecast
        n_bootstrap: Number of bootstrap samples
    
    Returns:
        Bootstrap forecast intervals
    """
    bootstrap_forecasts = np.zeros((n_bootstrap, len(base_forecast)))
    
    for i in range(n_bootstrap):
        bootstrap_residuals = np.random.choice(residuals, size=len(base_forecast), replace=True)
        bootstrap_forecasts[i] = base_forecast + bootstrap_residuals
    
    return {
        'mean': np.mean(bootstrap_forecasts, axis=0),
        'lower_80': np.percentile(bootstrap_forecasts, 10, axis=0),
        'upper_80': np.percentile(bootstrap_forecasts, 90, axis=0),
        'lower_95': np.percentile(bootstrap_forecasts, 2.5, axis=0),
        'upper_95': np.percentile(bootstrap_forecasts, 97.5, axis=0)
    }
```

### Regime-Switching Simulation
```python
def regime_switching_forecast(data, regime_model, n_simulations=1000):
    """
    Simulate forecast with regime changes.
    
    Args:
        data: Historical data
        regime_model: Regime detection model
        n_simulations: Number of simulations
    
    Returns:
        Regime-aware forecast simulations
    """
    # Detect regimes
    regimes = regime_model.predict(data)
    
    # Fit regime-specific models
    regime_models = fit_regime_models(data, regimes)
    
    # Simulate with regime transitions
    simulations = simulate_regime_paths(regime_models, regime_model.transition_matrix, n_simulations)
    
    return simulations
```

## 3. Uncertainty Quantification

### Prediction Intervals
```python
def calculate_prediction_intervals(model, X, alpha=0.05):
    """
    Calculate prediction intervals for forecasts.
    
    Args:
        model: Trained model
        X: Features
        alpha: Significance level
    
    Returns:
        Prediction intervals
    """
    predictions = model.predict(X)
    
    # Analytical intervals (if available)
    if hasattr(model, 'get_prediction'):
        pred = model.get_prediction(X)
        intervals = pred.conf_int(alpha=alpha)
        return intervals
    
    # Bootstrap intervals
    return bootstrap_prediction_intervals(model, X, alpha)
```

### Conformal Prediction
```python
def conformal_prediction(model, X_cal, y_cal, X_test, alpha=0.1):
    """
    Generate distribution-free prediction intervals.
    
    Args:
        model: Trained model
        X_cal, y_cal: Calibration data
        X_test: Test data
        alpha: Miscoverage level
    
    Returns:
        Prediction sets with coverage guarantee
    """
    # Get calibration residuals
    y_cal_pred = model.predict(X_cal)
    residuals = np.abs(y_cal - y_cal_pred)
    
    # Calculate quantile
    quantile = np.ceil((1 - alpha) * (len(residuals) + 1)) / len(residuals)
    threshold = np.quantile(residuals, quantile)
    
    # Generate prediction sets
    y_test_pred = model.predict(X_test)
    lower = y_test_pred - threshold
    upper = y_test_pred + threshold
    
    return lower, upper
```

### Bayesian Prediction Intervals
```python
def bayesian_prediction_intervals(posterior_samples, alpha=0.05):
    """
    Calculate Bayesian credible intervals.
    
    Args:
        posterior_samples: Samples from posterior distribution
        alpha: Significance level
    
    Returns:
        Credible intervals
    """
    lower = np.percentile(posterior_samples, alpha/2 * 100, axis=0)
    upper = np.percentile(posterior_samples, (1 - alpha/2) * 100, axis=0)
    
    return lower, upper
```

## 4. Forecast Optimization

### Inventory Optimization
```python
def optimize_inventory(demand_forecast, holding_cost, stockout_cost, lead_time):
    """
    Optimize inventory levels based on forecast.
    
    Args:
        demand_forecast: Demand forecast with uncertainty
        holding_cost: Cost per unit per period
        stockout_cost: Cost per unit of unmet demand
        lead_time: Supplier lead time
    
    Returns:
        Optimal inventory policy
    """
    # Calculate safety stock
    demand_std = demand_forecast['std']
    service_level = calculate_service_level(holding_cost, stockout_cost)
    safety_stock = norm.ppf(service_level) * demand_std * np.sqrt(lead_time)
    
    # Calculate reorder point
    avg_demand = demand_forecast['mean']
    reorder_point = avg_demand * lead_time + safety_stock
    
    # Calculate order quantity
    order_quantity = calculate_eoq(demand_forecast['mean'], holding_cost)
    
    return {
        'safety_stock': safety_stock,
        'reorder_point': reorder_point,
        'order_quantity': order_quantity
    }
```

### Pricing Optimization
```python
def optimize_pricing(demand_model, price_range, constraints):
    """
    Optimize pricing based on demand forecast.
    
    Args:
        demand_model: Price-demand model
        price_range: Range of prices to consider
        constraints: Business constraints
    
    Returns:
        Optimal price and expected revenue
    """
    prices = np.linspace(price_range[0], price_range[1], 100)
    revenues = []
    
    for price in prices:
        demand = demand_model.predict(price)
        revenue = price * demand
        
        # Apply constraints
        if constraints and not check_constraints(price, demand, constraints):
            revenue = 0
        
        revenues.append(revenue)
    
    optimal_idx = np.argmax(revenues)
    return {
        'optimal_price': prices[optimal_idx],
        'expected_revenue': revenues[optimal_idx],
        'expected_demand': demand_model.predict(prices[optimal_idx])
    }
```

### Resource Allocation Optimization
```python
def optimize_resource_allocation(forecast, resources, objective='maximize_revenue'):
    """
    Optimize resource allocation based on forecast.
    
    Args:
        forecast: Demand forecast
        resources: Available resources
        objective: Optimization objective
    
    Returns:
        Optimal allocation
    """
    from scipy.optimize import linprog
    
    # Set up optimization problem
    c = get_objective_coefficients(forecast, objective)
    A_ub, b_ub = get_constraints(resources)
    A_eq, b_eq = get_equality_constraints(forecast)
    
    # Solve
    result = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, method='highs')
    
    return {
        'allocation': result.x,
        'objective_value': -result.fun,  # Negate because linprog minimizes
        'success': result.success
    }
```

## 5. Forecast Evaluation

### Backtesting Framework
```python
def backtest_forecast(model, data, horizon, step_size=1):
    """
    Comprehensive backtesting framework.
    
    Args:
        model: Forecast model
        data: Historical data
        horizon: Forecast horizon
        step_size: Steps between forecasts
    
    Returns:
        Backtest results
    """
    actuals = []
    predictions = []
    
    for i in range(0, len(data) - horizon, step_size):
        train = data[:i+horizon]
        test = data[i+horizon:i+horizon+horizon]
        
        model.fit(train)
        forecast = model.predict(horizon)
        
        actuals.extend(test)
        predictions.extend(forecast)
    
    return calculate_metrics(actuals, predictions)
```

### Forecast Combination
```python
def combine_forecasts(forecasts, weights=None):
    """
    Combine multiple forecasts.
    
    Args:
        forecasts: Dictionary of forecasts
        weights: Optional weights
    
    Returns:
        Combined forecast
    """
    if weights is None:
        # Equal weights
        weights = {k: 1/len(forecasts) for k in forecasts.keys()}
    
    combined = np.zeros_like(list(forecasts.values())[0])
    for name, forecast in forecasts.items():
        combined += weights[name] * forecast
    
    return combined
```

### Model Selection
```python
def select_forecast_model(models, data, metric='mape'):
    """
    Select best forecast model.
    
    Args:
        models: Dictionary of models
        data: Historical data
        metric: Evaluation metric
    
    Returns:
        Best model and performance
    """
    results = {}
    for name, model in models.items():
        cv_scores = cross_validate_forecast(model, data, metric=metric)
        results[name] = cv_scores
    
    best_model = min(results, key=lambda x: np.mean(results[x]))
    return best_model, results[best_model]
```

## 6. Real-time Forecasting

### Streaming Forecast Update
```python
def update_forecast_streaming(model, new_data, forecast_state):
    """
    Update forecast with new data points.
    
    Args:
        model: Forecast model
        new_data: New observation
        forecast_state: Current forecast state
    
    Returns:
        Updated forecast
    """
    # Update model incrementally
    model.partial_fit(new_data)
    
    # Generate new forecast
    new_forecast = model.predict(forecast_state['horizon'])
    
    # Update confidence intervals
    updated_intervals = update_intervals(forecast_state['intervals'], new_data)
    
    return {
        'forecast': new_forecast,
        'intervals': updated_intervals,
        'timestamp': datetime.now()
    }
```

### Anomaly Detection in Forecasts
```python
def detect_forecast_anomalies(actual, forecast, threshold=2):
    """
    Detect anomalies in forecast vs actual.
    
    Args:
        actual: Actual values
        forecast: Forecasted values
        threshold: Standard deviation threshold
    
    Returns:
        Anomaly flags and scores
    """
    residuals = actual - forecast
    z_scores = (residuals - np.mean(residuals)) / np.std(residuals)
    
    anomalies = np.abs(z_scores) > threshold
    
    return {
        'anomalies': anomalies,
        'z_scores': z_scores,
        'residuals': residuals
    }
```

## 7. Visualization

### Forecast Visualization
```python
def plot_forecast(historical, forecast, intervals=None, scenarios=None):
    """
    Create comprehensive forecast visualization.
    
    Args:
        historical: Historical data
        forecast: Forecast values
        intervals: Prediction intervals
        scenarios: Scenario forecasts
    """
    plt.figure(figsize=(12, 6))
    
    # Historical
    plt.plot(historical.index, historical.values, label='Historical', color='black')
    
    # Forecast
    plt.plot(forecast.index, forecast.values, label='Forecast', color='blue')
    
    # Intervals
    if intervals:
        plt.fill_between(forecast.index, intervals['lower'], intervals['upper'], 
                        alpha=0.3, label='80% PI')
    
    # Scenarios
    if scenarios:
        for name, scenario in scenarios.items():
            plt.plot(forecast.index, scenario, label=name, linestyle='--')
    
    plt.legend()
    plt.title('Forecast with Scenarios')
    plt.xlabel('Date')
    plt.ylabel('Value')
    plt.grid(True, alpha=0.3)
    
    return plt
```

## 8. Forecasting Laboratory

### Experiment Design
```python
def design_forecasting_experiment(data, models, metrics, horizon):
    """
    Design forecasting experiment.
    
    Returns:
        Experiment specification
    """
    return {
        'data': {
            'train_size': len(data) - horizon,
            'test_size': horizon,
            'features': list(data.columns)
        },
        'models': models,
        'metrics': metrics,
        'evaluation': {
            'method': 'time_series_cv',
            'n_splits': 5,
            'horizon': horizon
        }
    }
```

### Model Benchmarking
```python
def benchmark_models(models, data, horizons=[7, 14, 30]):
    """
    Benchmark models across multiple horizons.
    
    Returns:
        Benchmark results
    """
    results = {}
    for horizon in horizons:
        for name, model in models.items():
            scores = evaluate_forecast(model, data, horizon)
            results[f"{name}_{horizon}"] = scores
    
    return pd.DataFrame(results).T
```

### Uncertainty Calibration
```python
def calibrate_intervals(forecasts, actuals, target_coverage=0.8):
    """
    Calibrate prediction intervals.
    
    Args:
        forecasts: Forecast distributions
        actuals: Actual values
        target_coverage: Target coverage level
    
    Returns:
        Calibration factor
    """
    coverage = calculate_coverage(forecasts, actuals)
    
    # Adjust intervals to achieve target coverage
    calibration_factor = target_coverage / coverage
    
    return calibration_factor
```

## 9. Best Practices

### Forecasting Principles
1. **Start simple**: Use baseline models first
2. **Validate rigorously**: Use proper time series CV
3. **Quantify uncertainty**: Always provide intervals
4. **Monitor continuously**: Track forecast accuracy
5. **Update regularly**: Refresh models with new data

### Common Pitfalls
1. **Overfitting**: Too complex models
2. **Look-ahead bias**: Using future information
3. **Ignoring seasonality**: Missing periodic patterns
4. **Extrapolation risk**: Forecasting too far ahead
5. **Point forecast obsession**: Ignoring uncertainty

### Model Selection Criteria
1. **Accuracy**: How well does it predict?
2. **Interpretability**: Can we understand why?
3. **Robustness**: Does it work across conditions?
4. **Computational cost**: Is it feasible to run?
5. **Maintenance**: How easy is it to maintain?