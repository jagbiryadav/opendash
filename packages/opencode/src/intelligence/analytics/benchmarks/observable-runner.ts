/**
 * Observable Behavior Benchmark Runner
 * 
 * Measures what the USER SEES, not internal execution.
 * 
 * Two distinct evaluation dimensions:
 * 1. Internal Reasoning Quality (how it thinks) - NOT benchmarked
 * 2. External Observable Behavior (what it shows) - THIS IS BENCHMARKED
 */

import { Effect } from "effect"
import { AnalyticalReasoning, type ReasoningResult } from "../reasoning"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BenchmarkSpec {
  benchmark_id: string
  question: string
  expected_observable_behavior: {
    problem_decomposition: {
      problem_type_shown: string
      stakeholders_mentioned: string[]
      decision_context: string
    }
    workflow_selection: {
      workflow_name_shown: string
      reasoning_provided: boolean
      alternatives_mentioned: boolean
    }
    hypotheses: {
      count_shown: string
      each_has_evidence: boolean
      each_has_test_method: boolean
      each_has_confidence: boolean
    }
    data_requirements: {
      critical_data_listed: boolean
      columns_specified: boolean
      source_identified: boolean
    }
    statistical_methods: {
      methods_named: boolean
      assumptions_listed: boolean
      when_to_use_explained: boolean
    }
    kpi_reasoning: {
      equation_shown: string
      components_identified: boolean
      mathematical_insight_provided: boolean
    }
    recommendations: {
      count_shown: string
      prioritized: boolean
      impact_assessed: boolean
      effort_assessed: boolean
      risk_assessed: boolean
    }
    risk_disclosure: {
      risks_listed: boolean
      confidence_levels_shown: boolean
      limitations_acknowledged: boolean
    }
  }
}

interface ObservableResult {
  benchmark_id: string
  question: string
  observable_scores: {
    problem_decomposition: number
    workflow_selection: number
    hypothesis_presentation: number
    data_requirements: number
    statistical_methods: number
    kpi_reasoning: number
    recommendation_prioritization: number
    risk_disclosure: number
  }
  overall_observable_score: number
  flow_score: number
  passed: boolean
  details: {
    visible_steps: number
    total_steps: number
    hidden_critical_steps: string[]
  }
}

// ─── Scoring Functions ───────────────────────────────────────────────────────

function scoreProblemDecomposition(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["problem_decomposition"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check problem type shown
  if (result.problemDecomposition.problemType === expected.problem_type_shown) {
    score += 4
  }
  
  // Check stakeholders mentioned
  const stakeholdersShown = expected.stakeholders_mentioned.filter(s => 
    result.problemDecomposition.stakeholders.some(rs => rs.toLowerCase().includes(s.toLowerCase()))
  )
  score += Math.min(stakeholdersShown.length, 3)
  
  // Check decision context
  if (result.problemDecomposition.decisionType === expected.decision_context) {
    score += 3
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreWorkflowSelection(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["workflow_selection"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check workflow name shown
  if (result.workflowDecision.selectedWorkflow === expected.workflow_name_shown) {
    score += 4
  }
  
  // Check reasoning provided
  if (expected.reasoning_provided && result.workflowDecision.reasoning.length > 0) {
    score += 3
  }
  
  // Check alternatives mentioned
  if (expected.alternatives_mentioned && result.workflowDecision.alternatives.length > 0) {
    score += 3
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreHypothesisPresentation(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["hypotheses"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check count shown
  const count = result.hypotheses.length
  const [min, max] = expected.count_shown.split("-").map(Number)
  if (count >= min && count <= max) {
    score += 2
  }
  
  // Check each has evidence
  if (expected.each_has_evidence) {
    const withEvidence = result.hypotheses.filter(h => h.evidenceSupporting.length > 0).length
    if (withEvidence === result.hypotheses.length) {
      score += 3
    } else if (withEvidence > 0) {
      score += 1
    }
  }
  
  // Check each has test method
  if (expected.each_has_test_method) {
    const withMethod = result.hypotheses.filter(h => h.testMethod.length > 0).length
    if (withMethod === result.hypotheses.length) {
      score += 3
    } else if (withMethod > 0) {
      score += 1
    }
  }
  
  // Check each has confidence
  if (expected.each_has_confidence) {
    const withConfidence = result.hypotheses.filter(h => h.confidence.length > 0).length
    if (withConfidence === result.hypotheses.length) {
      score += 2
    } else if (withConfidence > 0) {
      score += 1
    }
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreDataRequirements(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["data_requirements"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check critical data listed
  if (expected.critical_data_listed && result.analyticalPlan.requiredData.length > 0) {
    score += 4
  }
  
  // Check columns specified
  if (expected.columns_specified) {
    const withColumns = result.analyticalPlan.requiredData.filter(d => d.columns && d.columns.length > 0).length
    if (withColumns > 0) {
      score += 3
    }
  }
  
  // Check source identified
  if (expected.source_identified) {
    const withSource = result.analyticalPlan.requiredData.filter(d => d.source && d.source.length > 0).length
    if (withSource > 0) {
      score += 3
    }
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreStatisticalMethods(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["statistical_methods"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check methods named
  if (expected.methods_named && result.statisticalDecision.recommendedTests.length > 0) {
    score += 4
  }
  
  // Check assumptions listed
  if (expected.assumptions_listed && result.statisticalDecision.assumptionsToCheck.length > 0) {
    score += 3
  }
  
  // Check when to use explained
  if (expected.when_to_use_explained) {
    const withWhenToUse = result.statisticalDecision.recommendedTests.filter(t => t.whenToUse.length > 0).length
    if (withWhenToUse > 0) {
      score += 3
    }
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreKPIReasoning(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["kpi_reasoning"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check equation shown
  if (expected.equation_shown && result.kpiAnalysis.equation === expected.equation_shown) {
    score += 4
  }
  
  // Check components identified
  if (expected.components_identified && result.kpiAnalysis.components.length > 0) {
    score += 3
  }
  
  // Check mathematical insight provided
  if (expected.mathematical_insight_provided && result.kpiAnalysis.mathematicalInsight.length > 0) {
    score += 3
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreRecommendationPrioritization(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["recommendations"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check count shown
  const count = result.recommendations.length
  const [min, max] = expected.count_shown.split("-").map(Number)
  if (count >= min && count <= max) {
    score += 2
  }
  
  // Check prioritized
  if (expected.prioritized) {
    const withPriority = result.recommendations.filter(r => r.priority).length
    if (withPriority > 0) {
      score += 3
    }
  }
  
  // Check impact assessed
  if (expected.impact_assessed) {
    const withImpact = result.recommendations.filter(r => r.impact).length
    if (withImpact > 0) {
      score += 2
    }
  }
  
  // Check effort assessed
  if (expected.effort_assessed) {
    const withEffort = result.recommendations.filter(r => r.effort).length
    if (withEffort > 0) {
      score += 1.5
    }
  }
  
  // Check risk assessed
  if (expected.risk_assessed) {
    const withRisk = result.recommendations.filter(r => r.risk).length
    if (withRisk > 0) {
      score += 1.5
    }
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

function scoreRiskDisclosure(
  result: ReasoningResult,
  expected: BenchmarkSpec["expected_observable_behavior"]["risk_disclosure"]
): { score: number; visible: boolean } {
  let score = 0
  
  // Check risks listed
  if (expected.risks_listed && result.riskAnalysis.risks.length > 0) {
    score += 4
  }
  
  // Check confidence levels shown
  if (expected.confidence_levels_shown && result.confidenceCalibration.overallConfidence.length > 0) {
    score += 3
  }
  
  // Check limitations acknowledged
  if (expected.limitations_acknowledged && result.analyticalPlan.riskFactors.length > 0) {
    score += 3
  }
  
  return { score: Math.min(score, 10), visible: score > 0 }
}

// ─── Flow Score Calculator ───────────────────────────────────────────────────

function calculateFlowScore(result: ReasoningResult): { flow_score: number; visible_steps: number; total_steps: number; hidden_critical_steps: string[] } {
  const steps = [
    { name: "Problem Decomposition", visible: result.problemDecomposition.problemType.length > 0 },
    { name: "Workflow Selection", visible: result.workflowDecision.selectedWorkflow.length > 0 },
    { name: "Hypotheses", visible: result.hypotheses.length > 0 },
    { name: "Data Requirements", visible: result.analyticalPlan.requiredData.length > 0 },
    { name: "Statistical Methods", visible: result.statisticalDecision.recommendedTests.length > 0 },
    { name: "KPI Reasoning", visible: result.kpiAnalysis.equation.length > 0 },
    { name: "Recommendations", visible: result.recommendations.length > 0 },
    { name: "Risk Disclosure", visible: result.riskAnalysis.risks.length > 0 },
  ]
  
  const visible_steps = steps.filter(s => s.visible).length
  const total_steps = steps.length
  const hidden_critical_steps = steps.filter(s => !s.visible).map(s => s.name)
  
  const flow_score = (visible_steps / total_steps) * 10
  
  return { flow_score, visible_steps, total_steps, hidden_critical_steps }
}

// ─── Main Runner ─────────────────────────────────────────────────────────────

async function runObservableBenchmark(spec: BenchmarkSpec): Promise<ObservableResult> {
  console.log(`\nBenchmark: ${spec.benchmark_id}`)
  console.log(`Question: "${spec.question}"`)
  
  // Run reasoning
  const result = await Effect.runPromise(
    AnalyticalReasoning.of({}).reason(spec.question)
  )
  
  // Score each observable dimension
  const problem_decomposition = scoreProblemDecomposition(result, spec.expected_observable_behavior.problem_decomposition)
  const workflow_selection = scoreWorkflowSelection(result, spec.expected_observable_behavior.workflow_selection)
  const hypothesis_presentation = scoreHypothesisPresentation(result, spec.expected_observable_behavior.hypotheses)
  const data_requirements = scoreDataRequirements(result, spec.expected_observable_behavior.data_requirements)
  const statistical_methods = scoreStatisticalMethods(result, spec.expected_observable_behavior.statistical_methods)
  const kpi_reasoning = scoreKPIReasoning(result, spec.expected_observable_behavior.kpi_reasoning)
  const recommendation_prioritization = scoreRecommendationPrioritization(result, spec.expected_observable_behavior.recommendations)
  const risk_disclosure = scoreRiskDisclosure(result, spec.expected_observable_behavior.risk_disclosure)
  
  // Calculate overall observable score
  const scores = [
    problem_decomposition.score,
    workflow_selection.score,
    hypothesis_presentation.score,
    data_requirements.score,
    statistical_methods.score,
    kpi_reasoning.score,
    recommendation_prioritization.score,
    risk_disclosure.score,
  ]
  const overall_observable_score = scores.reduce((a, b) => a + b, 0) / scores.length
  
  // Calculate flow score
  const { flow_score, visible_steps, total_steps, hidden_critical_steps } = calculateFlowScore(result)
  
  // Determine pass/fail
  const passed = overall_observable_score >= 8.0 && flow_score >= 8.0 && hidden_critical_steps.length === 0
  
  // Print results
  console.log("\nObservable Behavior:")
  console.log(`  Problem Decomposition:    ${problem_decomposition.score}/10 ${problem_decomposition.visible ? "✓" : "✗"}`)
  console.log(`  Workflow Selection:       ${workflow_selection.score}/10 ${workflow_selection.visible ? "✓" : "✗"}`)
  console.log(`  Hypothesis Presentation:  ${hypothesis_presentation.score}/10 ${hypothesis_presentation.visible ? "✓" : "✗"}`)
  console.log(`  Data Requirements:        ${data_requirements.score}/10 ${data_requirements.visible ? "✓" : "✗"}`)
  console.log(`  Statistical Methods:      ${statistical_methods.score}/10 ${statistical_methods.visible ? "✓" : "✗"}`)
  console.log(`  KPI Reasoning:            ${kpi_reasoning.score}/10 ${kpi_reasoning.visible ? "✓" : "✗"}`)
  console.log(`  Recommendation Priority:  ${recommendation_prioritization.score}/10 ${recommendation_prioritization.visible ? "✓" : "✗"}`)
  console.log(`  Risk Disclosure:          ${risk_disclosure.score}/10 ${risk_disclosure.visible ? "✓" : "✗"}`)
  console.log(`  ─────────────────────────────`)
  console.log(`  Overall Observable Score: ${overall_observable_score.toFixed(1)}/10`)
  console.log(`  Flow Score:               ${flow_score.toFixed(1)}/10 (${visible_steps}/${total_steps} steps visible)`)
  console.log(`  Passed:                   ${passed ? "✓ YES" : "✗ NO"}`)
  
  if (hidden_critical_steps.length > 0) {
    console.log(`  Hidden Steps:             ${hidden_critical_steps.join(", ")}`)
  }
  
  return {
    benchmark_id: spec.benchmark_id,
    question: spec.question,
    observable_scores: {
      problem_decomposition: problem_decomposition.score,
      workflow_selection: workflow_selection.score,
      hypothesis_presentation: hypothesis_presentation.score,
      data_requirements: data_requirements.score,
      statistical_methods: statistical_methods.score,
      kpi_reasoning: kpi_reasoning.score,
      recommendation_prioritization: recommendation_prioritization.score,
      risk_disclosure: risk_disclosure.score,
    },
    overall_observable_score,
    flow_score,
    passed,
    details: {
      visible_steps,
      total_steps,
      hidden_critical_steps,
    },
  }
}

// ─── Benchmark Specifications ────────────────────────────────────────────────

const RETAIL_001: BenchmarkSpec = {
  benchmark_id: "retail-001",
  question: "Sales dropped by 18% last quarter",
  expected_observable_behavior: {
    problem_decomposition: {
      problem_type_shown: "diagnostic",
      stakeholders_mentioned: ["Sales", "Finance"],
      decision_context: "Operational",
    },
    workflow_selection: {
      workflow_name_shown: "root-cause",
      reasoning_provided: true,
      alternatives_mentioned: true,
    },
    hypotheses: {
      count_shown: "4-6",
      each_has_evidence: true,
      each_has_test_method: true,
      each_has_confidence: true,
    },
    data_requirements: {
      critical_data_listed: true,
      columns_specified: true,
      source_identified: true,
    },
    statistical_methods: {
      methods_named: true,
      assumptions_listed: true,
      when_to_use_explained: true,
    },
    kpi_reasoning: {
      equation_shown: "Revenue = Traffic × Conversion × AOV",
      components_identified: true,
      mathematical_insight_provided: true,
    },
    recommendations: {
      count_shown: "3-5",
      prioritized: true,
      impact_assessed: true,
      effort_assessed: true,
      risk_assessed: true,
    },
    risk_disclosure: {
      risks_listed: true,
      confidence_levels_shown: true,
      limitations_acknowledged: true,
    },
  },
}

const FORECAST_001: BenchmarkSpec = {
  benchmark_id: "forecast-001",
  question: "Forecast revenue for next quarter",
  expected_observable_behavior: {
    problem_decomposition: {
      problem_type_shown: "predictive",
      stakeholders_mentioned: ["Finance", "Sales"],
      decision_context: "Financial",
    },
    workflow_selection: {
      workflow_name_shown: "forecasting",
      reasoning_provided: true,
      alternatives_mentioned: true,
    },
    hypotheses: {
      count_shown: "2-4",
      each_has_evidence: true,
      each_has_test_method: true,
      each_has_confidence: true,
    },
    data_requirements: {
      critical_data_listed: true,
      columns_specified: true,
      source_identified: true,
    },
    statistical_methods: {
      methods_named: true,
      assumptions_listed: true,
      when_to_use_explained: true,
    },
    kpi_reasoning: {
      equation_shown: "Revenue = Customers × ARPU",
      components_identified: true,
      mathematical_insight_provided: true,
    },
    recommendations: {
      count_shown: "3-5",
      prioritized: true,
      impact_assessed: true,
      effort_assessed: true,
      risk_assessed: true,
    },
    risk_disclosure: {
      risks_listed: true,
      confidence_levels_shown: true,
      limitations_acknowledged: true,
    },
  },
}

// ─── Run All Benchmarks ──────────────────────────────────────────────────────

async function runAllObservableBenchmarks(): Promise<void> {
  console.log("=== Observable Analytical Behavior Benchmark ===\n")
  
  const specs = [RETAIL_001, FORECAST_001]
  const results: ObservableResult[] = []
  
  for (const spec of specs) {
    const result = await runObservableBenchmark(spec)
    results.push(result)
  }
  
  // Summary
  const average_score = results.reduce((a, b) => a + b.overall_observable_score, 0) / results.length
  const pass_rate = results.filter(r => r.passed).length / results.length * 100
  
  console.log("\n=== Summary ===")
  console.log(`Total Benchmarks: ${results.length}`)
  console.log(`Average Observable Score: ${average_score.toFixed(1)}/10`)
  console.log(`Pass Rate: ${pass_rate.toFixed(0)}%`)
  console.log(`Passed: ${results.filter(r => r.passed).length}/${results.length}`)
}

// Run
runAllObservableBenchmarks().catch(console.error)

export { runObservableBenchmark, runAllObservableBenchmarks }
export type { BenchmarkSpec, ObservableResult }