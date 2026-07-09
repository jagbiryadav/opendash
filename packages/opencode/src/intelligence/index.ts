/**
 * Intelligence Layer
 * 
 * Main entry point for the Data OS Intelligence Layer.
 * 
 * This module provides the analytics intelligence subsystem that sits above
 * OpenDash's runtime. It handles:
 * - Capability registry and workflow management
 * - Request routing and classification
 * - Analytics orchestration
 * - Memory management for analytics context
 * - Prompt building with analytics context
 * 
 * Architecture:
 * - Data OS decides WHAT to do and WHY
 * - OpenDash executes HOW to do it
 * 
 * @version 5.0.0
 * @license MIT
 */

import { Effect, Layer, Context } from "effect"
import { Analytics, AnalyticsIntelligence, defaultLayer as analyticsDefaultLayer } from "./analytics"

// Re-export all analytics modules
export * from "./analytics"

// Intelligence interface
export interface IntelligenceInterface {
  readonly analytics: AnalyticsIntelligence.Service
}

// Service class
export class Intelligence extends Context.Service<Intelligence, IntelligenceInterface>()("@opendash/Intelligence") {}

// Default layer
export const defaultLayer = Layer.effect(
  Intelligence,
  Effect.gen(function* () {
    const analytics = yield* AnalyticsIntelligence.Service

    return Intelligence.of({
      analytics,
    })
  })
).pipe(
  Layer.provide(analyticsDefaultLayer)
)

export * as Intelligence from "./index"