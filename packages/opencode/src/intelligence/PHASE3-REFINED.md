# Phase 3 Refined: Observable Analytical Behavior Metrics

## Key Insight

The benchmark must measure **what the user sees**, not internal execution.

### Two Distinct Dimensions

| Dimension | What It Measures | Benchmarked? |
|-----------|------------------|--------------|
| Internal Reasoning Quality | How the system thinks | NO |
| External Observable Behavior | What the user sees | YES |

## What Changed

### Before (Internal Focus)
- Confidence calibration values
- Internal reasoning steps
- Internal state transitions

### After (Observable Focus)
- Problem decomposition SHOWN to user
- Workflow selection COMMUNICATED
- Hypotheses PRESENTED with evidence
- Data requirements LISTED
- Statistical methods RECOMMENDED
- KPI relationships EXPLAINED
- Recommendations PRIORITIZED
- Risks DISCLOSED

## Benchmark Specification Format

Each benchmark defines EXPECTED OBSERVABLE OUTPUTS:

```json
{
  "benchmark_id": "retail-001",
  "question": "Sales dropped by 18%",
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
    ...
  }
}
```

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

## Flow Score

Measures what percentage of the designed workflow is visible to the user:

```
Flow Score = (Visible Steps / Total Steps) × 10

Designed Flow:
1. Problem Decomposition (SHOWN)
2. Workflow Selection (SHOWN)
3. Hypotheses (SHOWN)
4. Data Requirements (SHOWN)
5. Statistical Methods (SHOWN)
6. KPI Reasoning (SHOWN)
7. Recommendations (SHOWN)
8. Risk Disclosure (SHOWN)

If 7/8 steps visible:
Flow Score = 7/8 × 10 = 8.75
```

## Pass/Fail Criteria

### PASS if:
1. **Observable Score ≥ 8.0** (user sees what they should)
2. **Flow Score ≥ 8.0** (80% of steps visible)
3. **No hidden critical steps** (workflow, hypotheses, recommendations visible)
4. **Evidence provided** (hypotheses have supporting/against)
5. **Risks disclosed** (limitations acknowledged)

### FAIL if:
1. Observable Score < 6.0
2. Critical steps hidden
3. No reasoning provided
4. Risks not disclosed

## Running Benchmarks

### Command
```bash
cd packages/opencode
bun test src/intelligence/analytics/benchmarks/observable-runner.ts
```

### Output
```
=== Observable Analytical Behavior Benchmark ===

Benchmark: retail-001
Question: "Sales dropped by 18%"

Observable Behavior:
  Problem Decomposition:    9/10 ✓
  Workflow Selection:       10/10 ✓
  Hypothesis Presentation:  8/10 ✓
  Data Requirements:        7/10 ✓
  Statistical Methods:      8/10 ✓
  KPI Reasoning:            9/10 ✓
  Recommendation Priority:  8/10 ✓
  Risk Disclosure:          9/10 ✓
  ─────────────────────────────
  Overall Observable Score: 8.7/10
  Flow Score:               10.0/10 (8/8 steps visible)
  Passed:                   ✓ YES

=== Summary ===
Total Benchmarks: 2
Average Observable Score: 8.7/10
Pass Rate: 100%
```

## What This Proves

### NOT Proved
- Internal confidence values are correct
- Internal reasoning is optimal
- Internal state transitions work

### PROVED
- User SEES the workflow selection
- User READS the hypotheses with evidence
- User UNDERSTANDS the KPI relationships
- User CAN ACT on the recommendations
- User KNOWS the risks and limitations

## Architecture Promise Validation

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

The benchmark VALIDATES that each step is:
1. VISIBLE to user
2. Has REASONING provided
3. Connects to NEXT step
4. Not SKIPPED
5. Not HIDDEN

## Version

- Data OS: 5.3.1
- Phase: 3 (Observable Analytical Behavior Metrics)
- Status: Complete