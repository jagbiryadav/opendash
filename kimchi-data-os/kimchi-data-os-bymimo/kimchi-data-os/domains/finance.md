# Finance Domain Pack

## Overview
Specialized knowledge, metrics, and workflows for financial analytics.

## Key Metrics

### Profitability Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Gross Margin | (Revenue - COGS) / Revenue | 40-60% | Product profitability |
| Operating Margin | Operating Income / Revenue | 15-25% | Operational efficiency |
| Net Profit Margin | Net Income / Revenue | 10-20% | Overall profitability |
| EBITDA Margin | EBITDA / Revenue | 15-30% | Cash flow profitability |
| Return on Equity | Net Income / Shareholder Equity | >15% | Shareholder return |
| Return on Assets | Net Income / Total Assets | >5% | Asset utilization |

### Liquidity Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Current Ratio | Current Assets / Current Liabilities | 1.5-2.0 | Short-term solvency |
| Quick Ratio | (Current Assets - Inventory) / Current Liabilities | >1.0 | Immediate solvency |
| Cash Ratio | Cash / Current Liabilities | >0.5 | Most conservative |
| Working Capital | Current Assets - Current Liabilities | Positive | Operational liquidity |
| Cash Conversion Cycle | DSO + DIO - DPO | <45 days | Cash efficiency |

### Efficiency Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Accounts Receivable Turnover | Revenue / Average AR | >8x | Collection efficiency |
| Days Sales Outstanding | (AR / Revenue) × Days | <30 days | Collection speed |
| Inventory Turnover | COGS / Average Inventory | 6-8x | Inventory efficiency |
| Days Inventory Outstanding | (Inventory / COGS) × Days | <45 days | Inventory speed |
| Accounts Payable Turnover | COGS / Average AP | 6-10x | Payment efficiency |

### Leverage Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Debt-to-Equity | Total Debt / Total Equity | <1.0 | Financial leverage |
| Debt-to-Assets | Total Debt / Total Assets | <0.5 | Asset financing |
| Interest Coverage | EBIT / Interest Expense | >3.0 | Debt service ability |
| Equity Multiplier | Total Assets / Total Equity | <2.0 | Leverage level |

### Valuation Metrics
| Metric | Formula | Benchmark | Purpose |
|--------|---------|-----------|---------|
| Price-to-Earnings | Stock Price / EPS | 15-25x | Market valuation |
| Price-to-Sales | Market Cap / Revenue | 1-5x | Revenue valuation |
| Price-to-Book | Market Cap / Book Value | 1-3x | Asset valuation |
| EV/EBITDA | Enterprise Value / EBITDA | 10-15x | Comprehensive valuation |
| PEG Ratio | PE / Growth Rate | <1.0 | Growth-adjusted |

## Common Analysis Patterns

### Financial Statement Analysis
1. Horizontal analysis (trend over time)
2. Vertical analysis (common-size statements)
3. Ratio analysis (key ratios)
4. DuPont analysis (ROE decomposition)
5. Cash flow analysis

### Credit Risk Analysis
1. Altman Z-Score calculation
2. Probability of default modeling
3. Loss given default estimation
4. Exposure at default
5. Expected credit loss

### Portfolio Analysis
1. Risk-return optimization
2. Sharpe ratio calculation
3. Beta and alpha analysis
4. Diversification assessment
5. Performance attribution

### Budgeting and Forecasting
1. Revenue forecasting
2. Cost structure modeling
3. Cash flow projection
4. Sensitivity analysis
5. Variance analysis

## Finance-Specific Workflows

### Valuation Model
```python
# Discounted Cash Flow valuation
def dcf_valuation(fcf_projections, wacc, terminal_growth):
    """
    Calculate enterprise value using DCF:
    1. Project free cash flows
    2. Calculate terminal value
    3. Discount to present value
    4. Subtract net debt
    """
    pass
```

### Credit Scoring
```python
# Build credit scoring model
def build_credit_score(loan_data, default_labels):
    """
    Develop credit scoring model:
    1. Feature engineering
    2. Model selection
    3. Scorecard development
    4. Validation and calibration
    """
    pass
```

### Financial Planning
```python
# Three-statement model
def financial_forecast(historical_statements, assumptions):
    """
    Generate financial forecasts:
    1. Revenue projection
    2. Cost modeling
    3. Balance sheet projection
    4. Cash flow forecasting
    """
    pass
```

## Data Sources

### Internal Data
- General ledger
- Accounts receivable/payable
- Budget data
- Payroll data
- Tax data

### External Data
- Market data (stock prices, interest rates)
- Economic indicators (GDP, inflation, unemployment)
- Industry benchmarks
- Credit ratings
- Regulatory filings

## Common Challenges

1. **Data quality**: Inconsistent chart of accounts
2. **Regulatory compliance**: SOX, GAAP, IFRS requirements
3. **Model risk**: Valuation model assumptions
4. **Market volatility**: Changing economic conditions
5. **Disclosure requirements**: Transparency and reporting

## Regulatory Frameworks

- **SOX**: Sarbanes-Oxley compliance
- **GAAP**: Generally Accepted Accounting Principles
- **IFRS**: International Financial Reporting Standards
- **Basel III**: Banking capital requirements
- **Dodd-Frank**: Financial reform

## Recommended Tools

- **Python**: pandas, numpy, scipy, statsmodels
- **BI**: Bloomberg, FactSet, Refinitiv
- **Specialized**: SAP, Oracle Financials, Workiva
- **Programming**: SQL, Python, VBA
- **Modeling**: Excel, Python, R
