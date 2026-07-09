/**
 * Analytics Orchestrator (CAO) - STATELESS, DATA-DRIVEN
 * 
 * The brain that:
 * - Understands business problems
 * - Decomposes tasks
 * - Loads workflows from markdown (not hardcoded)
 * - Builds execution plans
 * - Validates plans
 * 
 * STATELESS: All state lives in Memory, Session, or Workflow.
 * Orchestrator produces plans, never mutates itself.
 */

import { Effect, Context, Layer } from "effect"
import { CapabilityRegistry } from "../registry"
import { AnalyticsLoader, type LoadedWorkflow, type LoadedAgent, type LoadedCapability } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.orchestrator" }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExecutionPlan {
  goal: string
  capabilities: string[]
  workflows: string[]
  phases: ExecutionPhase[]
  requiredAgents: string[]
  requiredTools: string[]
  deliverables: string[]
  estimatedComplexity: "low" | "medium" | "high"
  metadata: PlanMetadata
}

export interface ExecutionPhase {
  id: string
  agent: string
  task: string
  description: string
  inputs: string[]
  outputs: string[]
  blocking: boolean
  condition?: string
  workflowSource: string  // Which markdown file this came from
}

export interface PlanMetadata {
  source: string
  timestamp: Date
  confidence: number
  multipleCapabilities: boolean
  reasoning: string
}

export interface ValidationResult {
  valid: boolean
  issues: string[]
  recommendations: string[]
  missingAgents: string[]
  missingTools: string[]
}

// ─── Route Decision (from Router) ────────────────────────────────────────────

export interface RouteDecision {
  type: "analytics" | "general" | "clarify" | "fallback"
  capabilities: Array<{
    capability: LoadedCapability
    score: number
    confidence: number
  }>
  primaryCapability?: string
  workflows: string[]
  agents: string[]
  tools: string[]
  confidence: number
  explanation: string
}

// ─── Orchestrator Interface ──────────────────────────────────────────────────

export interface OrchestratorInterface {
  readonly orchestrate: (route: RouteDecision) => Effect.Effect<ExecutionPlan>
  readonly mergeWorkflows: (workflows: LoadedWorkflow[]) => ExecutionPhase[]
  readonly validate: (plan: ExecutionPlan) => Effect.Effect<ValidationResult>
  readonly explainPlan: (plan: ExecutionPlan) => string
}

export class AnalyticsOrchestrator extends Context.Service<AnalyticsOrchestrator, OrchestratorInterface>()("@opendash/AnalyticsOrchestrator") {}

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<AnalyticsOrchestrator, never, CapabilityRegistry.Service | AnalyticsLoader.Service> = Layer.effect(
  AnalyticsOrchestrator,
  Effect.gen(function* () {
    const capRegistry = yield* CapabilityRegistry.Service
    const loader = yield* AnalyticsLoader.Service

    // Merge multiple workflows into a single execution plan
    const mergeWorkflows = Effect.fn("mergeWorkflows")(function* (workflows: LoadedWorkflow[]) {
      const phases: ExecutionPhase[] = []
      const seenPhases = new Set<string>()
      let phaseIndex = 0

      for (const workflow of workflows) {
        for (const phase of workflow.phases) {
          // Deduplicate phases by agent+task combination
          const key = `${phase.agent}:${phase.task}`
          if (!seenPhases.has(key)) {
            seenPhases.add(key)
            phaseIndex++
            
            phases.push({
              id: `phase_${phaseIndex}`,
              agent: phase.agent,
              task: phase.task,
              description: phase.description || phase.task,
              inputs: phase.inputs,
              outputs: phase.outputs,
              blocking: phase.blocking,
              condition: phase.condition,
              workflowSource: workflow.id,
            })
          }
        }
      }

      return phases
    })

    // Orchestrate: build execution plan from route decision
    const orchestrate = Effect.fn("orchestrate")(function* (route: RouteDecision) {
      // Handle non-analytics routes
      if (route.type !== "analytics" || route.capabilities.length === 0) {
        return {
          goal: route.type,
          capabilities: [],
          workflows: [],
          phases: [],
          requiredAgents: [],
          requiredTools: [],
          deliverables: [],
          estimatedComplexity: "low" as const,
          metadata: {
            source: "orchestrator",
            timestamp: new Date(),
            confidence: route.confidence,
            multipleCapabilities: false,
            reasoning: route.explanation,
          },
        }
      }

      // Load workflows from markdown (data-driven)
      const allWorkflows: LoadedWorkflow[] = []
      const allCapabilities: string[] = []
      
      for (const matched of route.capabilities) {
        const cap = matched.capability
        allCapabilities.push(cap.id)
        
        // Load workflow from markdown
        if (cap.workflow) {
          const workflow = yield* loader.getWorkflow(cap.workflow)
          if (workflow) {
            allWorkflows.push(workflow)
          }
        }
      }

      // Merge workflows into phases
      const phases = yield* mergeWorkflows(allWorkflows)
      
      // Collect all required agents from loaded agent files
      const allAgents = new Set<string>()
      for (const agent of route.agents) {
        const loadedAgent = yield* loader.getAgent(agent)
        if (loadedAgent) {
          allAgents.add(agent)
        }
      }
      
      // Also add agents from workflow phases
      for (const phase of phases) {
        const loadedAgent = yield* loader.getAgent(phase.agent)
        if (loadedAgent) {
          allAgents.add(phase.agent)
        }
      }
      
      // Collect deliverables from capabilities
      const deliverables: string[] = []
      for (const matched of route.capabilities) {
        if (matched.capability.outputs) {
          deliverables.push(...matched.capability.outputs)
        }
      }
      
      // Estimate complexity
      let complexity: "low" | "medium" | "high" = "low"
      if (phases.length > 6) complexity = "high"
      else if (phases.length > 3) complexity = "medium"
      
      const plan: ExecutionPlan = {
        goal: route.capabilities[0]?.capability.id || "general",
        capabilities: allCapabilities,
        workflows: route.workflows,
        phases,
        requiredAgents: [...allAgents],
        requiredTools: route.tools,
        deliverables: [...new Set(deliverables)],
        estimatedComplexity: complexity,
        metadata: {
          source: "orchestrator",
          timestamp: new Date(),
          confidence: route.confidence,
          multipleCapabilities: route.capabilities.length > 1,
          reasoning: route.explanation,
        },
      }

      log.info("execution plan created", {
        goal: plan.goal,
        capabilities: plan.capabilities,
        workflows: plan.workflows,
        phases: plan.phases.length,
        complexity: plan.estimatedComplexity,
        multipleCapabilities: plan.metadata.multipleCapabilities,
      })

      return plan
    })

    // Validate plan against loaded data
    const validate = Effect.fn("validate")(function* (plan: ExecutionPlan) {
      const issues: string[] = []
      const recommendations: string[] = []
      const missingAgents: string[] = []
      const missingTools: string[] = []

      // Validate phases exist
      if (plan.phases.length === 0) {
        issues.push("No phases defined in execution plan")
      }

      // Validate agents exist in loaded data
      const agents = yield* loader.getAgents()
      for (const agent of plan.requiredAgents) {
        if (!agents[agent]) {
          issues.push(`Agent "${agent}" not found in loaded agents`)
          missingAgents.push(agent)
        }
      }

      // Validate phase agents exist
      for (const phase of plan.phases) {
        if (!agents[phase.agent]) {
          issues.push(`Phase agent "${phase.agent}" not found in loaded agents`)
          if (!missingAgents.includes(phase.agent)) {
            missingAgents.push(phase.agent)
          }
        }
      }

      // Validate tools
      if (plan.requiredTools.length === 0) {
        recommendations.push("Consider adding required tools to the plan")
      }

      // Check for blocking phases
      const blockingPhases = plan.phases.filter(p => p.blocking)
      if (blockingPhases.length > 0) {
        log.info("plan has blocking phases", { count: blockingPhases.length })
      }

      // Check for multiple capabilities
      if (plan.metadata.multipleCapabilities) {
        recommendations.push("Multiple capabilities detected - ensure proper phase ordering")
      }

      return {
        valid: issues.length === 0,
        issues,
        recommendations,
        missingAgents,
        missingTools,
      }
    })

    // Explain plan for debugging
    const explainPlan = (plan: ExecutionPlan): string => {
      const lines = [
        `Goal: ${plan.goal}`,
        `Capabilities: ${plan.capabilities.join(", ")}`,
        `Workflows: ${plan.workflows.join(", ")}`,
        `Complexity: ${plan.estimatedComplexity}`,
        `Confidence: ${(plan.metadata.confidence * 100).toFixed(0)}%`,
        `Multiple Capabilities: ${plan.metadata.multipleCapabilities}`,
        "",
        "Phases:",
        ...plan.phases.map((p, i) => `  ${i + 1}. [${p.agent}] ${p.task} (${p.workflowSource})`),
        "",
        "Required Agents:",
        ...plan.requiredAgents.map(a => `  - ${a}`),
        "",
        "Required Tools:",
        ...plan.requiredTools.map(t => `  - ${t}`),
        "",
        "Deliverables:",
        ...plan.deliverables.map(d => `  - ${d}`),
      ]
      
      return lines.join("\n")
    }

    return AnalyticsOrchestrator.of({
      orchestrate,
      mergeWorkflows,
      validate,
      explainPlan,
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(CapabilityRegistry.defaultLayer),
  Layer.provide(AnalyticsLoader.defaultLayer)
)