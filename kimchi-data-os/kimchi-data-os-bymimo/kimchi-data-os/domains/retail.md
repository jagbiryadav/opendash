# Retail Domain Pack

## Overview
Specialized knowledge, metrics, and workflows for retail analytics.

## Key Metrics

### Sales Performance
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Same-Store Sales Growth | (Current SSS - Prior SSS) / Prior SSS | 3-5% YoY | Organic growth |
| Sales per Square Foot | Revenue / Selling Area | $300-$800 | Space efficiency |
| Average Transaction Value | Revenue / Transactions | Varies | Basket optimization |
| Units per Transaction | Units Sold / Transactions | 2-4 | Cross-sell effectiveness |
| Sales Conversion Rate | Purchases / Foot Traffic | 20-40% | Store effectiveness |

### Inventory Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Inventory Turnover | COGS / Average Inventory | 4-8x/year | Stock efficiency |
| Weeks of Supply | Inventory / Average Weekly Sales | 4-8 weeks | Stock adequacy |
| Stockout Rate | Stockout Events / Total SKUs | <2% | Availability |
| Shrinkage Rate | (Inventory - Actual) / Inventory | <2% | Loss prevention |
| Sell-Through Rate | Units Sold / Units Received | 70-85% | Demand accuracy |

### Customer Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Customer Acquisition Cost | Marketing Spend / New Customers | $10-$50 | Acquisition efficiency |
| Customer Lifetime Value | AOV × Frequency × Lifespan | 3-5x CAC | Retention value |
| Repeat Purchase Rate | Repeat Buyers / Total Buyers | 30-40% | Loyalty |
| Net Promoter Score | % Promoters - % Detractors | >50 | Satisfaction |
| Customer Retention Rate | (End - New) / Start × 100 | 70-80% | Loyalty |

### Operational Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Gross Margin | (Revenue - COGS) / Revenue | 40-55% | Profitability |
| EBITDA Margin | EBITDA / Revenue | 8-15% | Operational efficiency |
| Labor Cost % | Labor Cost / Revenue | 10-20% | Staff efficiency |
| Occupancy Cost % | Rent + Utilities / Revenue | 8-15% | Space cost |
| Shrink Rate | Losses / Revenue | <2% | Loss prevention |

## Common Analysis Patterns

### Assortment Optimization
1. Analyze sales by SKU and category
2. Identify slow-movers and fast-movers
3. Optimize product mix by store cluster
4. Test new products with A/B testing
5. Measure cannibalization effects

### Price Optimization
1. Estimate price elasticity by product
2. Optimize price points for margin vs volume
3. Implement dynamic pricing rules
4. Monitor competitive pricing
5. Test promotional effectiveness

### Store Performance Analysis
1. Benchmark stores by format and location
2. Identify top and bottom performers
3. Analyze traffic patterns and conversion
4. Optimize staffing based on demand
5. Evaluate expansion opportunities

### Demand Forecasting
1. Incorporate promotions and events
2. Account for seasonality and trends
3. Forecast at SKU-store level
4. Generate confidence intervals
5. Optimize inventory allocation

## Retail-Specific Workflows

### Planogram Optimization
```python
# Analyze product placement effectiveness
def optimize_planogram(sales_data, shelf_data):
    """
    Optimize product placement based on:
    - Sales velocity
    - Margin contribution
    - Customer traffic patterns
    - Complementary product relationships
    """
    pass
```

### Promotional Effectiveness
```python
# Measure promotion ROI
def measure_promo_impact(promo_data, sales_data):
    """
    Calculate:
    - Incremental lift
    - Halo effect on other products
    - Margin impact
    - Customer acquisition effect
    """
    pass
```

### Assortment Planning
```python
# Optimize product assortment
def optimize_assortment(sales_data, constraints):
    """
    Optimize for:
    - Revenue maximization
    - Margin optimization
    - Space utilization
    - Customer satisfaction
    """
    pass
```

## Data Sources

### Internal Data
- POS transaction data
- Inventory management system
- Customer loyalty program
- E-commerce platform
- Store traffic sensors

### External Data
- Competitor pricing
- Weather data
- Economic indicators
- Social media sentiment
- Market research

## Common Challenges

1. **Data silos**: POS, inventory, and customer data in separate systems
2. **Real-time needs**: Decisions require current data
3. **High dimensionality**: Millions of SKU-store combinations
4. **Seasonality**: Complex seasonal patterns
5. **Promotion complexity**: Multiple concurrent promotions

## Recommended Tools

- **Python**: pandas, scikit-learn, Prophet
- **BI**: Tableau, Power BI, Looker
- **Specialized**: Blue Yonder, Manthan, Revionics
- **Programming**: SQL, Python, R
