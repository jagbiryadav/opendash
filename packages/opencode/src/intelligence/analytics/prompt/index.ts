/**
 * Prompt Builder - COMPOSABLE PROMPT ASSEMBLY WITH REASONING
 * 
 * Assembles prompts from composable blocks:
 * - Base Prompt
 * - Reasoning Context (Phase 1)
 * - Analytics Context
 * - Workflow Context
 * - Policies
 * - Contracts
 * - Templates
 * - Memory
 * 
 * Each block is independent and can be added/removed.
 * NOT string concatenation.
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsLoader, type LoadedPolicy, type LoadedTemplate, type LoadedContract } from "../loader"
import { PlannerEngine, type DetailedPlan } from "../planner"
import { AnalyticsMemory, type AnalyticsContext } from "../memory"
import { AnalyticalReasoning, type ReasoningResult } from "../reasoning"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.prompt" }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ComposablePrompt {
  blocks: PromptBlock[]
  metadata: PromptMetadata
}

export interface PromptBlock {
  id: string
  type: "base" | "reasoning" | "analytics" | "workflow" | "policies" | "contracts" | "templates" | "memory" | "custom"
  content: string
  priority: number
  enabled: boolean
}

export interface PromptMetadata {
  version: string
  timestamp: Date
  planId: string
  capabilities: string[]
  confidence: number
}

export interface AnalyticsPrompt {
  systemPrompt: string
  reasoningContext: string
  analyticsContext: string
  workflowContext: string
  policiesContext: string
  contractsContext: string
  templatesContext: string
  memoryContext: string
  fullPrompt: string
}

// ─── Prompt Builder Interface ────────────────────────────────────────────────

export interface PromptBuilderInterface {
  readonly build: (plan: DetailedPlan, context?: AnalyticsContext, reasoning?: ReasoningResult) => Effect.Effect<AnalyticsPrompt>
  readonly buildComposable: (plan: DetailedPlan, context?: AnalyticsContext, reasoning?: ReasoningResult) => Effect.Effect<ComposablePrompt>
  readonly addBlock: (prompt: ComposablePrompt, block: PromptBlock) => ComposablePrompt
  readonly removeBlock: (prompt: ComposablePrompt, blockId: string) => ComposablePrompt
  readonly enableBlock: (prompt: ComposablePrompt, blockId: string, enabled: boolean) => ComposablePrompt
  readonly getBlock: (prompt: ComposablePrompt, blockId: string) => PromptBlock | undefined
  readonly assemble: (prompt: ComposablePrompt) => string
}

export class AnalyticsPromptBuilder extends Context.Service<AnalyticsPromptBuilder, PromptBuilderInterface>()("@opendash/AnalyticsPromptBuilder") {}

// ─── Block Builders ──────────────────────────────────────────────────────────

function buildBaseBlock(plan: DetailedPlan): PromptBlock {
  return {
    id: "base",
    type: "base",
    content: `
# ANALYTICS INTELLIGENCE LAYER

You are operating as part of the Data OS Analytics Intelligence Layer integrated into OpenDash.

## Your Role
You are an analytics specialist agent. Execute the assigned task according to the execution plan.

## Rules
1. **REASON FIRST** - Think before you code
2. Always document your reasoning
3. Validate outputs before passing to next phase
4. Escalate issues to the orchestrator
5. Follow quality gates
6. **Business context drives analysis** - Not tools
`.trim(),
    priority: 100,
    enabled: true,
  }
}

function buildReasoningBlock(reasoning: ReasoningResult): PromptBlock {
  const decomposition = reasoning.problemDecomposition
  const hypotheses = reasoning.hypotheses
  const rootCauses = reasoning.rootCauses
  const workflow = reasoning.workflowDecision
  const confidence = reasoning.confidenceCalibration
  
  return {
    id: "reasoning",
    type: "reasoning",
    content: `
## ANALYTICAL REASONING (Business-First)

### Problem Decomposition
- **Original Request**: ${decomposition.originalRequest}
- **Business Problem**: ${decomposition.businessProblem}
- **Problem Type**: ${decomposition.problemType}
- **Stakeholders**: ${decomposition.stakeholders.join(", ")}
- **Decision Type**: ${decomposition.decisionType}
- **Urgency**: ${decomposition.urgency}

### Hypotheses to Test
${hypotheses.map(h => `
- **${h.id}**: ${h.statement}
  - Type: ${h.type}
  - Test Method: ${h.testMethod}
  - Evidence Required: ${h.evidenceRequired.join(", ")}
  - Confidence: ${(h.confidence * 100).toFixed(0)}%
`).join("\n")}

### Root Cause Analysis
${rootCauses.primaryCauses.map(c => `
- **${c.cause}** (Probability: ${(c.probability * 100).toFixed(0)}%)
  - Evidence: ${c.evidence.join(", ")}
  - Counter Evidence: ${c.counterEvidence.join(", ")}
  - Testable: ${c.testable ? "Yes" : "No"}
`).join("\n")}

### Workflow Decision
- **Selected Workflow**: ${workflow.selectedWorkflow}
- **Reasoning**: ${workflow.reasoning}
- **Confidence**: ${(workflow.confidence * 100).toFixed(0)}%

### Confidence Calibration
- **Overall Confidence**: ${(confidence.overallConfidence * 100).toFixed(0)}%
- **Warnings**: ${confidence.warnings.join("; ") || "None"}

## IMPORTANT: Reason through this BEFORE generating any code.
`.trim(),
    priority: 95,
    enabled: true,
  }
}

function buildAnalyticsBlock(plan: DetailedPlan): PromptBlock {
  return {
    id: "analytics",
    type: "analytics",
    content: `
## Analytics Context
- Goal: ${plan.goal}
- Capabilities: ${plan.capabilities.join(", ")}
- Complexity: ${plan.estimatedComplexity}
- Estimated Time: ${plan.estimatedTime}
`.trim(),
    priority: 90,
    enabled: true,
  }
}

function buildWorkflowBlock(plan: DetailedPlan): PromptBlock {
  const phases = plan.steps.map((step, i) => `
### Phase ${i + 1}: ${step.agent}
- Task: ${step.task}
- Description: ${step.description}
- Inputs: ${step.inputs.join(", ")}
- Outputs: ${step.outputs.join(", ")}
- Tools: ${step.tools.join(", ")}
- Blocking: ${step.blocking ? "Yes" : "No"}
`).join("\n")

  return {
    id: "workflow",
    type: "workflow",
    content: `
## Workflow Context
- Workflow: ${plan.workflow}
- Total Phases: ${plan.steps.length}
- Execution Order: ${plan.steps.map(s => s.id).join(" → ")}
${phases}
`.trim(),
    priority: 80,
    enabled: true,
  }
}

function buildPoliciesBlock(policies: LoadedPolicy[]): PromptBlock {
  const policyContent = policies.map(p => `
### ${p.name}
${p.rules.map(r => `- ${r}`).join("\n")}
`).join("\n")

  return {
    id: "policies",
    type: "policies",
    content: `
## Policies
${policyContent || "No policies loaded."}
`.trim(),
    priority: 70,
    enabled: true,
  }
}

function buildContractsBlock(contracts: LoadedContract[]): PromptBlock {
  const contractContent = contracts.map(c => `
### ${c.name}
${c.content.slice(0, 500)}...
`).join("\n")

  return {
    id: "contracts",
    type: "contracts",
    content: `
## Contracts
${contractContent || "No contracts loaded."}
`.trim(),
    priority: 60,
    enabled: true,
  }
}

function buildTemplatesBlock(templates: LoadedTemplate[], capability: string): PromptBlock {
  const relevantTemplates = templates.filter(t => 
    t.id.includes(capability) || capability.includes(t.id)
  )
  
  const templateContent = relevantTemplates.map(t => `
### ${t.name}
${t.content.slice(0, 500)}...
`).join("\n")

  return {
    id: "templates",
    type: "templates",
    content: `
## Templates
${templateContent || "No relevant templates found."}
`.trim(),
    priority: 50,
    enabled: true,
  }
}

function buildMemoryBlock(context: AnalyticsContext | undefined): PromptBlock {
  if (!context) {
    return {
      id: "memory",
      type: "memory",
      content: "## Memory\nNo analytics memory available.",
      priority: 40,
      enabled: false,
    }
  }

  const businessContext = context.businessContext ? `
### Business Context
- Problem: ${context.businessContext.problemStatement}
- Stakeholders: ${context.businessContext.stakeholders.join(", ")}
- Decision Type: ${context.businessContext.decisionType}
- Success Criteria: ${context.businessContext.successCriteria.join(", ")}
` : ""

  const datasets = context.datasets.length > 0 ? `
### Datasets
${context.datasets.map(d => `- ${d.name}: ${d.rows} rows, ${d.columns} columns, quality: ${d.qualityScore}%`).join("\n")}
` : ""

  const kpis = context.kpis.length > 0 ? `
### KPIs
${context.kpis.map(k => `- ${k.name}: ${k.currentValue} (target: ${k.targetValue}, trend: ${k.trend})`).join("\n")}
` : ""

  const hypotheses = context.hypotheses.length > 0 ? `
### Hypotheses
${context.hypotheses.map(h => `- [${h.status}] ${h.statement}`).join("\n")}
` : ""

  const assumptions = context.assumptions.length > 0 ? `
### Assumptions
${context.assumptions.map(a => `- ${a.statement} (impact: ${a.impact}, validated: ${a.validated})`).join("\n")}
` : ""

  const issues = context.knownIssues.length > 0 ? `
### Known Issues
${context.knownIssues.map(i => `- [${i.severity}] ${i.description} (${i.status})`).join("\n")}
` : ""

  return {
    id: "memory",
    type: "memory",
    content: `
## Analytics Memory
${businessContext}${datasets}${kpis}${hypotheses}${assumptions}${issues}
`.trim(),
    priority: 40,
    enabled: true,
  }
}

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<AnalyticsPromptBuilder, never, AnalyticsLoader.Service | PlannerEngine.Service | AnalyticsMemory.Service | AnalyticalReasoning.Service> = Layer.effect(
  AnalyticsPromptBuilder,
  Effect.gen(function* () {
    const loader = yield* AnalyticsLoader.Service
    const planner = yield* PlannerEngine.Service
    const memory = yield* AnalyticsMemory.Service

    // Build composable prompt
    const buildComposable = Effect.fn("buildComposable")(function* (
      plan: DetailedPlan,
      context?: AnalyticsContext,
      reasoning?: ReasoningResult
    ) {
      // Load data from markdown
      const policies = yield* loader.getPolicies()
      const contracts = yield* loader.getContracts()
      const templates = yield* loader.getTemplates()

      // Build blocks
      const blocks: PromptBlock[] = [
        buildBaseBlock(plan),
        ...(reasoning ? [buildReasoningBlock(reasoning)] : []),
        buildAnalyticsBlock(plan),
        buildWorkflowBlock(plan),
        buildPoliciesBlock(Object.values(policies)),
        buildContractsBlock(Object.values(contracts)),
        buildTemplatesBlock(Object.values(templates), plan.goal),
        buildMemoryBlock(context),
      ]

      // Sort by priority
      blocks.sort((a, b) => b.priority - a.priority)

      return {
        blocks,
        metadata: {
          version: "5.0.0",
          timestamp: new Date(),
          planId: plan.goal,
          capabilities: plan.capabilities,
          confidence: 0.9,
        },
      }
    })

    // Assemble composable prompt into string
    const assemble = (prompt: ComposablePrompt): string => {
      const enabledBlocks = prompt.blocks
        .filter(b => b.enabled)
        .sort((a, b) => b.priority - a.priority)

      return enabledBlocks.map(b => b.content).join("\n\n")
    }

    // Build final prompt
    const build = Effect.fn("build")(function* (
      plan: DetailedPlan,
      context?: AnalyticsContext,
      reasoning?: ReasoningResult
    ) {
      const composable = yield* buildComposable(plan, context, reasoning)
      const fullPrompt = assemble(composable)

      // Extract individual contexts for backwards compatibility
      const systemPrompt = composable.blocks.find(b => b.type === "base")?.content || ""
      const reasoningContext = composable.blocks.find(b => b.type === "reasoning")?.content || ""
      const analyticsContext = composable.blocks.find(b => b.type === "analytics")?.content || ""
      const workflowContext = composable.blocks.find(b => b.type === "workflow")?.content || ""
      const policiesContext = composable.blocks.find(b => b.type === "policies")?.content || ""
      const contractsContext = composable.blocks.find(b => b.type === "contracts")?.content || ""
      const templatesContext = composable.blocks.find(b => b.type === "templates")?.content || ""
      const memoryContext = composable.blocks.find(b => b.type === "memory")?.content || ""

      return {
        systemPrompt,
        reasoningContext,
        analyticsContext,
        workflowContext,
        policiesContext,
        contractsContext,
        templatesContext,
        memoryContext,
        fullPrompt,
      }
    })

    // Add block to prompt
    const addBlock = (prompt: ComposablePrompt, block: PromptBlock): ComposablePrompt => {
      return {
        ...prompt,
        blocks: [...prompt.blocks, block],
      }
    }

    // Remove block from prompt
    const removeBlock = (prompt: ComposablePrompt, blockId: string): ComposablePrompt => {
      return {
        ...prompt,
        blocks: prompt.blocks.filter(b => b.id !== blockId),
      }
    }

    // Enable/disable block
    const enableBlock = (prompt: ComposablePrompt, blockId: string, enabled: boolean): ComposablePrompt => {
      return {
        ...prompt,
        blocks: prompt.blocks.map(b => 
          b.id === blockId ? { ...b, enabled } : b
        ),
      }
    }

    // Get block by ID
    const getBlock = (prompt: ComposablePrompt, blockId: string): PromptBlock | undefined => {
      return prompt.blocks.find(b => b.id === blockId)
    }

    return AnalyticsPromptBuilder.of({
      build,
      buildComposable,
      addBlock,
      removeBlock,
      enableBlock,
      getBlock,
      assemble,
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsLoader.defaultLayer),
  Layer.provide(PlannerEngine.defaultLayer),
  Layer.provide(AnalyticsMemory.defaultLayer),
  Layer.provide(AnalyticalReasoning.defaultLayer)
)