/**
 * Analytics Memory - ISOLATED from General Conversation Memory
 * 
 * This memory is SEPARATE from OpenDash's general memory.
 * 
 * Stores:
 * - KPI definitions
 * - Business objectives
 * - Assumptions
 * - Stakeholders
 * - Hypotheses
 * - Previous analyses
 * - Data quality assessments
 * - Current workflow state
 * 
 * Does NOT store:
 * - General conversation history
 * - Tool outputs
 * - Code snippets
 * - File contents
 */

import { Effect, Context, Layer } from "effect"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.memory" }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AnalyticsContext {
  sessionId: string
  businessContext?: BusinessContext
  datasets: DatasetInfo[]
  kpis: KPI[]
  hypotheses: Hypothesis[]
  analyses: AnalysisResult[]
  models: ModelInfo[]
  assumptions: Assumption[]
  knownIssues: KnownIssue[]
  stakeholderPreferences: StakeholderPreferences
  previousRecommendations: Recommendation[]
  currentWorkflow?: string
  lastUpdated: Date
}

export interface BusinessContext {
  problemStatement: string
  stakeholders: string[]
  decisionType: string
  successCriteria: string[]
  constraints: string[]
  timeline: string
  budget: string
}

export interface DatasetInfo {
  name: string
  path: string
  format: string
  rows: number
  columns: number
  columnNames: string[]
  qualityScore: number
  auditReport: string
  lastRefreshed: Date
}

export interface KPI {
  id: string
  name: string
  formula: string
  currentValue: number
  targetValue: number
  trend: "up" | "down" | "flat" | "unknown"
  owner: string
  frequency: string
}

export interface Hypothesis {
  id: string
  statement: string
  type: string
  test: string
  status: "pending" | "testing" | "confirmed" | "rejected" | "inconclusive"
  confidence: number
  evidence: string[]
}

export interface AnalysisResult {
  id: string
  type: string
  date: string
  findings: string[]
  confidence: string
  agent: string
  workflowId: string
  toolsUsed: string[]
}

export interface ModelInfo {
  id: string
  name: string
  type: string
  performance: Record<string, number>
  features: string[]
  deploymentStatus: string
  lastTrained: Date
}

export interface Assumption {
  id: string
  statement: string
  source: string
  impact: "high" | "medium" | "low"
  validated: boolean
  validationMethod?: string
}

export interface KnownIssue {
  id: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  impact: string
  mitigation: string
  status: "open" | "mitigated" | "resolved"
}

export interface StakeholderPreferences {
  [stakeholder: string]: {
    preferredFormat: string
    audienceLevel: string
    focusAreas: string[]
    avoidTopics: string[]
  }
}

export interface Recommendation {
  id: string
  statement: string
  impact: string
  confidence: string
  status: "pending" | "accepted" | "rejected" | "implemented"
  date: string
}

// ─── Memory Interface ────────────────────────────────────────────────────────

export interface MemoryInterface {
  readonly create: (sessionId: string) => Effect.Effect<AnalyticsContext>
  readonly recall: (sessionId: string) => Effect.Effect<AnalyticsContext | undefined>
  readonly update: (sessionId: string, updates: Partial<AnalyticsContext>) => Effect.Effect<void>
  readonly delete: (sessionId: string) => Effect.Effect<void>
  readonly listSessions: () => Effect.Effect<string[]>
  
  // Business Context
  readonly setBusinessContext: (sessionId: string, context: BusinessContext) => Effect.Effect<void>
  readonly getBusinessContext: (sessionId: string) => Effect.Effect<BusinessContext | undefined>
  
  // Datasets
  readonly addDataset: (sessionId: string, dataset: DatasetInfo) => Effect.Effect<void>
  readonly getDatasets: (sessionId: string) => Effect.Effect<DatasetInfo[]>
  readonly updateDatasetQuality: (sessionId: string, datasetName: string, score: number) => Effect.Effect<void>
  
  // KPIs
  readonly addKPI: (sessionId: string, kpi: KPI) => Effect.Effect<void>
  readonly getKPIs: (sessionId: string) => Effect.Effect<KPI[]>
  readonly updateKPIValue: (sessionId: string, kpiId: string, value: number) => Effect.Effect<void>
  
  // Hypotheses
  readonly addHypothesis: (sessionId: string, hypothesis: Hypothesis) => Effect.Effect<void>
  readonly getHypotheses: (sessionId: string) => Effect.Effect<Hypothesis[]>
  readonly updateHypothesisStatus: (sessionId: string, hypothesisId: string, status: Hypothesis["status"]) => Effect.Effect<void>
  
  // Analyses
  readonly addAnalysis: (sessionId: string, analysis: AnalysisResult) => Effect.Effect<void>
  readonly getAnalyses: (sessionId: string) => Effect.Effect<AnalysisResult[]>
  
  // Models
  readonly addModel: (sessionId: string, model: ModelInfo) => Effect.Effect<void>
  readonly getModels: (sessionId: string) => Effect.Effect<ModelInfo[]>
  
  // Assumptions
  readonly addAssumption: (sessionId: string, assumption: Assumption) => Effect.Effect<void>
  readonly getAssumptions: (sessionId: string) => Effect.Effect<Assumption[]>
  readonly validateAssumption: (sessionId: string, assumptionId: string, validated: boolean) => Effect.Effect<void>
  
  // Known Issues
  readonly addKnownIssue: (sessionId: string, issue: KnownIssue) => Effect.Effect<void>
  readonly getKnownIssues: (sessionId: string) => Effect.Effect<KnownIssue[]>
  readonly resolveIssue: (sessionId: string, issueId: string) => Effect.Effect<void>
  
  // Recommendations
  readonly addRecommendation: (sessionId: string, recommendation: Recommendation) => Effect.Effect<void>
  readonly getRecommendations: (sessionId: string) => Effect.Effect<Recommendation[]>
  
  // Stakeholder Preferences
  readonly setStakeholderPreference: (sessionId: string, stakeholder: string, prefs: StakeholderPreferences[string]) => Effect.Effect<void>
  readonly getStakeholderPreferences: (sessionId: string) => Effect.Effect<StakeholderPreferences>
}

export class AnalyticsMemory extends Context.Service<AnalyticsMemory, MemoryInterface>()("@opendash/AnalyticsMemory") {}

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<AnalyticsMemory, never, never> = Layer.effect(
  AnalyticsMemory,
  Effect.gen(function* () {
    // ISOLATED storage - separate from general memory
    const storage = new Map<string, AnalyticsContext>()

    const createContext = (sessionId: string): AnalyticsContext => ({
      sessionId,
      datasets: [],
      kpis: [],
      hypotheses: [],
      analyses: [],
      models: [],
      assumptions: [],
      knownIssues: [],
      stakeholderPreferences: {},
      previousRecommendations: [],
      lastUpdated: new Date(),
    })

    return AnalyticsMemory.of({
      create: (sessionId: string) =>
        Effect.gen(function* () {
          const context = createContext(sessionId)
          storage.set(sessionId, context)
          log.info("created analytics context", { sessionId })
          return context
        }),

      recall: (sessionId: string) =>
        Effect.succeed(storage.get(sessionId)),

      update: (sessionId: string, updates: Partial<AnalyticsContext>) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          storage.set(sessionId, {
            ...existing,
            ...updates,
            sessionId,
            lastUpdated: new Date(),
          })
        }),

      delete: (sessionId: string) =>
        Effect.gen(function* () {
          storage.delete(sessionId)
          log.info("deleted analytics context", { sessionId })
        }),

      listSessions: () =>
        Effect.succeed(Array.from(storage.keys())),

      setBusinessContext: (sessionId: string, context: BusinessContext) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.businessContext = context
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getBusinessContext: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.businessContext
        }),

      addDataset: (sessionId: string, dataset: DatasetInfo) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.datasets.push(dataset)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getDatasets: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.datasets || []
        }),

      updateDatasetQuality: (sessionId: string, datasetName: string, score: number) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          if (!context) return
          const dataset = context.datasets.find(d => d.name === datasetName)
          if (dataset) {
            dataset.qualityScore = score
            context.lastUpdated = new Date()
          }
        }),

      addKPI: (sessionId: string, kpi: KPI) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.kpis.push(kpi)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getKPIs: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.kpis || []
        }),

      updateKPIValue: (sessionId: string, kpiId: string, value: number) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          if (!context) return
          const kpi = context.kpis.find(k => k.id === kpiId)
          if (kpi) {
            kpi.currentValue = value
            context.lastUpdated = new Date()
          }
        }),

      addHypothesis: (sessionId: string, hypothesis: Hypothesis) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.hypotheses.push(hypothesis)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getHypotheses: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.hypotheses || []
        }),

      updateHypothesisStatus: (sessionId: string, hypothesisId: string, status: Hypothesis["status"]) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          if (!context) return
          const hypothesis = context.hypotheses.find(h => h.id === hypothesisId)
          if (hypothesis) {
            hypothesis.status = status
            context.lastUpdated = new Date()
          }
        }),

      addAnalysis: (sessionId: string, analysis: AnalysisResult) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.analyses.push(analysis)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getAnalyses: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.analyses || []
        }),

      addModel: (sessionId: string, model: ModelInfo) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.models.push(model)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getModels: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.models || []
        }),

      addAssumption: (sessionId: string, assumption: Assumption) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.assumptions.push(assumption)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getAssumptions: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.assumptions || []
        }),

      validateAssumption: (sessionId: string, assumptionId: string, validated: boolean) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          if (!context) return
          const assumption = context.assumptions.find(a => a.id === assumptionId)
          if (assumption) {
            assumption.validated = validated
            context.lastUpdated = new Date()
          }
        }),

      addKnownIssue: (sessionId: string, issue: KnownIssue) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.knownIssues.push(issue)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getKnownIssues: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.knownIssues || []
        }),

      resolveIssue: (sessionId: string, issueId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          if (!context) return
          const issue = context.knownIssues.find(i => i.id === issueId)
          if (issue) {
            issue.status = "resolved"
            context.lastUpdated = new Date()
          }
        }),

      addRecommendation: (sessionId: string, recommendation: Recommendation) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.previousRecommendations.push(recommendation)
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getRecommendations: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.previousRecommendations || []
        }),

      setStakeholderPreference: (sessionId: string, stakeholder: string, prefs: StakeholderPreferences[string]) =>
        Effect.gen(function* () {
          const existing = storage.get(sessionId) || createContext(sessionId)
          existing.stakeholderPreferences[stakeholder] = prefs
          existing.lastUpdated = new Date()
          storage.set(sessionId, existing)
        }),

      getStakeholderPreferences: (sessionId: string) =>
        Effect.gen(function* () {
          const context = storage.get(sessionId)
          return context?.stakeholderPreferences || {}
        }),
    })
  })
)

export const defaultLayer = layer