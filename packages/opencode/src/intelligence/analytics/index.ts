/**
 * Data OS Analytics Intelligence Layer - MAIN ENTRY
 * 
 * Phase 1: Intelligence Foundation
 * - Analytical Reasoning Engine
 * - Business problem decomposition
 * - Hypothesis generation
 * - Root cause reasoning
 * - Statistical decision logic
 * - Confidence calibration
 * - Decision tree for workflow selection
 * - Business-first reasoning (not tool-first)
 * 
 * Core Principle:
 * "Sales dropped by 18%" should trigger reasoning BEFORE code generation.
 */

import { Effect, Layer, Context } from "effect"
import { AnalyticsLoader } from "./loader"
import { CapabilityRegistry } from "./registry"
import { AnalyticsRouter, type ClassificationResult, type RouteDecision } from "./router"
import { AnalyticsOrchestrator, type ExecutionPlan } from "./orchestrator"
import { PlannerEngine, type DetailedPlan } from "./planner"
import { WorkflowEngine, type WorkflowState } from "./workflow"
import { EngineRegistry } from "./engine"
import { AnalyticsMemory, type AnalyticsContext } from "./memory"
import { AnalyticsPromptBuilder, type AnalyticsPrompt } from "./prompt"
import { AnalyticsAdapters } from "./adapters"
import { AnalyticalReasoning, type ReasoningResult } from "./reasoning"

// ─── Main Interface ──────────────────────────────────────────────────────────

export interface AnalyticsIntelligenceInterface {
  // Phase 1: Reasoning (Business-first)
  readonly reason: (request: string, context?: AnalyticsContext) => Effect.Effect<ReasoningResult>
  
  // Core pipeline
  readonly classify: (request: string) => Effect.Effect<ClassificationResult>
  readonly route: (classification: ClassificationResult) => Effect.Effect<RouteDecision>
  readonly orchestrate: (route: RouteDecision) => Effect.Effect<ExecutionPlan>
  readonly plan: (executionPlan: ExecutionPlan) => Effect.Effect<DetailedPlan>
  readonly buildPrompt: (plan: DetailedPlan, context?: AnalyticsContext) => Effect.Effect<AnalyticsPrompt>
  
  // Workflow execution
  readonly createWorkflow: (plan: DetailedPlan) => Effect.Effect<WorkflowState>
  readonly startWorkflow: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly completeStep: (state: WorkflowState, stepId: string, output: unknown) => Effect.Effect<WorkflowState>
  readonly failStep: (state: WorkflowState, stepId: string, error: string) => Effect.Effect<WorkflowState>
  
  // Memory
  readonly remember: (context: AnalyticsContext) => Effect.Effect<void>
  readonly recall: (sessionId: string) => Effect.Effect<AnalyticsContext | undefined>
  
  // Explain (for debugging)
  readonly explain: (request: string) => Effect.Effect<ExplainResult>
  
  // Full pipeline with reasoning
  readonly process: (request: string, sessionId: string) => Effect.Effect<ProcessResult>
}

export interface ExplainResult {
  chosenWorkflows: string[]
  chosenEngines: string[]
  reason: string
  requiredTools: string[]
  confidence: number
  matchedCapabilities: string[]
  multipleCapabilitiesDetected: boolean
}

export interface ProcessResult {
  reasoning: ReasoningResult
  classification: ClassificationResult
  route: RouteDecision
  executionPlan: ExecutionPlan
  detailedPlan: DetailedPlan
  prompt: AnalyticsPrompt
  workflow?: WorkflowState
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class AnalyticsIntelligence extends Context.Service<AnalyticsIntelligence, AnalyticsIntelligenceInterface>()("@opendash/AnalyticsIntelligence") {}

// ─── Layer ───────────────────────────────────────────────────────────────────

const layer = Layer.effect(
  AnalyticsIntelligence,
  Effect.gen(function* () {
    const loader = yield* AnalyticsLoader.Service
    const registry = yield* CapabilityRegistry.Service
    const router = yield* AnalyticsRouter.Service
    const orchestrator = yield* AnalyticsOrchestrator.Service
    const planner = yield* PlannerEngine.Service
    const workflowEngine = yield* WorkflowEngine.Service
    const memory = yield* AnalyticsMemory.Service
    const promptBuilder = yield* AnalyticsPromptBuilder.Service
    const reasoning = yield* AnalyticalReasoning.Service

    // Initialize loader on startup
    yield* loader.load()

    return AnalyticsIntelligence.of({
      // Phase 1: Reasoning (Business-first)
      reason: (request: string, context?: AnalyticsContext) =>
        reasoning.reason(request, context),
      
      // Core pipeline
      classify: (request: string) => router.classify(request),
      
      route: (classification: ClassificationResult) => router.route(classification),
      
      orchestrate: (route: RouteDecision) => orchestrator.orchestrate(route),
      
      plan: (executionPlan: ExecutionPlan) => planner.plan(executionPlan),
      
      buildPrompt: (plan: DetailedPlan, context?: AnalyticsContext) =>
        promptBuilder.build(plan, context),
      
      createWorkflow: (plan: DetailedPlan) => workflowEngine.create(plan),
      
      startWorkflow: (state: WorkflowState) => workflowEngine.start(state),
      
      completeStep: (state: WorkflowState, stepId: string, output: unknown) =>
        workflowEngine.completeStep(state, stepId, output),
      
      failStep: (state: WorkflowState, stepId: string, error: string) =>
        workflowEngine.failStep(state, stepId, error),
      
      remember: (context: AnalyticsContext) =>
        memory.update(context.sessionId, context),
      
      recall: (sessionId: string) => memory.recall(sessionId),
      
      explain: (request: string) => router.explain(request),
      
      // Full pipeline with reasoning FIRST
      process: (request: string, sessionId: string) =>
        Effect.gen(function* () {
          // 1. REASON FIRST (Business-first, not tool-first)
          const reasoningResult = yield* reasoning.reason(request)
          
          // 2. Classify
          const classification = yield* router.classify(request)
          
          // 3. Route (using reasoning insights)
          const route = yield* router.route(classification)
          
          // 4. Orchestrate
          const executionPlan = yield* orchestrator.orchestrate(route)
          
          // 5. Plan
          const detailedPlan = yield* planner.plan(executionPlan)
          
          // 6. Recall memory
          const context = yield* memory.recall(sessionId)
          
          // 7. Build prompt (with reasoning context)
          const prompt = yield* promptBuilder.build(detailedPlan, context)
          
          // 8. Create workflow
          const workflow = yield* workflowEngine.create(detailedPlan)
          
          return {
            reasoning: reasoningResult,
            classification,
            route,
            executionPlan,
            detailedPlan,
            prompt,
            workflow,
          }
        }),
    })
  })
)

// ─── Default Layer ───────────────────────────────────────────────────────────

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsLoader.defaultLayer),
  Layer.provide(CapabilityRegistry.defaultLayer),
  Layer.provide(AnalyticsRouter.defaultLayer),
  Layer.provide(AnalyticsOrchestrator.defaultLayer),
  Layer.provide(PlannerEngine.defaultLayer),
  Layer.provide(WorkflowEngine.defaultLayer),
  Layer.provide(EngineRegistry.defaultLayer),
  Layer.provide(AnalyticsMemory.defaultLayer),
  Layer.provide(AnalyticsPromptBuilder.defaultLayer),
  Layer.provide(AnalyticsAdapters.defaultLayer),
  Layer.provide(AnalyticalReasoning.defaultLayer)
)

export * as Analytics from "./index"