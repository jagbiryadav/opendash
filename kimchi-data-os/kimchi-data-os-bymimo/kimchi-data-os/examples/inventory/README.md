# Inventory Optimization Example

## Overview
Complete example of optimizing inventory levels using demand forecasting and optimization models.

## Business Context
- **Company**: Retail manufacturer
- **Problem**: $5M in excess inventory, 15% stockout rate
- **Goal**: Balance inventory levels to minimize costs while meeting demand

## Data Sources
- Sales history (3 years, daily)
- Product catalog (10K SKUs)
- Supplier lead times
- Storage costs
- Stockout costs

## Analysis Steps

### 1. Problem Framing
- Define objectives: Minimize total cost (holding + stockout)
- Stakeholder: VP of Supply Chain, CFO
- Timeline: 3 weeks

### 2. Demand Forecasting
- **Method**: Prophet + XGBoost ensemble
- **Accuracy**: MAPE = 12% (target <15%)
- **Horizon**: 12 weeks rolling forecast

### 3. Safety Stock Calculation
- **Service level target**: 95% for A items, 90% for B items, 85% for C items
- **Lead time variability**: Incorporated into safety stock
- **Demand variability**: Seasonal patterns included

### 4. Reorder Point Optimization
- **Formula**: Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock
- **Dynamic adjustment**: Based on forecast confidence intervals

### 5. ABC-XYZ Classification
- **ABC**: By revenue contribution (A=80%, B=15%, C=5%)
- **XYZ**: By demand variability (X=stable, Y=seasonal, Z=erratic)
- **Strategy**: Different stocking policies per segment

## Key Findings
1. 20% of SKUs (A-items) drive 80% of revenue
2. Seasonal items (Y-class) need 30% higher safety stock in Q4
3. Supplier lead time variability is the biggest risk factor

## Business Impact
- **Inventory reduction**: 25% decrease in excess inventory
- **Stockout reduction**: From 15% to 5%
- **Cost savings**: $1.5M annually
- **Working capital**: Freed up $2M

## Files
- `data/` - Sales and inventory data
- `notebooks/` - Forecasting notebooks
- `models/` - Forecast models
- `optimization/` - Inventory optimization scripts
- `reports/` - Inventory analysis reports