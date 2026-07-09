/**
 * Analytical Intelligence Benchmark Runner
 * 
 * Runs benchmark test cases and scores the reasoning engine.
 * 
 * Metrics:
 * 1. Intent Understanding
 * 2. Workflow Selection
 * 3. Hypothesis Quality
 * 4. Data Requirement Quality
 * 5. Statistical Method Selection
 * 6. KPI Reasoning
 * 7. Recommendation Quality
 * 8. Explainability
 * 9. Hallucination Rate
 * 10. Business Usefulness
 */

import { Effect } from "effect"
import { AnalyticalReasoning, type ReasoningResult } from "../reasoning"
import { AppFileSystem } from "@opendash-ai/shared/filesystem"
import path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BenchmarkCase {
  id: string
  name: string
  category: string
  question: string
  context: {
    industry: string
    data_available: string[]
    stakeholders: string[]
    urgency: string
  }
  expected: {
    intent_understanding: {
      problem_type: string
      stakeholders: string[]
      decision_type: string
      score: number
    }
    workflow_selection: {
      selected: string
      reasoning: string
      score: number
    }
    hypotheses: {
      count: string
      types: string[]
      testable: boolean
      evidence_based: boolean
      score: number
    }
    data_requirements: {
      critical: string[]
      important: string[]
      columns_specified: boolean
      score: number
    }
    statistical_methods: {
      methods: string[]
      appropriate: boolean
      assumptions_listed: boolean
      score: number
    }
    kpi_reasoning: {
      primary_metric: string
      equation: string
      decomposition: boolean
      mathematical_insight: string | boolean
      score: number
    }
    recommendations: {
      count: string
      prioritized: boolean
      impact_assessed: boolean
      risk_assessed: boolean
      score: number
    }
    explainability: {
      evidence_chains: boolean
      reasoning_steps: boolean
      assumptions_stated: boolean
      limitations_acknowledged: boolean
      score: number
    }
    hallucination_rate: {
      unsupported_claims: number
      confidence_adjusted: boolean
      score: number
    }
    business_usefulness: {
      question_answered: boolean
      decision_supported: boolean
      actionable_next_steps: boolean
      score: number
    }
  }
}

interface BenchmarkResult {
  benchmark_id: string
  benchmark_name: string
  category: string
  scores: {
    intent_understanding: number
    workflow_selection: number
    hypothesis_quality: number
    data_requirements: number
    statistical_methods: number
    kpi_reasoning: number
    recommendation_quality: number
    explainability: number
    hallucination_rate: number
    business_usefulness: number
  }
  overall_score: number
  timestamp: string
  reasoning_result?: ReasoningResult
}

interface BenchmarkSummary {
  version: string
  timestamp: string
  total_benchmarks: number
  average_score: number
  pass_rate: number
  best_category: string
  worst_category: string
  results: BenchmarkResult[]
}

// ─── Scoring Functions ───────────────────────────────────────────────────────

function scoreIntentUnderstanding(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["intent_understanding"]
): number {
  let score = 0
  
  // Check problem type
  if (result.problemDecomposition.problemType === expected.problem_type) {
    score += 4
  } else if (
    (result.problemDecomposition.problemType === "diagnostic" && expected.problem_type === "diagnostic") ||
    (result.problemDecomposition.problemType === "predictive" && expected.problem_type === "predictive")
  ) {
    score += 2
  }
  
  // Check stakeholders
  const stakeholderOverlap = expected.stakeholders.filter(s => 
    result.problemDecomposition.stakeholders.some(rs => rs.toLowerCase().includes(s.toLowerCase()))
  )
  score += Math.min(stakeholderOverlap.length, 3)
  
  // Check decision type
  if (result.problemDecomposition.decisionType === expected.decision_type) {
    score += 3
  }
  
  return Math.min(score, 10)
}

function scoreWorkflowSelection(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["workflow_selection"]
): number {
  if (result.workflowDecision.selectedWorkflow === expected.selected) {
    return 10
  }
  
  // Check if alternative is acceptable
  const alternatives = ["eda", "root-cause", "forecasting", "classification", "regression"]
  if (alternatives.includes(result.workflowDecision.selectedWorkflow)) {
    return 6
  }
  
  return 4
}

function scoreHypothesisQuality(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["hypotheses"]
): number {
  let score = 0
  
  // Check count
  const count = result.hypotheses.length
  const [min, max] = expected.count.split("-").map(Number)
  if (count >= min && count <= max) {
    score += 3
  } else if (count >= min - 1 && count <= max + 1) {
    score += 2
  }
  
  // Check testability
  const testableCount = result.hypotheses.filter(h => h.dataRequirements.length > 0).length
  if (testableCount > 0) {
    score += 3
  }
  
  // Check evidence-based
  const evidenceBased = result.hypotheses.filter(h => h.evidenceSupporting.length > 0).length
  if (evidenceBased > 0) {
    score += 4
  }
  
  return Math.min(score, 10)
}

function scoreDataRequirements(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["data_requirements"]
): number {
  let score = 0
  
  // Check if critical requirements identified
  const allRequirements = result.analyticalPlan.requiredData.map(d => d.name.toLowerCase())
  const criticalFound = expected.critical.filter(c => 
    allRequirements.some(r => r.includes(c.toLowerCase()))
  )
  score += Math.min(criticalFound.length * 2, 5)
  
  // Check column specification
  const hasColumns = result.analyticalPlan.requiredData.some(d => d.columns && d.columns.length > 0)
  if (hasColumns) {
    score += 3
  }
  
  // Check important requirements
  const importantFound = expected.important.filter(i => 
    allRequirements.some(r => r.includes(i.toLowerCase()))
  )
  score += Math.min(importantFound.length, 2)
  
  return Math.min(score, 10)
}

function scoreStatisticalMethods(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["statistical_methods"]
): number {
  let score = 0
  
  // Check if methods recommended
  if (result.statisticalDecision.recommendedTests.length > 0) {
    score += 4
  }
  
  // Check appropriateness
  const methodNames = result.statisticalDecision.recommendedTests.map(t => t.name.toLowerCase())
  const appropriateMethods = expected.methods.filter(m => 
    methodNames.some(n => n.includes(m.toLowerCase()))
  )
  score += Math.min(appropriateMethods.length * 2, 4)
  
  // Check assumptions listed
  if (result.statisticalDecision.assumptionsToCheck.length > 0) {
    score += 2
  }
  
  return Math.min(score, 10)
}

function scoreKPIReasoning(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["kpi_reasoning"]
): number {
  let score = 0
  
  // Check primary metric
  if (result.kpiAnalysis.primaryMetric.toLowerCase().includes(expected.primary_metric.toLowerCase())) {
    score += 3
  }
  
  // Check equation
  if (result.kpiAnalysis.equation && result.kpiAnalysis.equation.length > 0) {
    score += 3
  }
  
  // Check decomposition
  if (result.kpiAnalysis.decomposition) {
    score += 2
  }
  
  // Check mathematical insight
  if (result.kpiAnalysis.mathematicalInsight && result.kpiAnalysis.mathematicalInsight.length > 0) {
    score += 2
  }
  
  return Math.min(score, 10)
}

function scoreRecommendationQuality(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["recommendations"]
): number {
  let score = 0
  
  // Check count
  const count = result.recommendations.length
  const [min, max] = expected.count.split("-").map(Number)
  if (count >= min && count <= max) {
    score += 3
  }
  
  // Check prioritized
  const hasPriority = result.recommendations.some(r => r.priority)
  if (hasPriority) {
    score += 3
  }
  
  // Check impact assessed
  const hasImpact = result.recommendations.some(r => r.impact)
  if (hasImpact) {
    score += 2
  }
  
  // Check risk assessed
  const hasRisk = result.recommendations.some(r => r.risk)
  if (hasRisk) {
    score += 2
  }
  
  return Math.min(score, 10)
}

function scoreExplainability(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["explainability"]
): number {
  let score = 0
  
  // Check evidence chains
  if (result.rootCauses.evidenceChain.length > 0) {
    score += 3
  }
  
  // Check reasoning steps (hypotheses have evidence)
  const hasReasoning = result.hypotheses.some(h => h.evidenceSupporting.length > 0)
  if (hasReasoning) {
    score += 3
  }
  
  // Check assumptions stated
  if (result.confidenceCalibration.warnings.length > 0 || result.confidenceCalibration.recommendations.length > 0) {
    score += 2
  }
  
  // Check limitations acknowledged
  const hasLimitations = result.analyticalPlan.riskFactors.length > 0
  if (hasLimitations) {
    score += 2
  }
  
  return Math.min(score, 10)
}

function scoreHallucinationRate(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["hallucination_rate"]
): number {
  // For now, assume no hallucinations if reasoning is evidence-based
  const hasUnsupportedClaims = result.hypotheses.some(h => 
    h.evidenceSupporting.length === 0 && h.confidence !== "Very Low"
  )
  
  if (hasUnsupportedClaims) {
    return 6
  }
  
  return 10
}

function scoreBusinessUsefulness(
  result: ReasoningResult,
  expected: BenchmarkCase["expected"]["business_usefulness"]
): number {
  let score = 0
  
  // Check question answered
  if (result.businessFirstReasoning.businessContext.length > 0) {
    score += 3
  }
  
  // Check decision supported
  if (result.recommendations.length > 0) {
    score += 3
  }
  
  // Check actionable next steps
  if (result.businessFirstReasoning.nextActions.length > 0) {
    score += 4
  }
  
  return Math.min(score, 10)
}

// ─── Main Runner ─────────────────────────────────────────────────────────────

async function runBenchmark(benchmark: BenchmarkCase): Promise<BenchmarkResult> {
  console.log(`\nBenchmark: ${benchmark.id} (${benchmark.name})`)
  
  // Run reasoning
  const reasoning = await Effect.runPromise(
    AnalyticalReasoning.of({}).reason(benchmark.question)
  )
  
  // Score each dimension
  const scores = {
    intent_understanding: scoreIntentUnderstanding(reasoning, benchmark.expected.intent_understanding),
    workflow_selection: scoreWorkflowSelection(reasoning, benchmark.expected.workflow_selection),
    hypothesis_quality: scoreHypothesisQuality(reasoning, benchmark.expected.hypotheses),
    data_requirements: scoreDataRequirements(reasoning, benchmark.expected.data_requirements),
    statistical_methods: scoreStatisticalMethods(reasoning, benchmark.expected.statistical_methods),
    kpi_reasoning: scoreKPIReasoning(reasoning, benchmark.expected.kpi_reasoning),
    recommendation_quality: scoreRecommendationQuality(reasoning, benchmark.expected.recommendations),
    explainability: scoreExplainability(reasoning, benchmark.expected.explainability),
    hallucination_rate: scoreHallucinationRate(reasoning, benchmark.expected.hallucination_rate),
    business_usefulness: scoreBusinessUsefulness(reasoning, benchmark.expected.business_usefulness),
  }
  
  // Calculate overall score
  const overall_score = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  
  // Print scores
  console.log(`  Intent Understanding:     ${scores.intent_understanding}/10`)
  console.log(`  Workflow Selection:       ${scores.workflow_selection}/10`)
  console.log(`  Hypothesis Quality:       ${scores.hypothesis_quality}/10`)
  console.log(`  Data Requirements:        ${scores.data_requirements}/10`)
  console.log(`  Statistical Methods:      ${scores.statistical_methods}/10`)
  console.log(`  KPI Reasoning:            ${scores.kpi_reasoning}/10`)
  console.log(`  Recommendation Quality:   ${scores.recommendation_quality}/10`)
  console.log(`  Explainability:           ${scores.explainability}/10`)
  console.log(`  Hallucination Rate:       ${scores.hallucination_rate}/10`)
  console.log(`  Business Usefulness:      ${scores.business_usefulness}/10`)
  console.log(`  ─────────────────────────────`)
  console.log(`  Overall Score:            ${overall_score.toFixed(1)}/10`)
  
  return {
    benchmark_id: benchmark.id,
    benchmark_name: benchmark.name,
    category: benchmark.category,
    scores,
    overall_score,
    timestamp: new Date().toISOString(),
    reasoning_result: reasoning,
  }
}

async function runAllBenchmarks(): Promise<BenchmarkSummary> {
  console.log("=== Analytical Intelligence Benchmark ===\n")
  
  // Load benchmark cases
  const benchmarks: BenchmarkCase[] = [
    {
      id: "retail-001",
      name: "Retail Sales Decline",
      category: "retail",
      question: "Sales dropped by 18% last quarter",
      context: {
        industry: "retail",
        data_available: ["sales", "marketing", "inventory"],
        stakeholders: ["VP Sales", "CFO"],
        urgency: "high",
      },
      expected: {
        intent_understanding: {
          problem_type: "diagnostic",
          stakeholders: ["Sales", "Finance"],
          decision_type: "Operational",
          score: 9,
        },
        workflow_selection: {
          selected: "root-cause",
          reasoning: "Problem is diagnostic",
          score: 10,
        },
        hypotheses: {
          count: "4-6",
          types: ["temporal", "causal", "correlational"],
          testable: true,
          evidence_based: true,
          score: 8,
        },
        data_requirements: {
          critical: ["marketing_spend", "inventory_levels"],
          important: ["competitor_pricing", "customer_satisfaction"],
          columns_specified: true,
          score: 8,
        },
        statistical_methods: {
          methods: ["time_series_decomposition", "regression", "correlation"],
          appropriate: true,
          assumptions_listed: true,
          score: 8,
        },
        kpi_reasoning: {
          primary_metric: "Revenue",
          equation: "Revenue = Traffic × Conversion × AOV",
          decomposition: true,
          mathematical_insight: true,
          score: 9,
        },
        recommendations: {
          count: "3-5",
          prioritized: true,
          impact_assessed: true,
          risk_assessed: true,
          score: 8,
        },
        explainability: {
          evidence_chains: true,
          reasoning_steps: true,
          assumptions_stated: true,
          limitations_acknowledged: true,
          score: 9,
        },
        hallucination_rate: {
          unsupported_claims: 0,
          confidence_adjusted: true,
          score: 10,
        },
        business_usefulness: {
          question_answered: true,
          decision_supported: true,
          actionable_next_steps: true,
          score: 9,
        },
      },
    },
    {
      id: "retail-002",
      name: "Customer Churn Increase",
      category: "retail",
      question: "Why did customer churn increase from 3% to 5%?",
      context: {
        industry: "retail",
        data_available: ["customer_transactions", "support_tickets", "product_returns"],
        stAkeholders: ["VP Customer Success", "CPO"],
        urgency: "high",
      },
      expected: {
        intent_understanding: {
          problem_type: "diagnostic",
          stakeholders: ["Customer Success", "Product"],
          decision_type: "Operational",
          score: 9,
        },
        workflow_selection: {
          selected: "root-cause",
          reasoning: "Investigating why churn increased",
          score: 10,
        },
        hypotheses: {
          count: "4-6",
          types: ["causal", "segmentation"],
          testable: true,
          evidence_based: true,
          score: 8,
        },
        data_requirements: {
          critical: ["customer_activity", "support_interactions", "product_feedback"],
          important: ["competitor_offerings", "price_changes"],
          columns_specified: true,
          score: 8,
        },
        statistical_methods: {
          methods: ["survival_analysis", "logistic_regression", "cohort_analysis"],
          appropriate: true,
          assumptions_listed: true,
          score: 8,
        },
        kpi_reasoning: {
          primary_metric: "Churn Rate",
          equation: "Churn Rate = Customers Lost / Customers at Start",
          decomposition: true,
          mathematical_insight: "CLV = ARPU / Churn, so churn increase directly reduces customer lifetime value",
          score: 9,
        },
        recommendations: {
          count: "3-5",
          prioritized: true,
          impact_assessed: true,
          risk_assessed: true,
          score: 8,
        },
        explainability: {
          evidence_chains: true,
          reasoning_steps: true,
          assumptions_stated: true,
          limitations_acknowledged: true,
          score: 9,
        },
        hallucination_rate: {
          unsupported_claims: 0,
          confidence_adjusted: true,
          score: 10,
        },
        business_usefulness: {
          question_answered: true,
          decision_supported: true,
          actionable_next_steps: true,
          score: 9,
        },
      },
    },
    {
      id: "forecast-001",
      name: "Revenue Forecast",
      category: "forecasting",
      question: "Forecast revenue for next quarter",
      context: {
        industry: "saas",
        data_available: ["historical_revenue", "marketing_spend", "customer_data"],
        stakeholders: ["CFO", "VP Sales"],
        urgency: "medium",
      },
      expected: {
        intent_understanding: {
          problem_type: "predictive",
          stakeholders: ["Finance", "Sales"],
          decision_type: "Financial",
          score: 9,
        },
        workflow_selection: {
          selected: "forecasting",
          reasoning: "Problem involves temporal prediction",
          score: 10,
        },
        hypotheses: {
          count: "2-4",
          types: ["temporal", "causal"],
          testable: true,
          evidence_based: true,
          score: 8,
        },
        data_requirements: {
          critical: ["historical_revenue", "seasonality_factors"],
          important: ["marketing_spend", "economic_indicators"],
          columns_specified: true,
          score: 8,
        },
        statistical_methods: {
          methods: ["time_series_decomposition", "ARIMA", "prophet", "regression"],
          appropriate: true,
          assumptions_listed: true,
          score: 8,
        },
        kpi_reasoning: {
          primary_metric: "Revenue",
          equation: "Revenue = Customers × ARPU",
          decomposition: true,
          mathematical_insight: "Forecast should consider customer growth and ARPU trends separately",
          score: 9,
        },
        recommendations: {
          count: "3-5",
          prioritized: true,
          impact_assessed: true,
          risk_assessed: true,
          score: 8,
        },
        explainability: {
          evidence_chains: true,
          reasoning_steps: true,
          assumptions_stated: true,
          limitations_acknowledged: true,
          score: 9,
        },
        hallucination_rate: {
          unsupported_claims: 0,
          confidence_adjusted: true,
          score: 10,
        },
        business_usefulness: {
          question_answered: true,
          decision_supported: true,
          actionable_next_steps: true,
          score: 9,
        },
      },
    },
  ]
  
  const results: BenchmarkResult[] = []
  
  for (const benchmark of benchmarks) {
    const result = await runBenchmark(benchmark)
    results.push(result)
  }
  
  // Calculate summary
  const average_score = results.reduce((a, b) => a + b.overall_score, 0) / results.length
  const pass_rate = results.filter(r => r.overall_score >= 8).length / results.length * 100
  
  const categoryScores: Record<string, number[]> = {}
  for (const result of results) {
    if (!categoryScores[result.category]) {
      categoryScores[result.category] = []
    }
    categoryScores[result.category].push(result.overall_score)
  }
  
  let bestCategory = ""
  let worstCategory = ""
  let bestAvg = 0
  let worstAvg = 10
  
  for (const [category, scores] of Object.entries(categoryScores)) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    if (avg > bestAvg) {
      bestAvg = avg
      bestCategory = category
    }
    if (avg < worstAvg) {
      worstAvg = avg
      worstCategory = category
    }
  }
  
  console.log("\n=== Summary ===")
  console.log(`Total Benchmarks: ${results.length}`)
  console.log(`Average Score:    ${average_score.toFixed(1)}/10`)
  console.log(`Pass Rate:        ${pass_rate.toFixed(0)}% (≥8.0)`)
  console.log(`Best Category:    ${bestCategory} (${bestAvg.toFixed(1)})`)
  console.log(`Worst Category:   ${worstCategory} (${worstAvg.toFixed(1)})`)
  
  return {
    version: "5.3.0",
    timestamp: new Date().toISOString(),
    total_benchmarks: results.length,
    average_score,
    pass_rate,
    best_category: bestCategory,
    worst_category: worstCategory,
    results,
  }
}

// Run if executed directly
if (require.main === module) {
  runAllBenchmarks()
    .then(summary => {
      console.log("\nBenchmark complete.")
      process.exit(summary.average_score >= 8 ? 0 : 1)
    })
    .catch(error => {
      console.error("Benchmark failed:", error)
      process.exit(1)
    })
}

export { runBenchmark, runAllBenchmarks }
export type { BenchmarkCase, BenchmarkResult, BenchmarkSummary }