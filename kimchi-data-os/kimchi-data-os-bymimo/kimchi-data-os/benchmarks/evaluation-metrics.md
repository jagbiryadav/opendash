# Analytical Intelligence Evaluation Metrics

## 10 Evaluation Dimensions

### 1. Intent Understanding
**Question**: Did it correctly identify the business problem?

**Scoring**:
- 10: Perfectly identified problem type, stakeholders, decision context
- 8: Correctly identified problem type with minor gaps
- 6: Partially correct, missed key aspects
- 4: Significant misunderstanding
- 2: Completely wrong interpretation
- 0: No understanding

**Evidence Required**:
- Problem type classification
- Stakeholder identification
- Decision context extraction
- Urgency assessment

---

### 2. Workflow Selection
**Question**: Did it choose the correct analytical workflow?

**Scoring**:
- 10: Optimal workflow for the problem type
- 8: Appropriate workflow with minor alternatives
- 6: Acceptable but not optimal
- 4: Suboptimal choice
- 2: Wrong workflow category
- 0: No workflow selected

**Evidence Required**:
- Workflow chosen
- Reasoning for choice
- Alternatives considered
- Fit to problem type

---

### 3. Hypothesis Quality
**Question**: Were the hypotheses plausible and testable?

**Scoring**:
- 10: All hypotheses plausible, testable, and comprehensive
- 8: Most hypotheses good, minor gaps
- 6: Some good hypotheses, some weak
- 4: Many implausible or untestable hypotheses
- 2: Hypotheses irrelevant to problem
- 0: No hypotheses generated

**Evidence Required**:
- Number of hypotheses
- Plausibility assessment
- Testability assessment
- Coverage of possible causes

---

### 4. Data Requirement Quality
**Question**: Did it ask for the right missing information?

**Scoring**:
- 10: All critical data requirements identified with columns
- 8: Most requirements identified, minor gaps
- 6: Some requirements identified
- 4: Missing critical requirements
- 2: Irrelevant requirements
- 0: No requirements identified

**Evidence Required**:
- Data requirements listed
- Criticality assessment
- Column specifications
- Source identification

---

### 5. Statistical Method Selection
**Question**: Did it recommend the appropriate analysis?

**Scoring**:
- 10: Optimal methods for data type and question
- 8: Appropriate methods with minor alternatives
- 6: Acceptable but not optimal
- 4: Suboptimal methods
- 2: Wrong methods entirely
- 0: No methods recommended

**Evidence Required**:
- Methods recommended
- Assumptions listed
- When to use guidance
- Alternatives considered

---

### 6. KPI Reasoning
**Question**: Did it identify the right metrics and relationships?

**Scoring**:
- 10: Correct metrics, accurate relationships, mathematical decomposition
- 8: Correct metrics with minor relationship gaps
- 6: Some correct metrics, relationships unclear
- 4: Wrong metrics or relationships
- 2: No meaningful KPI analysis
- 0: No KPI reasoning

**Evidence Required**:
- Primary metric identified
- Equation provided
- Components decomposed
- Mathematical insight

---

### 7. Recommendation Quality
**Question**: Would an experienced analyst reasonably make these recommendations?

**Scoring**:
- 10: Recommendations follow logically from analysis, actionable, prioritized
- 8: Most recommendations good, minor issues
- 6: Some good recommendations, some weak
- 4: Recommendations don't follow from analysis
- 2: Irrelevant or harmful recommendations
- 0: No recommendations

**Evidence Required**:
- Recommendations listed
- Priority ranking
- Impact assessment
- Effort assessment
- Risk assessment

---

### 8. Explainability
**Question**: Could the system justify every major conclusion?

**Scoring**:
- 10: Every conclusion has clear evidence chain
- 8: Most conclusions justified, minor gaps
- 6: Some conclusions justified
- 4: Many unjustified conclusions
- 2: No evidence provided
- 0: No explainability

**Evidence Required**:
- Evidence chains
- Reasoning steps
- Assumptions stated
- Limitations acknowledged

---

### 9. Hallucination Rate
**Question**: Did it invent unsupported facts?

**Scoring**:
- 10: Zero hallucinations, all claims supported
- 8: Minor hallucinations,不影响 conclusions
- 6: Some hallucinations, affects confidence
- 4: Significant hallucinations
- 2: Major hallucinations, invalidates analysis
- 0: Complete fabrication

**Evidence Required**:
- Facts claimed
- Evidence for each fact
- Unsupported claims identified
- Confidence adjustments

---

### 10. Business Usefulness
**Question**: If I were a business executive, would this analysis help me make a decision?

**Scoring**:
- 10: Analysis directly answers business question, actionable
- 8: Analysis mostly helpful, minor gaps
- 6: Analysis somewhat helpful
- 4: Analysis has limited usefulness
- 2: Analysis not useful for decision-making
- 0: Analysis waste of time

**Evidence Required**:
- Business question answered
- Decision supported
- Actionable next steps
- Confidence in recommendations

---

## Overall Score Calculation

```
Overall Score = Average of all 10 metrics

Interpretation:
9.0-10.0: Excellent (Senior Consultant level)
8.0-8.9:  Good (Junior Consultant level)
7.0-7.9:  Acceptable (Analyst level)
6.0-6.9:  Needs Improvement
< 6.0:    Poor
```

## Benchmark Structure

Each benchmark contains:

```json
{
  "id": "retail-001",
  "name": "Retail Sales Decline",
  "category": "retail",
  "question": "Sales dropped by 18% last quarter",
  "context": {
    "industry": "retail",
    "data_available": ["sales", "marketing", "inventory"],
    "stakeholders": ["VP Sales", "CFO"],
    "urgency": "high"
  },
  "expected": {
    "intent_understanding": {
      "problem_type": "diagnostic",
      "stakeholders": ["Sales", "Finance"],
      "decision_type": "Operational"
    },
    "workflow_selection": "root-cause",
    "hypotheses": ["seasonality", "marketing", "competition", "inventory"],
    "data_requirements": ["marketing_spend", "inventory_levels", "competitor_pricing"],
    "statistical_methods": ["time_series_decomposition", "regression", "correlation"],
    "kpi_reasoning": "Revenue = Traffic × Conversion × AOV",
    "recommendations": ["restore_marketing", "investigate_inventory", "monitor_competition"],
    "explainability": "evidence_chains_required",
    "hallucination_rate": "zero",
    "business_usefulness": "executive_decision_support"
  }
}
```

## Running Benchmarks

### Command
```bash
cd packages/opencode
bun test src/intelligence/analytics/benchmarks/runner.ts
```

### Output
```
=== Analytical Intelligence Benchmark ===

Benchmark: retail-001 (Retail Sales Decline)
  Intent Understanding:     9/10
  Workflow Selection:       10/10
  Hypothesis Quality:       8/10
  Data Requirements:        7/10
  Statistical Methods:      8/10
  KPI Reasoning:            9/10
  Recommendation Quality:   8/10
  Explainability:           9/10
  Hallucination Rate:       10/10
  Business Usefulness:      9/10
  ─────────────────────────────
  Overall Score:            8.7/10

Benchmark: finance-001 (Credit Card Fraud)
  ...

=== Summary ===
Total Benchmarks: 10
Average Score:    8.4/10
Pass Rate:        90% (≥8.0)
Best Category:    retail (8.7)
Worst Category:   finance (8.1)
```

## Versioning

Each benchmark run produces a versioned report:

```
benchmarks/results/
├── v5.2.5_2024-01-15.json
├── v5.3.0_2024-02-01.json
└── v5.4.0_2024-03-01.json
```

This allows tracking improvement over time.