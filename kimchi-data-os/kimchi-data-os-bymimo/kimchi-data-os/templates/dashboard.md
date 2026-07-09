# Dashboard Template

## Dashboard Header
```markdown
# [Dashboard Name]

**Last Updated**: [Timestamp]
**Data Refresh**: [Frequency]
**Owner**: [Team/Person]
**Access**: [Public/Internal/Confidential]
```

## KPI Summary Row
```markdown
## Key Performance Indicators

| Metric | Current | Previous | Change | Status | Trend |
|--------|---------|----------|--------|--------|-------|
| [KPI 1] | [Value] | [Value] | [+/-X%] | [🟢/🟡/🔴] | [↑/↓/→] |
| [KPI 2] | [Value] | [Value] | [+/-X%] | [🟢/🟡/🔴] | [↑/↓/→] |
| [KPI 3] | [Value] | [Value] | [+/-X%] | [🟢/🟡/🔴] | [↑/↓/→] |
| [KPI 4] | [Value] | [Value] | [+/-X%] | [🟢/🟡/🔴] | [↑/↓/→] |
```

## Filter Panel
```markdown
## Filters

### Date Range
- [ ] Today
- [ ] Yesterday
- [ ] Last 7 Days
- [ ] Last 30 Days
- [ ] Month to Date
- [ ] Quarter to Date
- [ ] Year to Date
- [ ] Custom Range

### Dimensions
- **Region**: [All] [Select...]
- **Product Category**: [All] [Select...]
- **Customer Segment**: [All] [Select...]
- **Channel**: [All] [Select...]
```

## Main Visualizations

### Trend Analysis
```markdown
## Revenue Trend

[Line chart showing revenue over time]

**Key Insights**:
- [Insight 1]
- [Insight 2]

**Comparison**:
- vs Last Period: [+/-X%]
- vs Target: [+/-X%]
- vs Last Year: [+/-X%]
```

### Composition Analysis
```markdown
## Performance by Category

[Bar chart showing performance by category]

**Top Performers**:
1. [Category 1]: [Value] ([X%] of total)
2. [Category 2]: [Value] ([X%] of total)
3. [Category 3]: [Value] ([X%] of total)

**Bottom Performers**:
1. [Category 4]: [Value] ([X%] of total)
2. [Category 5]: [Value] ([X%] of total)
```

### Geographic Analysis
```markdown
## Regional Performance

[Map or regional chart showing performance by location]

**Regional Summary**:
| Region | Revenue | Growth | Target Achievement |
|--------|---------|--------|-------------------|
| [Region 1] | $[Value] | [+/-X%] | [X%] |
| [Region 2] | $[Value] | [+/-X%] | [X%] |
| [Region 3] | $[Value] | [+/-X%] | [X%] |
```

### Detailed Analysis
```markdown
## Top Products/Items

[Table showing top performers]

| Rank | Product | Revenue | Orders | Growth | Margin |
|------|---------|---------|--------|--------|--------|
| 1 | [Product 1] | $[Value] | [Count] | [+/-X%] | [X%] |
| 2 | [Product 2] | $[Value] | [Count] | [+/-X%] | [X%] |
| 3 | [Product 3] | $[Value] | [Count] | [+/-X%] | [X%] |
| 4 | [Product 4] | $[Value] | [Count] | [+/-X%] | [X%] |
| 5 | [Product 5] | $[Value] | [Count] | [+/-X%] | [X%] |
```

## Alert Panel
```markdown
## Alerts & Notifications

### Critical Alerts
- 🔴 **[Alert 1]**: [Description] - [Action Required]
- 🔴 **[Alert 2]**: [Description] - [Action Required]

### Warnings
- 🟡 **[Warning 1]**: [Description] - [Recommended Action]
- 🟡 **[Warning 2]**: [Description] - [Recommended Action]

### Information
- ℹ️ **[Info 1]**: [Description]
- ℹ️ **[Info 2]**: [Description]
```

## Forecast Section
```markdown
## Forecast & Projections

### Next [Period] Forecast
- **Revenue Forecast**: $[Value] ([Range: $Low - $High])
- **Confidence Level**: [High/Medium/Low]
- **Key Assumptions**: [Assumptions]

### Scenario Analysis
| Scenario | Revenue | Probability | Impact |
|----------|---------|-------------|--------|
| Optimistic | $[Value] | [X%] | [Description] |
| Base Case | $[Value] | [X%] | [Description] |
| Pessimistic | $[Value] | [X%] | [Description] |
```

## Action Items
```markdown
## Recommended Actions

### Immediate (This Week)
- [ ] [Action 1] - [Owner] - [Due Date]
- [ ] [Action 2] - [Owner] - [Due Date]

### Short-term (This Month)
- [ ] [Action 3] - [Owner] - [Due Date]
- [ ] [Action 4] - [Owner] - [Due Date]

### Long-term (This Quarter)
- [ ] [Action 5] - [Owner] - [Due Date]
- [ ] [Action 6] - [Owner] - [Due Date]
```

## Data Quality Panel
```markdown
## Data Quality

### Completeness
- **Overall**: [X%] complete
- **Critical Fields**: [X%] complete
- **Missing Data**: [Description of gaps]

### Freshness
- **Last Updated**: [Timestamp]
- **Data Lag**: [X hours/days]
- **Staleness Risk**: [Low/Medium/High]

### Accuracy
- **Validation Status**: [Pass/Fail]
- **Anomalies Detected**: [Count]
- **Data Quality Score**: [X/100]
```

## Dashboard Quality Checklist

- [ ] KPIs are clearly defined and calculated correctly
- [ ] Filters work properly and update all visualizations
- [ ] Charts are properly labeled with titles and axes
- [ ] Color scheme is consistent and accessible
- [ ] Alerts are actionable and prioritized
- [ ] Forecasts include confidence intervals
- [ ] Data quality metrics are displayed
- [ ] Mobile responsiveness is tested
- [ ] Performance is optimized (load time < 3 seconds)
- [ ] Documentation is complete and up-to-date