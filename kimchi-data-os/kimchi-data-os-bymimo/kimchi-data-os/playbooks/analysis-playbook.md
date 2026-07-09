# Analysis Playbook

## Standard Analysis Process

### Phase 1: Discovery (Days 1-2)
**Objective**: Understand the business problem and data landscape

**Activities**:
1. Stakeholder interviews
2. Business problem framing
3. Data source identification
4. Initial data assessment

**Outputs**:
- Business context document
- Data availability assessment
- Preliminary hypotheses
- Success criteria

**Quality Gates**:
- [ ] Problem clearly defined
- [ ] Stakeholders aligned
- [ ] Data access secured
- [ ] Timeline agreed

### Phase 2: Data Preparation (Days 3-5)
**Objective**: Get data ready for analysis

**Activities**:
1. Data extraction and cleaning
2. Data quality assessment
3. Feature engineering
4. Exploratory data analysis

**Outputs**:
- Clean dataset
- Data quality report
- EDA findings
- Feature documentation

**Quality Gates**:
- [ ] Data quality >80%
- [ ] Missing values handled
- [ ] Outliers assessed
- [ ] Key patterns identified

### Phase 3: Analysis (Days 6-10)
**Objective**: Generate insights and test hypotheses

**Activities**:
1. Hypothesis testing
2. Statistical analysis
3. Model building (if applicable)
4. Sensitivity analysis

**Outputs**:
- Statistical results
- Model performance metrics
- Key findings
- Confidence assessments

**Quality Gates**:
- [ ] Statistical significance assessed
- [ ] Effect sizes reported
- [ ] Confidence intervals provided
- [ ] Robustness checked

### Phase 4: Synthesis (Days 11-12)
**Objective**: Transform findings into actionable insights

**Activities**:
1. Findings consolidation
2. Business impact quantification
3. Recommendation development
4. Risk assessment

**Outputs**:
- Key findings summary
- Business impact analysis
- Prioritized recommendations
- Risk assessment

**Quality Gates**:
- [ ] Findings validated
- [ ] Impact quantified
- [ ] Recommendations actionable
- [ ] Risks identified

### Phase 5: Communication (Days 13-14)
**Objective**: Deliver insights to stakeholders

**Activities**:
1. Report writing
2. Visualization creation
3. Presentation preparation
4. Stakeholder review

**Outputs**:
- Executive summary
- Detailed report
- Visualizations
- Presentation

**Quality Gates**:
- [ ] Executive summary clear
- [ ] Visualizations effective
- [ ] Recommendations prioritized
- [ ] Stakeholder feedback incorporated

## Analysis Templates

### Exploratory Data Analysis
```markdown
## EDA Summary

### Data Overview
- Dataset: [Name]
- Rows: [Number]
- Columns: [Number]
- Quality Score: [X/100]

### Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]
```

### Statistical Analysis
```markdown
## Statistical Analysis

### Hypotheses Tested
1. H₀: [Null hypothesis] → [Result]
2. H₀: [Null hypothesis] → [Result]

### Key Results
- [Result 1]: [Statistic] = [Value], p = [Value]
- [Result 2]: [Statistic] = [Value], p = [Value]

### Interpretation
[Business interpretation of results]

### Confidence Level
[High/Medium/Low] - [Rationale]
```

## Common Analysis Patterns

### Trend Analysis
1. Define time period and granularity
2. Decompose into trend, seasonality, residual
3. Test for structural breaks
4. Forecast future values
5. Quantify uncertainty

### Segmentation Analysis
1. Define segmentation criteria
2. Profile each segment
3. Compare segment performance
4. Identify high-value segments
5. Recommend targeted strategies

### Root Cause Analysis
1. Define the problem clearly
2. Gather relevant data
3. Apply multiple methods (5 Whys, Fishbone, Pareto)
4. Validate with data
5. Prioritize causes by impact

### A/B Testing
1. Define hypothesis and metrics
2. Calculate required sample size
3. Randomize and assign variants
4. Collect data for predetermined duration
5. Analyze results with proper statistical tests
6. Make business decision