/**
 * Workflow Engine - EXECUTABLE OBJECTS WITH STATES & TRANSITIONS
 * 
 * Workflows are executable objects with:
 * - States: pending, running, completed, failed, paused, blocked
 * - Transitions: valid state changes
 * - Validation: checks before transitions
 * - Completion: proper cleanup
 * 
 * State lives here, not in Orchestrator.
 */

import { Effect, Context, Layer } from "effect"
import { PlannerEngine, type DetailedPlan, type PlanStep } from "../planner"
import { AnalyticsLoader } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.workflow" }

// ─── Types ───────────────────────────────────────────────────────────────────

export type WorkflowStatus = "pending" | "running" | "completed" | "failed" | "paused" | "blocked" | "cancelled"

export interface WorkflowState {
  id: string
  planId: string
  goal: string
  workflow: string
  status: WorkflowStatus
  currentStep: string | undefined
  completedSteps: string[]
  failedSteps: string[]
  blockedSteps: string[]
  outputs: Record<string, unknown>
  errors: Record<string, string>
  startTime: Date
  endTime?: Date
  lastTransition: Date
  transitionHistory: Transition[]
}

export interface Transition {
  from: WorkflowStatus
  to: WorkflowStatus
  timestamp: Date
  reason: string
  stepId?: string
}

export interface WorkflowStatusInfo {
  status: WorkflowStatus
  progress: number
  currentStep: string | undefined
  completedSteps: number
  totalSteps: number
  failedSteps: number
  blockedSteps: number
  estimatedTimeRemaining: string
  canAdvance: boolean
  canPause: boolean
  canCancel: boolean
}

// ─── Valid Transitions ───────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  pending: ["running", "cancelled"],
  running: ["completed", "failed", "paused", "blocked", "cancelled"],
  completed: [],  // Terminal state
  failed: ["pending", "cancelled"],  // Can retry
  paused: ["running", "cancelled"],
  blocked: ["running", "cancelled"],
  cancelled: [],  // Terminal state
}

// ─── Workflow Interface ──────────────────────────────────────────────────────

export interface WorkflowInterface {
  readonly create: (plan: DetailedPlan) => Effect.Effect<WorkflowState>
  readonly start: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly advance: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly completeStep: (state: WorkflowState, stepId: string, output: unknown) => Effect.Effect<WorkflowState>
  readonly failStep: (state: WorkflowState, stepId: string, error: string) => Effect.Effect<WorkflowState>
  readonly blockStep: (state: WorkflowState, stepId: string, reason: string) -> Effect.Effect<WorkflowState>
  readonly pause: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly resume: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly cancel: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly retry: (state: WorkflowState) => Effect.Effect<WorkflowState>
  readonly getStatus: (state: WorkflowState) => Effect.Effect<WorkflowStatusInfo>
  readonly canTransition: (from: WorkflowStatus, to: WorkflowStatus) => boolean
  readonly getTransitionHistory: (state: WorkflowState) => Transition[]
}

export class WorkflowEngine extends Context.Service<WorkflowEngine, WorkflowInterface>()("@opendash/WorkflowEngine") {}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createTransition(from: WorkflowStatus, to: WorkflowStatus, reason: string, stepId?: string): Transition {
  return {
    from,
    to,
    timestamp: new Date(),
    reason,
    stepId,
  }
}

function calculateProgress(completedSteps: string[], totalSteps: number): number {
  if (totalSteps === 0) return 0
  return (completedSteps.length / totalSteps) * 100
}

function estimateTimeRemaining(completedSteps: number, totalSteps: number): string {
  const remaining = totalSteps - completedSteps
  const minutesRemaining = remaining * 15
  
  if (minutesRemaining > 60) {
    return `${Math.floor(minutesRemaining / 60)}-${Math.ceil(minutesRemaining / 60)} hours`
  }
  return `${minutesRemaining}-${minutesRemaining + 15} minutes`
}

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<WorkflowEngine, never, PlannerEngine.Service | AnalyticsLoader.Service> = Layer.effect(
  WorkflowEngine,
  Effect.gen(function* () {
    const planner = yield* PlannerEngine.Service
    const loader = yield* AnalyticsLoader.Service

    // Validate transition is allowed
    const canTransition = (from: WorkflowStatus, to: WorkflowStatus): boolean => {
      return VALID_TRANSITIONS[from]?.includes(to) ?? false
    }

    // Apply transition with validation
    const applyTransition = (
      state: WorkflowState,
      to: WorkflowStatus,
      reason: string,
      stepId?: string
    ): WorkflowState => {
      if (!canTransition(state.status, to)) {
        throw new Error(`Invalid transition: ${state.status} -> ${to}`)
      }
      
      const transition = createTransition(state.status, to, reason, stepId)
      
      return {
        ...state,
        status: to,
        lastTransition: new Date(),
        transitionHistory: [...state.transitionHistory, transition],
        endTime: to === "completed" || to === "failed" || to === "cancelled" ? new Date() : undefined,
      }
    }

    // Create workflow from plan
    const create = Effect.fn("create")(function* (plan: DetailedPlan) {
      const state: WorkflowState = {
        id: `workflow_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        planId: plan.goal,
        goal: plan.goal,
        workflow: plan.workflow,
        status: "pending",
        currentStep: plan.steps[0]?.id,
        completedSteps: [],
        failedSteps: [],
        blockedSteps: [],
        outputs: {},
        errors: {},
        startTime: new Date(),
        lastTransition: new Date(),
        transitionHistory: [createTransition("pending", "pending", "Workflow created")],
      }

      log.info("workflow created", {
        id: state.id,
        goal: state.goal,
        workflow: state.workflow,
        totalSteps: plan.steps.length,
      })

      return state
    })

    // Start workflow
    const start = Effect.fn("start")(function* (state: WorkflowState) {
      return applyTransition(state, "running", "Workflow started")
    })

    // Advance to next step
    const advance = Effect.fn("advance")(function* (state: WorkflowState) {
      // Find next step that isn't completed or failed
      const plan = yield* planner.plan({
        goal: state.goal,
        workflow: state.workflow,
        steps: [],
        requiredAgents: [],
        requiredTools: [],
        deliverables: [],
        estimatedComplexity: "low",
      })
      
      const nextStep = plan.steps.find(
        s => !state.completedSteps.includes(s.id) && !state.failedSteps.includes(s.id)
      )

      if (!nextStep) {
        // No more steps - complete workflow
        return applyTransition(state, "completed", "All steps completed")
      }

      return {
        ...state,
        currentStep: nextStep.id,
      }
    })

    // Complete a step
    const completeStep = Effect.fn("completeStep")(function* (
      state: WorkflowState,
      stepId: string,
      output: unknown
    ) {
      const newState = {
        ...state,
        completedSteps: [...state.completedSteps, stepId],
        outputs: {
          ...state.outputs,
          [stepId]: output,
        },
      }

      // Find next step
      const plan = yield* planner.plan({
        goal: state.goal,
        workflow: state.workflow,
        steps: [],
        requiredAgents: [],
        requiredTools: [],
        deliverables: [],
        estimatedComplexity: "low",
      })
      
      const nextStep = plan.steps.find(
        s => !newState.completedSteps.includes(s.id) && !newState.failedSteps.includes(s.id)
      )

      if (!nextStep) {
        return applyTransition(newState, "completed", "All steps completed", stepId)
      }

      return {
        ...newState,
        currentStep: nextStep.id,
      }
    })

    // Fail a step
    const failStep = Effect.fn("failStep")(function* (
      state: WorkflowState,
      stepId: string,
      error: string
    ) {
      const newState = {
        ...state,
        failedSteps: [...state.failedSteps, stepId],
        errors: {
          ...state.errors,
          [stepId]: error,
        },
      }

      return applyTransition(newState, "failed", `Step ${stepId} failed: ${error}`, stepId)
    })

    // Block a step
    const blockStep = Effect.fn("blockStep")(function* (
      state: WorkflowState,
      stepId: string,
      reason: string
    ) {
      const newState = {
        ...state,
        blockedSteps: [...state.blockedSteps, stepId],
      }

      return applyTransition(newState, "blocked", `Step ${stepId} blocked: ${reason}`, stepId)
    })

    // Pause workflow
    const pause = Effect.fn("pause")(function* (state: WorkflowState) {
      return applyTransition(state, "paused", "Workflow paused")
    })

    // Resume workflow
    const resume = Effect.fn("resume")(function* (state: WorkflowState) {
      return applyTransition(state, "running", "Workflow resumed")
    })

    // Cancel workflow
    const cancel = Effect.fn("cancel")(function* (state: WorkflowState) {
      return applyTransition(state, "cancelled", "Workflow cancelled")
    })

    // Retry failed workflow
    const retry = Effect.fn("retry")(function* (state: WorkflowState) {
      if (state.status !== "failed") {
        throw new Error("Can only retry failed workflows")
      }
      
      return {
        ...applyTransition(state, "pending", "Workflow retrying"),
        failedSteps: [],
        errors: {},
      }
    })

    // Get workflow status
    const getStatus = Effect.fn("getStatus")(function* (state: WorkflowState) {
      const plan = yield* planner.plan({
        goal: state.goal,
        workflow: state.workflow,
        steps: [],
        requiredAgents: [],
        requiredTools: [],
        deliverables: [],
        estimatedComplexity: "low",
      })
      
      const totalSteps = plan.steps.length
      
      return {
        status: state.status,
        progress: calculateProgress(state.completedSteps, totalSteps),
        currentStep: state.currentStep,
        completedSteps: state.completedSteps.length,
        totalSteps,
        failedSteps: state.failedSteps.length,
        blockedSteps: state.blockedSteps.length,
        estimatedTimeRemaining: estimateTimeRemaining(state.completedSteps.length, totalSteps),
        canAdvance: state.status === "running",
        canPause: state.status === "running",
        canCancel: ["pending", "running", "paused", "blocked"].includes(state.status),
      }
    })

    // Get transition history
    const getTransitionHistory = (state: WorkflowState): Transition[] => {
      return state.transitionHistory
    }

    return WorkflowEngine.of({
      create,
      start,
      advance,
      completeStep,
      failStep,
      blockStep,
      pause,
      resume,
      cancel,
      retry,
      getStatus,
      canTransition,
      getTransitionHistory,
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(PlannerEngine.defaultLayer),
  Layer.provide(AnalyticsLoader.defaultLayer)
)