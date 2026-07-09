/**
 * Engine Module
 * 
 * Manages different analytics engines.
 * 
 * Responsibilities:
 * - Register analytics engines
 * - Provide engine capabilities
 * - Manage engine lifecycle
 * - Route to appropriate engine
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsLoader } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.engine" }

// Engine definition
export interface AnalyticsEngine {
  id: string
  name: string
  description: string
  capabilities: string[]
  requiredTools: string[]
  requiredModels: string[]
  version: string
}

// Engine interface
export interface EngineInterface {
  readonly getEngine: (id: string) => Effect.Effect<AnalyticsEngine | undefined>
  readonly listEngines: () => Effect.Effect<AnalyticsEngine[]>
  readonly matchEngine: (capability: string) => Effect.Effect<AnalyticsEngine | undefined>
  readonly getRequiredTools: (engineId: string) => Effect.Effect<string[]>
  readonly getRequiredModels: (engineId: string) => Effect.Effect<string[]>
}

// Service class
export class EngineRegistry extends Context.Service<EngineRegistry, EngineInterface>()("@opendash/EngineRegistry") {}

// Default engines
const DEFAULT_ENGINES: AnalyticsEngine[] = [
  {
    id: "python-analytics",
    name: "Python Analytics Engine",
    description: "Python-based analytics using pandas, numpy, scipy",
    capabilities: ["eda", "regression", "classification", "clustering", "forecasting"],
    requiredTools: ["python", "bash"],
    requiredModels: ["anthropic/claude-3-opus", "openai/gpt-4"],
    version: "5.0.0",
  },
  {
    id: "sql-analytics",
    name: "SQL Analytics Engine",
    description: "SQL-based analytics using DuckDB, PostgreSQL",
    capabilities: ["eda", "aggregation", "reporting"],
    requiredTools: ["bash", "read"],
    requiredModels: ["anthropic/claude-3-opus", "openai/gpt-4"],
    version: "5.0.0",
  },
  {
    id: "visualization",
    name: "Visualization Engine",
    description: "Data visualization using matplotlib, seaborn, plotly",
    capabilities: ["dashboard", "visualization", "reporting"],
    requiredTools: ["python", "write"],
    requiredModels: ["anthropic/claude-3-opus", "openai/gpt-4"],
    version: "5.0.0",
  },
  {
    id: "machine-learning",
    name: "Machine Learning Engine",
    description: "ML modeling using scikit-learn, xgboost, lightgbm",
    capabilities: ["classification", "regression", "clustering", "forecasting"],
    requiredTools: ["python", "bash"],
    requiredModels: ["anthropic/claude-3-opus", "openai/gpt-4"],
    version: "5.0.0",
  },
  {
    id: "statistics",
    name: "Statistical Analysis Engine",
    description: "Statistical testing using scipy, statsmodels",
    capabilities: ["ab_testing", "hypothesis_testing", "statistical_analysis"],
    requiredTools: ["python", "bash"],
    requiredModels: ["anthropic/claude-3-opus", "openai/gpt-4"],
    version: "5.0.0",
  },
]

// Implementation
const layer: Layer.Layer<EngineRegistry, never, AnalyticsLoader.Service> = Layer.effect(
  EngineRegistry,
  Effect.gen(function* () {
    const loader = yield* AnalyticsLoader.Service
    const engines = new Map<string, AnalyticsEngine>()

    // Initialize with default engines
    for (const engine of DEFAULT_ENGINES) {
      engines.set(engine.id, engine)
    }

    return EngineRegistry.of({
      getEngine: (id: string) =>
        Effect.gen(function* () {
          return engines.get(id)
        }),

      listEngines: () =>
        Effect.gen(function* () {
          return Array.from(engines.values())
        }),

      matchEngine: (capability: string) =>
        Effect.gen(function* () {
          let bestMatch: AnalyticsEngine | undefined
          let bestScore = 0

          for (const engine of engines.values()) {
            let score = 0
            for (const cap of engine.capabilities) {
              if (cap.includes(capability) || capability.includes(cap)) {
                score += 1
              }
            }
            if (score > bestScore) {
              bestScore = score
              bestMatch = engine
            }
          }

          return bestMatch
        }),

      getRequiredTools: (engineId: string) =>
        Effect.gen(function* () {
          const engine = engines.get(engineId)
          return engine?.requiredTools || []
        }),

      getRequiredModels: (engineId: string) =>
        Effect.gen(function* () {
          const engine = engines.get(engineId)
          return engine?.requiredModels || []
        }),
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsLoader.defaultLayer)
)