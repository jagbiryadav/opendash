/**
 * Analytics Adapters
 * 
 * Adapters for integrating with OpenDash's existing systems.
 * 
 * Responsibilities:
 * - Adapt analytics requests to OpenDash's session system
 * - Adapt tool calls to OpenDash's tool system
 * - Adapt prompts to OpenDash's prompt system
 * - Provide hooks for OpenDash's plugin system
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsIntelligence, type AnalyticsClassification, type AnalyticsRoute, type AnalyticsExecutionPlan, type AnalyticsPrompt } from "../index"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.adapters" }

// Adapter interface
export interface AdapterInterface {
  readonly classifyRequest: (request: string) => Effect.Effect<AnalyticsClassification>
  readonly routeRequest: (classification: AnalyticsClassification) => Effect.Effect<AnalyticsRoute>
  readonly orchestrateRequest: (route: AnalyticsRoute) => Effect.Effect<AnalyticsExecutionPlan>
  readonly buildPrompt: (plan: AnalyticsExecutionPlan) => Effect.Effect<AnalyticsPrompt>
  readonly isAnalyticsRequest: (request: string) => Effect.Effect<boolean>
  readonly shouldIntercept: (request: string) => Effect.Effect<boolean>
}

// Service class
export class AnalyticsAdapters extends Context.Service<AnalyticsAdapters, AdapterInterface>()("@opendash/AnalyticsAdapters") {}

// Implementation
const layer: Layer.Layer<AnalyticsAdapters, never, AnalyticsIntelligence.Service> = Layer.effect(
  AnalyticsAdapters,
  Effect.gen(function* () {
    const intelligence = yield* AnalyticsIntelligence.Service

    return AnalyticsAdapters.of({
      classifyRequest: (request: string) =>
        Effect.gen(function* () {
          return yield* intelligence.classify(request)
        }),

      routeRequest: (classification: AnalyticsClassification) =>
        Effect.gen(function* () {
          return yield* intelligence.route(classification)
        }),

      orchestrateRequest: (route: AnalyticsRoute) =>
        Effect.gen(function* () {
          return yield* intelligence.orchestrate(route)
        }),

      buildPrompt: (plan: AnalyticsExecutionPlan) =>
        Effect.gen(function* () {
          return yield* intelligence.plan(plan)
        }),

      isAnalyticsRequest: (request: string) =>
        Effect.gen(function* () {
          const classification = yield* intelligence.classify(request)
          return classification.isAnalytics
        }),

      shouldIntercept: (request: string) =>
        Effect.gen(function* () {
          const classification = yield* intelligence.classify(request)
          // Intercept if confidence is high enough
          return classification.isAnalytics && classification.confidence > 0.5
        }),
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsIntelligence.defaultLayer)
)