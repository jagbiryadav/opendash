/**
 * Enterprise Capabilities - 4 Missing Professional Features
 * 
 * 1. Verification Layer - Mark hypotheses as Verified/Rejected/Inconclusive
 * 2. Evidence Graph - Traceable evidence chain
 * 3. Business Decision Tree - Internal decision routing
 * 4. Executive Narrative - SCQA/Pyramid Principle
 */

import { Log } from "../../../util"

const log = Log.create({ service: "analytics.enterprise-capabilities" }

// ─── 1. Verification Layer ───────────────────────────────────────────────────

export type VerificationStatus = "Verified" | "Rejected" | "Inconclusive" | "Pending"

export interface HypothesisVerification {
  hypothesisId: string
  statement: string
  status: VerificationStatus
  evidence: string[]
  statisticalResult?: string
  pValue?: number
  confidenceInterval?: string
  conclusion: string
  nextAction: string
}

export function verifyHypothesis(
  hypothesisId: string,
  statement: string,
  statisticalResults: { pValue?: number; confidenceInterval?: string; testUsed?: string }
): HypothesisVerification {
  let status: VerificationStatus = "Pending"
  let conclusion = ""
  let nextAction = ""
  
  if (statisticalResults.pValue !== undefined) {
    if (statisticalResults.pValue < 0.05) {
      status = "Verified"
      conclusion = `Statistically significant (p=${statisticalResults.pValue})`
      nextAction = "Accept hypothesis and proceed to recommendations"
    } else if (statisticalResults.pValue < 0.10) {
      status = "Inconclusive"
      conclusion = `Marginally significant (p=${statisticalResults.pValue})`
      nextAction = "Collect more data or consider alternative explanations"
    } else {
      status = "Rejected"
      conclusion = `Not statistically significant (p=${statisticalResults.pValue})`
      nextAction = "Reject hypothesis and move to next"
    }
  } else {
    status = "Inconclusive"
    conclusion = "No statistical test performed"
    nextAction = "Conduct appropriate statistical test"
  }
  
  return {
    hypothesisId,
    statement,
    status,
    evidence: [],
    statisticalResult: statisticalResults.testUsed,
    pValue: statisticalResults.pValue,
    confidenceInterval: statisticalResults.confidenceInterval,
    conclusion,
    nextAction,
  }
}

export function formatVerification(verification: HypothesisVerification): string {
  const statusIcon = verification.status === "Verified" ? "✓" : 
                    verification.status === "Rejected" ? "✗" : "?"
  
  return [
    `### ${verification.hypothesisId}: ${verification.statement}`,
    ``,
    `**Status:** ${statusIcon} ${verification.status}`,
    `**Conclusion:** ${verification.conclusion}`,
    verification.pValue ? `**p-value:** ${verification.pValue}` : null,
    verification.confidenceInterval ? `**Confidence Interval:** ${verification.confidenceInterval}` : null,
    verification.statisticalResult ? `**Test Used:** ${verification.statisticalResult}` : null,
    `**Next Action:** ${verification.nextAction}`,
  ].filter(Boolean).join("\n")
}

// ─── 2. Evidence Graph ───────────────────────────────────────────────────────

export interface EvidenceNode {
  id: string
  type: "data" | "analysis" | "observation" | "statistic" | "insight"
  content: string
  source: string
}

export interface EvidenceEdge {
  from: string
  to: string
  relationship: "supports" | "contradicts" | "leads_to" | "measures"
  strength: "strong" | "moderate" | "weak"
}

export interface EvidenceGraph {
  nodes: EvidenceNode[]
  edges: EvidenceEdge[]
  traceable: boolean
}

export function buildEvidenceGraph(
  dataPoints: string[],
  analyses: string[],
  observations: string[],
  conclusions: string[],
  recommendations: string[]
): EvidenceGraph {
  const nodes: EvidenceNode[] = []
  const edges: EvidenceEdge[] = []
  
  // Add data nodes
  dataPoints.forEach((dp, i) => {
    nodes.push({ id: `data_${i}`, type: "data", content: dp, source: "dataset" })
  })
  
  // Add analysis nodes
  analyses.forEach((a, i) => {
    nodes.push({ id: `analysis_${i}`, type: "analysis", content: a, source: "statistical test" })
    // Connect analyses to data
    if (i < dataPoints.length) {
      edges.push({ from: `data_${i}`, to: `analysis_${i}`, relationship: "measures", strength: "strong" })
    }
  })
  
  // Add observation nodes
  observations.forEach((o, i) => {
    nodes.push({ id: `observation_${i}`, type: "observation", content: o, source: "analysis" })
    // Connect observations to analyses
    if (i < analyses.length) {
      edges.push({ from: `analysis_${i}`, to: `observation_${i}`, relationship: "leads_to", strength: "strong" })
    }
  })
  
  // Add conclusion nodes
  conclusions.forEach((c, i) => {
    nodes.push({ id: `conclusion_${i}`, type: "insight", content: c, source: "synthesis" })
    // Connect conclusions to observations
    if (i < observations.length) {
      edges.push({ from: `observation_${i}`, to: `conclusion_${i}`, relationship: "supports", strength: "strong" })
    }
  })
  
  // Add recommendation nodes
  recommendations.forEach((r, i) => {
    nodes.push({ id: `recommendation_${i}`, type: "insight", content: r, source: "conclusion" })
    // Connect recommendations to conclusions
    if (i < conclusions.length) {
      edges.push({ from: `conclusion_${i}`, to: `recommendation_${i}`, relationship: "leads_to", strength: "strong" })
    }
  })
  
  return { nodes, edges, traceable: true }
}

export function traceRecommendation(graph: EvidenceGraph, recommendationId: string): string[] {
  const trace: string[] = []
  const visited = new Set<string>()
  
  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    
    const node = graph.nodes.find(n => n.id === nodeId)
    if (node) {
      trace.unshift(`[${node.type}] ${node.content}`)
    }
    
    // Find incoming edges
    const incomingEdges = graph.edges.filter(e => e.to === nodeId)
    for (const edge of incomingEdges) {
      traverse(edge.from)
    }
  }
  
  traverse(recommendationId)
  return trace
}

export function formatEvidenceGraph(graph: EvidenceGraph): string {
  const lines = ["## Evidence Graph", ""]
  
  // Group by type
  const byType = {
    data: graph.nodes.filter(n => n.type === "data"),
    analysis: graph.nodes.filter(n => n.type === "analysis"),
    observation: graph.nodes.filter(n => n.type === "observation"),
    insight: graph.nodes.filter(n => n.type === "insight"),
  }
  
  lines.push("### Data Points")
  byType.data.forEach(n => lines.push(`- ${n.content}`))
  lines.push("")
  
  lines.push("### Analyses Performed")
  byType.analysis.forEach(n => lines.push(`- ${n.content}`))
  lines.push("")
  
  lines.push("### Key Observations")
  byType.observation.forEach(n => lines.push(`- ${n.content}`))
  lines.push("")
  
  lines.push("### Insights & Conclusions")
  byType.insight.forEach(n => lines.push(`- ${n.content}`))
  lines.push("")
  
  lines.push("### Evidence Flow")
  lines.push("```")
  lines.push("Data → Analysis → Observation → Conclusion → Recommendation")
  lines.push("```")
  
  return lines.join("\n")
}

// ─── 3. Business Decision Tree ───────────────────────────────────────────────

export interface DecisionNode {
  id: string
  question: string
  yesBranch?: string
  noBranch?: string
  conclusion?: string
  action?: string
}

export interface BusinessDecisionTree {
  name: string
  root: string
  nodes: Record<string, DecisionNode>
}

export function buildRevenueDecisionTree(): BusinessDecisionTree {
  return {
    name: "Revenue Decline Decision Tree",
    root: "revenue_check",
    nodes: {
      revenue_check: {
        id: "revenue_check",
        question: "Is revenue declining?",
        yesBranch: "traffic_check",
        noBranch: "growth_analysis",
      },
      traffic_check: {
        id: "traffic_check",
        question: "Is traffic declining?",
        yesBranch: "marketing_check",
        noBranch: "conversion_check",
      },
      marketing_check: {
        id: "marketing_check",
        question: "Is marketing spend reduced?",
        yesBranch: "restore_marketing",
        noBranch: "marketing_efficiency",
      },
      restore_marketing: {
        id: "restore_marketing",
        question: "",
        conclusion: "Marketing reduction is primary cause",
        action: "Restore marketing budget",
      },
      marketing_efficiency: {
        id: "marketing_efficiency",
        question: "Is marketing efficiency declining?",
        yesBranch: "optimize_targeting",
        noBranch: "market_decline",
      },
      optimize_targeting: {
        id: "optimize_targeting",
        question: "",
        conclusion: "Marketing targeting needs optimization",
        action: "Review and optimize targeting strategy",
      },
      market_decline: {
        id: "market_decline",
        question: "",
        conclusion: "Market-wide decline affecting all players",
        action: "Monitor market conditions and adjust strategy",
      },
      conversion_check: {
        id: "conversion_check",
        question: "Is conversion rate declining?",
        yesBranch: "ux_check",
        noBranch: "aov_check",
      },
      ux_check: {
        id: "ux_check",
        question: "Were there recent UX changes?",
        yesBranch: "revert_ux",
        noBranch: "pricing_check",
      },
      revert_ux: {
        id: "revert_ux",
        question: "",
        conclusion: "UX changes negatively impacted conversion",
        action: "Revert or iterate on UX changes",
      },
      pricing_check: {
        id: "pricing_check",
        question: "Were prices increased?",
        yesBranch: "price_sensitivity",
        noBranch: "competition_check",
      },
      price_sensitivity: {
        id: "price_sensitivity",
        question: "",
        conclusion: "Price increase reduced conversion",
        action: "Consider price adjustment or value communication",
      },
      competition_check: {
        id: "competition_check",
        question: "Did competitors launch new offerings?",
        yesBranch: "competitive_response",
        noBranch: "investigate_further",
      },
      competitive_response: {
        id: "competitive_response",
        question: "",
        conclusion: "Competitive pressure is affecting conversion",
        action: "Develop competitive response strategy",
      },
      investigate_further: {
        id: "investigate_further",
        question: "",
        conclusion: "Root cause unclear - needs deeper investigation",
        action: "Conduct comprehensive analysis",
      },
      aov_check: {
        id: "aov_check",
        question: "Is average order value declining?",
        yesBranch: "product_mix",
        noBranch: "other_factors",
      },
      product_mix: {
        id: "product_mix",
        question: "",
        conclusion: "Product mix shifted to lower-priced items",
        action: "Review pricing and product strategy",
      },
      other_factors: {
        id: "other_factors",
        question: "",
        conclusion: "Multiple small factors contributing",
        action: "Monitor all metrics and address each",
      },
      growth_analysis: {
        id: "growth_analysis",
        question: "",
        conclusion: "Revenue is not declining",
        action: "Focus on growth opportunities",
      },
    },
  }
}

export function traverseDecisionTree(tree: BusinessDecisionTree, answers: Record<string, "yes" | "no">): string[] {
  const path: string[] = []
  let currentId = tree.root
  
  while (currentId) {
    const node = tree.nodes[currentId]
    if (!node) break
    
    path.push(node.question)
    
    if (node.conclusion) {
      path.push(`Conclusion: ${node.conclusion}`)
      path.push(`Action: ${node.action}`)
      break
    }
    
    const answer = answers[currentId]
    if (!answer) break
    
    currentId = answer === "yes" ? node.yesBranch! : node.noBranch!
  }
  
  return path
}

export function formatDecisionTree(tree: BusinessDecisionTree, path: string[]): string {
  const lines = [`## ${tree.name}`, ""]
  
  lines.push("### Decision Path")
  path.forEach((step, i) => {
    const indent = "  ".repeat(i)
    lines.push(`${indent}${step}`)
  })
  
  lines.push("")
  lines.push("### Full Tree")
  lines.push("```")
  Object.values(tree.nodes).forEach(node => {
    if (node.conclusion) {
      lines.push(`${node.id}: ${node.conclusion}`)
    } else {
      lines.push(`${node.id}: ${node.question}`)
      lines.push(`  YES → ${node.yesBranch}`)
      lines.push(`  NO → ${node.noBranch}`)
    }
  })
  lines.push("```")
  
  return lines.join("\n")
}

// ─── 4. Executive Narrative (SCQA/Pyramid Principle) ────────────────────────

export interface ExecutiveNarrative {
  situation: string
  complication: string
  question: string
  answer: string
  recommendations: string[]
  impact: string
  risk: string
  decision: string
}

export function buildExecutiveNarrative(
  problem: string,
  findings: string[],
  recommendations: string[],
  impact: string,
  risk: string
): ExecutiveNarrative {
  return {
    situation: `The business is experiencing ${problem}`,
    complication: "This requires immediate attention to prevent further impact",
    question: "What is causing this and what should we do?",
    answer: findings[0] || "Analysis is needed to determine root cause",
    recommendations,
    impact,
    risk,
    decision: recommendations[0] || "Conduct detailed analysis",
  }
}

export function formatCEOVersion(narrative: ExecutiveNarrative): string {
  return [
    `## Executive Summary`,
    ``,
    `**Situation:** ${narrative.situation}`,
    ``,
    `**Complication:** ${narrative.complication}`,
    ``,
    `**Key Question:** ${narrative.question}`,
    ``,
    `**Answer:** ${narrative.answer}`,
    ``,
    `**Recommendations:**`,
    ...narrative.recommendations.map(r => `- ${r}`),
    ``,
    `**Expected Impact:** ${narrative.impact}`,
    ``,
    `**Risks:** ${narrative.risk}`,
    ``,
    `**Decision Needed:** ${narrative.decision}`,
  ].join("\n")
}

export function formatDirectorVersion(narrative: ExecutiveNarrative, kpis: string[]): string {
  return [
    `## Director Report`,
    ``,
    `### Business Context`,
    narrative.situation,
    ``,
    `### Key Metrics`,
    ...kpis.map(k => `- ${k}`),
    ``,
    `### Root Cause`,
    narrative.answer,
    ``,
    `### Actions Required`,
    ...narrative.recommendations.map(r => `- ${r}`),
    ``,
    `### Timeline & Resources`,
    narrative.impact,
  ].join("\n")
}

export function formatAnalystVersion(narrative: ExecutiveNarrative, methodology: string, dataSources: string[]): string {
  return [
    `## Analyst Report`,
    ``,
    `### Methodology`,
    methodology,
    ``,
    `### Data Sources`,
    ...dataSources.map(d => `- ${d}`),
    ``,
    `### Findings`,
    narrative.answer,
    ``,
    `### Statistical Results`,
    `[Detailed statistical results]`,
    ``,
    `### Recommendations`,
    ...narrative.recommendations.map(r => `- ${r}`),
  ].join("\n")
}

export function formatTechnicalAppendix(
  methodology: string,
  assumptions: string[],
  limitations: string[],
  code: string
): string {
  return [
    `## Technical Appendix`,
    ``,
    `### Methodology`,
    methodology,
    ``,
    `### Assumptions`,
    ...assumptions.map(a => `- ${a}`),
    ``,
    `### Limitations`,
    ...limitations.map(l => `- ${l}`),
    ``,
    `### Code & Reproducibility`,
    "```",
    code,
    "```",
  ].join("\n")
}