/**
 * Capability Registry
 * 
 * Runtime-aware registry that maps capabilities to workflows, engines, and tools.
 * 
 * Responsibilities:
 * - Register capabilities from loaded data
 * - Map capabilities to required tools and models
 * - Provide lookup by capability ID or trigger keywords
 * - Track capability status and versioning
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsLoader, type LoadedCapability } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.registry" }

// Registry entry with runtime metadata
export interface RegistryEntry {
  capability: LoadedCapability
  requiredTools: string[]
  requiredModels: string[]
  expectedOutputs: string[]
  version: string
  lastUpdated: Date
}

// Registry interface
export interface RegistryInterface {
  readonly getCapability: (id: string) => Effect.Effect<RegistryEntry | undefined>
  readonly matchCapability: (keywords: string[]) => Effect.Effect<RegistryEntry | undefined>
  readonly listCapabilities: () => Effect.Effect<RegistryEntry[]>
  readonly getRequiredTools: (capabilityId: string) => Effect.Effect<string[]>
  readonly getRequiredModels: (capabilityId: string) => Effect.Effect<string[]>
  readonly reload: () => Effect.Effect<void>
}

// Service class
export class CapabilityRegistry extends Context.Service<CapabilityRegistry, RegistryInterface>()("@opendash/CapabilityRegistry") {}

// Map capability to required tools
function mapTools(capability: LoadedCapability): string[] {
  const tools: string[] = []
  
  // Common tools based on capability type
  if (capability.id.includes("forecast") || capability.id.includes("prediction")) {
    tools.push("python", "bash")
  }
  if (capability.id.includes("classification") || capability.id.includes("regression")) {
    tools.push("python", "bash")
  }
  if (capability.id.includes("clustering")) {
    tools.push("python", "bash")
  }
  if (capability.id.includes("eda") || capability.id.includes("analysis")) {
    tools.push("python", "bash", "read")
  }
  if (capability.id.includes("dashboard")) {
    tools.push("python", "write")
  }
  if (capability.id.includes("ab_testing")) {
    tools.push("python", "bash")
  }
  if (capability.id.includes("root_cause")) {
    tools.push("python", "bash", "read")
  }
  if (capability.id.includes("cohort")) {
    tools.push("python", "bash")
  }
  if (capability.id.includes("churn")) {
    tools.push("python", "bash")
  }

  // Always include basic tools
  tools.push("read", "write", "bash")
  
  return [...new Set(tools)]
}

// Map capability to required models
function mapModels(capability: LoadedCapability): string[] {
  const models: string[] = []
  
  // Most analytics tasks work with standard models
  models.push("anthropic/claude-3-opus")
  models.push("openai/gpt-4")
  
  return models
}

// Implementation
const layer: Layer.Layer<CapabilityRegistry, never, AnalyticsLoader.Service> = Layer.effect(
  CapabilityRegistry,
  Effect.gen(function* () {
    const loader = yield* AnalyticsLoader.Service
    const registry = new Map<string, RegistryEntry>()

    const buildRegistry = Effect.fn("buildRegistry")(function* () {
      const capabilities = yield* loader.getCapabilities()
      
      for (const [id, capability] of Object.entries(capabilities)) {
        registry.set(id, {
          capability,
          requiredTools: mapTools(capability),
          requiredModels: mapModels(capability),
          expectedOutputs: capability.outputs,
          version: "5.0.0",
          lastUpdated: new Date(),
        })
      }
      
      log.info("capability registry built", { count: registry.size })
    })

    return CapabilityRegistry.of({
      getCapability: (id: string) =>
        Effect.gen(function* () {
          return registry.get(id)
        }),

      matchCapability: (keywords: string[]) =>
        Effect.gen(function* () {
          let bestMatch: RegistryEntry | undefined
          let bestScore = 0

          for (const entry of registry.values()) {
            let score = 0
            const triggers = entry.capability.triggers || []
            
            for (const keyword of keywords) {
              const lowerKeyword = keyword.toLowerCase()
              for (const trigger of triggers) {
                if (trigger.toLowerCase().includes(lowerKeyword) || lowerKeyword.includes(trigger.toLowerCase())) {
                  score += 1
                }
              }
            }

            if (score > bestScore) {
              bestScore = score
              bestMatch = entry
            }
          }

          return bestMatch
        }),

      listCapabilities: () =>
        Effect.gen(function* () {
          return Array.from(registry.values())
        }),

      getRequiredTools: (capabilityId: string) =>
        Effect.gen(function* () {
          const entry = registry.get(capabilityId)
          return entry?.requiredTools || []
        }),

      getRequiredModels: (capabilityId: string) =>
        Effect.gen(function* () {
          const entry = registry.get(capabilityId)
          return entry?.requiredModels || []
        }),

      reload: Effect.fn("CapabilityRegistry.reload")(function* () {
        registry.clear()
        yield* buildRegistry()
      }),
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsLoader.defaultLayer)
)