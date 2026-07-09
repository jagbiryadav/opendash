# Observable Analytical Behavior Metrics

## Two Distinct Evaluation Dimensions

### 1. Internal Reasoning Quality (How it thinks)
- Confidence calibration
- Evidence grounding
- Hypothesis generation
- Statistical decision logic

**This is NOT what we benchmark.**

### 2. External Observable Behavior (What it shows the user)
- Problem decomposition presented to user
- Workflow selection communicated
- Hypotheses shown with evidence
- Data requirements listed
- Statistical methods recommended
- KPI relationships explained
- Recommendations prioritized
- Risk assessment disclosed

**This IS what we benchmark.**

---

## Benchmark Specification Format

Each benchmark defines EXPECTED OBSERVABLE OUTPUTS:

```json
{
  "benchmark_id": "retail-001",
  "question": "Sales dropped by 18% last quarter",
  "expected_observable_behavior": {
    "problem_decomposition": {
      "problem_type_shown": "diagnostic",
      "stakeholders_mentioned": ["Sales", "Finance"],
      "decision_context": "Operational"
    },
    "workflow_selection": {
      "workflow_name_shown": "Root Cause Analysis",
      "reasoning_provided": true,
      "alternatives_mentioned": true
    },
    "hypotheses": {
      "count_shown": "4-6",
      "each_has_evidence": true,
      "each_has_test_method": true,
      "each_has_confidence": true
    },
    "data_requirements": {
      "critical_data_listed": true,
      "columns_specified": true,
      "source_identified": true
    },
    "statistical_methods": {
      "methods_named": true,
      "assumptions_listed": true,
      "when_to_use_explained": true
    },
    "kpi_reasoning": {
      "equation_shown": "Revenue = Traffic × Conversion × AOV",
      "components_identified": true,
      "mathematical_insight_provided": true
    },
    "recommendations": {
      "count_shown": "3-5",
      "prioritized": true,
      "impact_assessed": true,
      "effort_assessed": true,
      "risk_assessed": true
    },
    "risk_disclosure": {
      "risks_listed": true,
      "confidence_levels_shown": true,
      "limitations_acknowledged": true
    }
  }
}
```

---

## Observable Behavior Metrics

### 1. Problem Decomposition Visibility
**Question**: Did the system SHOW the user how it decomposed the problem?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Problem type shown | Explicitly stated | Hidden |
| Stakeholders mentioned | Listed clearly | Not mentioned |
| Decision context | Explained | Not explained |

### 2. Workflow Selection Transparency
**Question**: Did the system COMMUNICATE which workflow it chose and why?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Workflow name shown | "Root Cause Analysis" | Hidden |
| Reasoning provided | "Because problem is diagnostic" | No reasoning |
| Alternatives mentioned | "Other options: EDA, Forecasting" | No alternatives |

### 3. Hypothesis Presentation
**Question**: Did the system PRESENT hypotheses with supporting evidence?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Count shown | "5 hypotheses generated" | Hidden |
| Each has evidence | Supporting/against listed | No evidence |
| Each has test method | How to verify | No method |
| Each has confidence | Medium/High/Low | No confidence |

### 4. Data Requirements Disclosure
**Question**: Did the system LIST what data is needed?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Critical data listed | "Need marketing spend data" | Hidden |
| Columns specified | "date, spend, impressions" | No columns |
| Source identified | "From marketing platform" | No source |

### 5. Statistical Method Communication
**Question**: Did the system RECOMMEND appropriate methods?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Methods named | "Time Series Decomposition" | Hidden |
| Assumptions listed | "Requires stationarity" | No assumptions |
| When to use explained | "Use for temporal patterns" | No explanation |

### 6. KPI Relationship Explanation
**Question**: Did the system EXPLAIN metric relationships?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Equation shown | "Revenue = Traffic × Conversion × AOV" | Hidden |
| Components identified | "3 components: Traffic, Conversion, AOV" | Not identified |
| Mathematical insight | "AOV declined 15%, primary driver" | No insight |

### 7. Recommendation Prioritization
**Question**: Did the system PRIORITIZE recommendations?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Count shown | "5 recommendations" | Hidden |
| Prioritized | P1, P2, P3 labels | Not prioritized |
| Impact assessed | "High impact: $1.2M" | No impact |
| Effort assessed | "Low effort: 1 week" | No effort |
| Risk assessed | "Medium risk" | No risk |

### 8. Risk Disclosure
**Question**: Did the system DISCLOS risks and limitations?

| Observable | Score 10 | Score 0 |
|------------|----------|---------|
| Risks listed | "Risk: Seasonal factors" | Hidden |
| Confidence levels | "Confidence: Medium" | No confidence |
| Limitations acknowledged | "Limitation: Small sample" | No limitations |

---

## Reproducible Comparison Logic

### For Each Benchmark

1. **Run reasoning engine** on question
2. **Extract observable outputs** from reasoning result
3. **Compare against expected** observable behavior
4. **Score each dimension** (0-10)
5. **Calculate overall score** (average of dimensions)

### Comparison Rules

```
IF observable_output CONTAINS expected_element
  THEN score += 1

IF observable_output MISSING expected_element
  THEN score += 0

IF observable_output EXCEEDS expected (additional detail)
  THEN score += 0.5 (bonus)
```

---

## User-Visible Workflow Validation

### Architecture Promise
The system promises this flow:
```
User Question
    ↓
Problem Decomposition (SHOWN)
    ↓
Workflow Selection (SHOWN)
    ↓
Hypotheses with Evidence (SHOWN)
    ↓
Data Requirements (SHOWN)
    ↓
Statistical Methods (SHOWN)
    ↓
KPI Reasoning (SHOWN)
    ↓
Recommendations (SHOWN)
    ↓
Risk Disclosure (SHOWN)
```

### Validation Check
For each benchmark, verify:
1. Each step is VISIBLE to user
2. Each step has REASONING provided
3. Each step connects to NEXT step
4. No steps are SKIPPED
5. No steps are HIDDEN

### Observable Flow Score
```
Flow Score = (Visible Steps / Total Steps) × 10

Example:
- 8 steps designed
- 7 steps visible to user
- Flow Score = 7/8 × 10 = 8.75
```

---

## Benchmark Execution

### Step 1: Define Expected Observable Behavior
```json
{
  "question": "Sales dropped by 18%",
  "expected": {
    "problem_type_shown": "diagnostic",
    "workflow_name_shown": "Root Cause Analysis",
    "hypotheses_count": "4-6",
    "equation_shown": "Revenue = Traffic × Conversion × AOV",
    "recommendations_prioritized": true,
    "risks_disclosed": true
  }
}
```

### Step 2: Run Reasoning Engine
```typescript
const result = await reasoning.reason(question)
```

### Step 3: Extract Observable Outputs
```typescript
const observable = {
  problem_type_shown: result.problemDecomposition.problemType,
  workflow_name_shown: result.workflowDecision.selectedWorkflow,
  hypotheses_count: result.hypotheses.length,
  equation_shown: result.kpiAnalysis.equation,
  recommendations_prioritized: result.recommendations.some(r => r.priority),
  risks_disclosed: result.riskAnalysis.risks.length > 0
}
```

### Step 4: Compare and Score
```typescript
for (const [key, expected] of Object.entries(expected)) {
  if (observable[key] === expected) score += 1
  else if (observable[key] !== undefined) score += 0.5
}
```

### Step 5: Generate Report
```
Benchmark: retail-001
Question: "Sales dropped by 18%"

Observable Behavior:
  Problem Type Shown:      ✓ (diagnostic)
  Workflow Shown:          ✓ (root-cause)
  Hypotheses Shown:        ✓ (5 hypotheses)
  Equation Shown:          ✓ (Revenue = Traffic × Conversion × AOV)
  Recommendations:         ✓ (prioritized P1, P2, P3)
  Risks Disclosed:         ✓ (3 risks listed)

Overall Observable Score: 9.2/10
```

---

## What This Measures

### NOT Measured
- Internal confidence values
- Internal reasoning steps
- Internal state transitions

### MEASURED
- What the user SEES
- What the user READS
- What the user UNDERSTANDS
- What the user CAN ACT ON

### Why This Matters
The architecture can be perfect internally, but if the user doesn't see:
- The workflow selection
- The hypothesis evidence
- The KPI relationships
- The risk disclosure

Then the system is NOT delivering on its promise.

---

## Success Criteria

A benchmark PASSES if:
1. **Observable Score ≥ 8.0** (user sees what they should)
2. **Flow Score ≥ 0.8** (80% of steps visible)
3. **No hidden critical steps** (workflow, hypotheses, recommendations visible)
4. **Evidence provided** (hypotheses have supporting/against)
5. **Risks disclosed** (limitations acknowledged)

A benchmark FAILS if:
1. Observable Score < 6.0
2. Critical steps hidden
3. No reasoning provided
4. Risks not disclosed