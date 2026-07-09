/**
 * Planner Engine
 * 
 * Produces execution plans before the LLM starts.
 * 
 * Responsibilities:
 * - Take execution plan from orchestrator
 * - Produce detailed execution steps
 * - Define required files, tools, and execution order
 * - Define deliverables
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsOrchestrator, type ExecutionPlan } from "../orchestrator"
import { AnalyticsLoader } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.planner" }

// Detailed plan
export interface DetailedPlan {
  goal: string
  workflow: string
  steps: PlanStep[]
  requiredFiles: string[]
  requiredTools: string[]
  executionOrder: string[]
  deliverables: string[]
  estimatedTime: string
  complexity: "low" | "medium" | "high"
}

// Plan step
export interface PlanStep {
  id: string
  agent: string
  task: string
  description: string
  inputs: string[]
  outputs: string[]
  tools: string[]
  blocking: boolean
  estimatedDuration: string
}

// Planner interface
export interface PlannerInterface {
  readonly plan: (executionPlan: ExecutionPlan) => Effect.Effect<DetailedPlan>
  readonly getStepById: (plan: DetailedPlan, stepId: string) => PlanStep | undefined
  readonly getNextStep: (plan: DetailedPlan, completedSteps: string[]) => PlanStep | undefined
}

// Service class
export class PlannerEngine extends Context.Service<PlannerEngine, PlannerInterface>()("@opendash/PlannerEngine") {}

// Agent to tool mapping
const AGENT_TOOLS: Record<string, string[]> = {
  "business-consultant": ["read", "write"],
  "data-auditor": ["python", "bash", "read"],
  "data-cleaner": ["python", "bash", "write"],
  "data-analyst": ["python", "bash", "read", "write"],
  "statistician": ["python", "bash"],
  "feature-engineer": ["python", "bash", "write"],
  "data-scientist": ["python", "bash", "write"],
  "forecast-engineer": ["python", "bash", "write"],
  "ml-engineer": ["python", "bash", "write"],
  "sql-expert": ["bash", "read"],
  "python-engineer": ["python", "bash", "write"],
  "dashboard-designer": ["python", "write"],
  "report-writer": ["read", "write"],
  "executive-advisor": ["read"],
}

// Estimate duration based on task
function estimateDuration(task: string): string {
  if (task.includes("audit")) return "5-10 minutes"
  if (task.includes("clean")) return "10-15 minutes"
  if (task.includes("analysis") || task.includes("eda")) return "15-30 minutes"
  if (task.includes("model") || task.includes("forecast")) return "30-60 minutes"
  if (task.includes("report")) return "10-20 minutes"
  return "10-20 minutes"
}

// Implementation
const layer: Layer.Layer<PlannerEngine, never, AnalyticsOrchestrator.Service | AnalyticsLoader.Service> = Layer.effect(
  PlannerEngine,
  Effect.gen(function* () {
    const orchestrator = yield* AnalyticsOrchestrator.Service
    const loader = yield* AnalyticsLoader.Service

    return PlannerEngine.of({
      plan: (executionPlan: ExecutionPlan) =>
        Effect.gen(function* () {
          // Validate the plan
          const validation = yield* orchestrator.validate(executionPlan)
          if (!validation.valid) {
            log.warn("plan validation failed", { issues: validation.issues })
          }

          // Get agent information
          const agents = yield* loader.getAgents()

          // Create detailed steps
          const steps: PlanStep[] = executionPlan.phases.map(phase => {
            const agent = agents[phase.agent]
            const tools = AGENT_TOOLS[phase.agent] || ["bash"]

            return {
              id: phase.id,
              agent: phase.agent,
              task: phase.task,
              description: agent?.responsibility || phase.task,
              inputs: phase.inputs,
              outputs: phase.outputs,
              tools,
              blocking: phase.blocking,
              estimatedDuration: estimateDuration(phase.task),
            }
          })

          // Collect all required tools
          const allTools = new Set<string>()
          for (const step of steps) {
            for (const tool of step.tools) {
              allTools.add(tool)
            }
          }

          // Collect all deliverables
          const deliverables = executionPlan.deliverables.length > 0
            ? executionPlan.deliverables
            : steps.flatMap(s => s.outputs)

          // Calculate total estimated time
          const totalMinutes = steps.length * 15 // Rough estimate
          const estimatedTime = totalMinutes > 60
            ? `${Math.floor(totalMinutes / 60)}-${Math.ceil(totalMinutes / 60)} hours`
            : `${totalMinutes}-${totalMinutes + 15} minutes`

          const detailedPlan: DetailedPlan = {
            goal: executionPlan.goal,
            workflow: executionPlan.workflow,
            steps,
            requiredFiles: [],
            requiredTools: Array.from(allTools),
            executionOrder: steps.map(s => s.id),
            deliverables,
            estimatedTime,
            complexity: executionPlan.estimatedComplexity,
          }

          log.info("created detailed plan", {
            goal: detailedPlan.goal,
            steps: detailedPlan.steps.length,
            complexity: detailedPlan.complexity,
            estimatedTime: detailedPlan.estimatedTime,
          })

          return detailedPlan
        }),

      getStepById: (plan: DetailedPlan, stepId: string) => {
        return plan.steps.find(s => s.id === stepId)
      },

      getNextStep: (plan: DetailedPlan, completedSteps: string[]) => {
        for (const step of plan.steps) {
          if (!completedSteps.includes(step.id)) {
            // Check if all blocking dependencies are met
            const dependencies = plan.steps
              .filter(s => s.blocking && !completedSteps.includes(s.id))
              .map(s => s.id)
            
            if (dependencies.length === 0 || dependencies.every(d => completedSteps.includes(d))) {
              return step
            }
          }
        }
        return undefined
      },
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsOrchestrator.defaultLayer),
  Layer.provide(AnalyticsLoader.defaultLayer)
)