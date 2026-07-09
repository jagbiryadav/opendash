# Forecasting Example

## Overview
Complete example of building a demand forecasting system with uncertainty quantification and scenario planning.

## Business Context
- **Company**: Consumer goods manufacturer
- **Problem**: Forecast accuracy only 60%, leading to $3M in excess inventory
- **Goal**: Improve forecast accuracy to 85% and reduce inventory costs

## Data Sources
- Sales history (5 years, daily)
- Promotions calendar
- External data (weather, holidays, economic indicators)
- Product attributes
- Competitor pricing

## Analysis Steps

### 1. Problem Framing
- Define objectives: Reduce MAPE from 40% to <15%
- Stakeholder: VP of Supply Chain, CFO
- Timeline: 4 weeks

### 2. Time Series Analysis
- **Trend**: 5% annual growth
- **Seasonality**: Strong weekly and yearly patterns
- **Events**: Promotions cause 3x demand spikes
- **External factors**: Weather correlates with 15% of variance

### 3. Model Selection
- **Baseline**: Seasonal Naive (MAPE = 35%)
- **Prophet**: MAPE = 18% (captures seasonality)
- **XGBoost with features**: MAPE = 14% (best performer)
- **Ensemble**: Weighted average (MAPE = 12%)

### 4. Uncertainty Quantification
- **Prediction intervals**: 80% and 95% PI
- **Calibration**: 80% PI covers 82% of actuals
- **Scenario planning**: Best/Base/Worst cases

### 5. Implementation
- **Retraining**: Weekly with new data
- **Monitoring**: Drift detection, accuracy tracking
- **Integration**: ERP system API

## Key Findings
1. Promotions are the single biggest driver of forecast error
2. Weather data improves accuracy by 3% for seasonal products
3. SKU-level forecasts less accurate than category-level (hierarchy helps)

## Business Impact
- **Forecast accuracy**: Improved from 60% to 88%
- **Inventory reduction**: 30% decrease in excess inventory
- **Stockout reduction**: From 12% to 4%
- **Cost savings**: $2M annually
- **Working capital**: Freed up $5M

## Files
- `data/` - Sales and external data
- `notebooks/` - Forecasting notebooks
- `models/` - Trained forecast models
- `api/` - Forecast API
- `monitoring/` - Drift detection scripts
- `reports/` - Forecast analysis reports