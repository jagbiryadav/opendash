# Standard Contract Template

Use this template for all agents, engines, and workflows.

---

## Agent/Engine/Workflow: [NAME]

### Purpose
- **What**: [One sentence describing what this component does]
- **When to use**: [List of scenarios]
- **When NOT to use**: [Anti-patterns]

### Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| [input_1] | [type] | Yes/No | [description] |
| [input_2] | [type] | Yes/No | [description] |

### Outputs
| Name | Type | Description |
|------|------|-------------|
| [output_1] | [type] | [description] |
| [output_2] | [type] | [description] |

### Dependencies
- **Knowledge**: [List knowledge files used]
- **Agents**: [List other agents required]
- **Packages**: [List Python packages required]

### Failure Modes
| Condition | Handling | Escalation |
|-----------|----------|------------|
| [error_1] | [how to handle] | [user/log/warn/abort] |
| [error_2] | [how to handle] | [user/log/warn/abort] |

### Quality Gates
| Check | Description | Threshold | On Fail |
|-------|-------------|-----------|---------|
| [check_1] | [what to verify] | [value] | [abort/warn/continue] |
| [check_2] | [what to verify] | [value] | [abort/warn/continue] |

### Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

### Examples
**Input**: [Example input]
**Output**: [Example output]

---

## Example: Forecast Engineer Contract

### Purpose
- **What**: Generate accurate forecasts with uncertainty quantification and scenario analysis
- **When to use**: Time series prediction, demand forecasting, revenue projection
- **When NOT to use**: Categorical prediction, cross-sectional analysis

### Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| time_series_data | DataFrame | Yes | Historical time series with date and value columns |
| date_column | string | Yes | Name of date column |
| value_column | string | Yes | Name of value column to forecast |
| forecast_horizon | integer | Yes | Number of periods to forecast |
| confidence_level | float | No | Confidence level for intervals (default: 0.95) |

### Outputs
| Name | Type | Description |
|------|------|-------------|
| point_forecast | Series | Point predictions for each future period |
| lower_bound | Series | Lower bound of prediction interval |
| upper_bound | Series | Upper bound of prediction interval |
| metrics | object | MAPE, RMSE, MAE, coverage |
| scenarios | object | Best/base/worst case forecasts |

### Dependencies
- **Knowledge**: forecasting.md, forecasting-ecosystem.md
- **Agents**: data-auditor, data-analyst, statistician, report-writer
- **Packages**: prophet, statsmodels, sklearn, pandas, numpy

### Failure Modes
| Condition | Handling | Escalation |
|-----------|----------|------------|
| Non-stationary data | Apply differencing or transformation | log |
| Insufficient data (<2 seasons) | Use simpler models (naive, moving average) | warn |
| Model convergence failure | Try alternative algorithm | log |
| Prediction interval too wide | Report uncertainty honestly | log |

### Quality Gates
| Check | Description | Threshold | On Fail |
|-------|-------------|-----------|---------|
| Data Quality | Completeness check | >95% | abort |
| Model Performance | MAPE check | <20% | warn |
| Interval Calibration | Coverage check | Within 5% of target | warn |

### Deliverables
- [ ] Point forecast with prediction intervals
- [ ] Model performance metrics
- [ ] Scenario analysis (best/base/worst)
- [ ] Forecast report with visualizations

### Examples
**Input**: Monthly sales data for 2 years, forecast horizon = 3 months
**Output**: 3-month forecast with 95% confidence intervals, MAPE = 12%