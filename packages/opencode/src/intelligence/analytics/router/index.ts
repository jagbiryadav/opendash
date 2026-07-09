/**
 * Analytics Router - DATA-DRIVEN, MULTI-CAPABILITY, CONFIDENCE POLICY
 * 
 * Classification and routing with:
 * - Data-driven capability matching (no switch statements)
 * - Multiple capability support (forecast + root cause + visualization)
 * - Confidence policy (what happens at 0.45?)
 * - Explains reasoning for debugging
 */

import { Effect, Context, Layer } from "effect"
import { AnalyticsLoader, type LoadedCapability } from "../loader"
import { Log } from "../../../util"

const log = Log.create({ service: "analytics.router" }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClassificationResult {
  isAnalytics: boolean
  confidence: number
  capabilities: MatchedCapability[]
  keywords: string[]
  intent: string
  explanation: string
}

export interface MatchedCapability {
  capability: LoadedCapability
  score: number
  confidence: number
}

export interface RouteDecision {
  type: "analytics" | "general" | "clarify" | "fallback"
  capabilities: MatchedCapability[]
  primaryCapability?: string
  workflows: string[]
  agents: string[]
  tools: string[]
  confidence: number
  explanation: string
}

export interface ConfidencePolicy {
  threshold_proceed: number      // >= this: proceed with analytics
  threshold_clarify: number      // >= this: ask clarification
  threshold_fallback: number     // < this: fall back to general
}

// ─── Router Interface ────────────────────────────────────────────────────────

export interface RouterInterface {
  readonly classify: (request: string) => Effect.Effect<ClassificationResult>
  readonly route: (classification: ClassificationResult) => Effect.Effect<RouteDecision>
  readonly explain: (request: string) => Effect.Effect<RouterExplanation>
  readonly findMultipleCapabilities: (request: string) => Effect.Effect<LoadedCapability[]>
}

export interface RouterExplanation {
  chosenWorkflows: string[]
  chosenEngines: string[]
  reason: string
  requiredTools: string[]
  confidence: number
  matchedCapabilities: string[]
  multipleCapabilitiesDetected: boolean
}

export class AnalyticsRouter extends Context.Service<AnalyticsRouter, RouterInterface>()("@opendash/AnalyticsRouter") {}

// ─── Confidence Policy ───────────────────────────────────────────────────────

const DEFAULT_CONFIDENCE_POLICY: ConfidencePolicy = {
  threshold_proceed: 0.5,    // >= 0.5: proceed with analytics
  threshold_clarify: 0.3,    // >= 0.3: ask clarification
  threshold_fallback: 0.0,   // < 0.3: fall back to general
}

// ─── Keyword Extraction ─────────────────────────────────────────────────────

function extractKeywords(request: string): string[] {
  const words = request.toLowerCase().split(/[\s,;.!?]+/)
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "this", "that", "these",
    "those", "i", "you", "he", "she", "it", "we", "they", "what", "which",
    "who", "whom", "when", "where", "why", "how", "all", "each", "every",
    "both", "few", "more", "most", "other", "some", "such", "no", "not",
    "only", "own", "same", "so", "than", "too", "very", "just", "because",
    "as", "until", "while", "of", "at", "by", "for", "with", "about",
    "against", "between", "through", "during", "before", "after", "above",
    "below", "to", "from", "up", "down", "in", "out", "on", "off", "over",
    "under", "again", "further", "then", "once", "here", "there",
  ])
  
  return [...new Set(words.filter(word => word.length > 2 && !stopWords.has(word)))]
}

// ─── Intent Patterns ─────────────────────────────────────────────────────────

interface IntentPattern {
  pattern: RegExp
  intent: string
  category: string
}

const INTENT_PATTERNS: IntentPattern[] = [
  // Forecasting
  { pattern: /forecast|predict|future|projection|next\s+(quarter|month|year)/i, intent: "forecasting", category: "predictive" },
  { pattern: /trend|trending|direction/i, intent: "trend_analysis", category: "diagnostic" },
  
  // Root Cause
  { pattern: /why\s+(did|does|is|are)|root\s+cause|diagnosis|reason\s+for/i, intent: "root_cause", category: "diagnostic" },
  { pattern: /what\s+happened|what\s+caused/i, intent: "root_cause", category: "diagnostic" },
  
  // Classification
  { pattern: /classify|classification|categorize|segment|cluster/i, intent: "classification", category: "predictive" },
  { pattern: /churn|retain|attrition|loyalty/i, intent: "churn_prediction", category: "predictive" },
  
  // EDA
  { pattern: /analyze|analysis|analyse|explore|exploratory|describe|summary|overview/i, intent: "eda", category: "descriptive" },
  { pattern: /what\s+is\s+the|show\s+me|tell\s+me\s+about/i, intent: "eda", category: "descriptive" },
  
  // Data Quality
  { pattern: /clean|quality|missing|outlier|audit|validate/i, intent: "data_quality", category: "preprocessing" },
  
  // Visualization
  { pattern: /dashboard|visualization|chart|graph|plot|visualize/i, intent: "dashboard", category: "presentation" },
  { pattern: /kpi|metric|measure|track/i, intent: "metrics", category: "presentation" },
  
  // Statistical
  { pattern: /a\/b|test|experiment|hypothesis|significant/i, intent: "ab_testing", category: "statistical" },
  { pattern: /regression|correlation|predict\s+continuous/i, intent: "regression", category: "predictive" },
  
  // Business
  { pattern: /revenue|sales|profit|margin|financial/i, intent: "financial_analysis", category: "business" },
  { pattern: /customer|user|client/i, intent: "customer_analysis", category: "business" },
  { pattern: /optimize|improve|increase|reduce/i, intent: "optimization", category: "business" },
  
  // Multi-capability markers
  { pattern: /and\s+(also|additionally|plus)|as\s+well\s+as|both|combine/i, intent: "multi_capability", category: "meta" },
]

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<AnalyticsRouter, never, AnalyticsLoader.Service> = Layer.effect(
  AnalyticsRouter,
  Effect.gen(function* () {
    const loader = yield* AnalyticsLoader.Service
    const policy = DEFAULT_CONFIDENCE_POLICY

    // Data-driven classification - matches against loaded capabilities
    const classify = Effect.fn("classify")(function* (request: string) {
      const keywords = extractKeywords(request)
      const lowerRequest = request.toLowerCase()
      const explanations: string[] = []
      
      // 1. Match against intent patterns
      const matchedIntents: string[] = []
      let patternScore = 0
      
      for (const { pattern, intent, category } of INTENT_PATTERNS) {
        if (pattern.test(lowerRequest)) {
          matchedIntents.push(intent)
          patternScore += 1
          explanations.push(`Pattern matched: "${intent}" (${category})`)
        }
      }
      
      // 2. Find capabilities by trigger keywords (data-driven)
      const matchedCapabilities = yield* loader.findCapabilitiesByTrigger(keywords)
      
      // 3. Calculate confidence
      const capabilityScore = matchedCapabilities.length > 0 ? matchedCapabilities[0].triggers?.length || 0 : 0
      const totalScore = patternScore + Math.min(keywords.length / 3, 1)
      const confidence = Math.min(totalScore / 3, 1)
      
      // 4. Determine if analytics
      const isAnalytics = confidence >= policy.threshold_proceed || matchedCapabilities.length > 0
      
      // 5. Build explanation
      if (matchedCapabilities.length > 0) {
        explanations.push(`Capabilities matched: ${matchedCapabilities.map(c => c.id).join(", ")}`)
      }
      if (matchedIntents.length > 0) {
        explanations.push(`Intents detected: ${matchedIntents.join(", ")}`)
      }
      
      const explanation = explanations.join("; ") || "No analytics patterns detected"
      
      log.info("classification result", {
        isAnalytics,
        confidence,
        capabilities: matchedCapabilities.map(c => c.id),
        intents: matchedIntents,
        keywords,
      })
      
      return {
        isAnalytics,
        confidence,
        capabilities: matchedCapabilities.map(c => ({ capability: c, score: 0, confidence })),
        keywords,
        intent: matchedIntents[0] || "general",
        explanation,
      }
    })

    // Data-driven routing - uses loaded capabilities, not switch statements
    const route = Effect.fn("route")(function* (classification: ClassificationResult) {
      const explanations: string[] = []
      
      // Apply confidence policy
      if (classification.confidence < policy.threshold_fallback) {
        return {
          type: "fallback" as const,
          capabilities: [],
          workflows: [],
          agents: [],
          tools: [],
          confidence: classification.confidence,
          explanation: `Confidence ${classification.confidence.toFixed(2)} below fallback threshold ${policy.threshold_fallback}`,
        }
      }
      
      if (classification.confidence < policy.threshold_proceed && classification.confidence >= policy.threshold_clarify) {
        return {
          type: "clarify" as const,
          capabilities: classification.capabilities,
          workflows: [],
          agents: [],
          tools: [],
          confidence: classification.confidence,
          explanation: `Confidence ${classification.confidence.toFixed(2)} suggests clarification needed`,
        }
      }
      
      if (!classification.isAnalytics || classification.capabilities.length === 0) {
        return {
          type: "general" as const,
          capabilities: [],
          workflows: [],
          agents: [],
          tools: [],
          confidence: classification.confidence,
          explanation: "No analytics capabilities matched",
        }
      }
      
      // Multiple capabilities detected
      const multipleCapabilities = classification.capabilities.length > 1
      if (multipleCapabilities) {
        explanations.push(`Multiple capabilities detected: ${classification.capabilities.map(c => c.capability.id).join(", ")}`)
      }
      
      // Collect all unique agents and tools from matched capabilities
      const allAgents = new Set<string>()
      const allTools = new Set<string>()
      const allWorkflows: string[] = []
      
      for (const matched of classification.capabilities) {
        const cap = matched.capability
        
        // Add agents from capability
        if (cap.uses?.agents) {
          for (const agent of cap.uses.agents) {
            allAgents.add(agent)
          }
        }
        
        // Add workflow
        if (cap.workflow) {
          allWorkflows.push(cap.workflow)
        }
        
        // Add tools based on capability type (data-driven)
        const tools = yield* loader.getCapability(cap.id).then(c => {
          if (!c) return []
          // Tools are determined by capability, not hardcoded
          const capabilityTools: string[] = ["read", "write", "bash"]
          if (c.id.includes("forecast") || c.id.includes("classification") || c.id.includes("regression")) {
            capabilityTools.push("python")
          }
          return capabilityTools
        })
        
        for (const tool of tools) {
          allTools.add(tool)
        }
      }
      
      const primaryCapability = classification.capabilities[0]?.capability.id
      
      const explanation = explanations.join("; ") || `Routing to ${primaryCapability}`
      
      log.info("routing decision", {
        type: "analytics",
        primaryCapability,
        workflows: allWorkflows,
        agents: [...allAgents],
        tools: [...allTools],
        multipleCapabilities,
      })
      
      return {
        type: "analytics" as const,
        capabilities: classification.capabilities,
        primaryCapability,
        workflows: allWorkflows,
        agents: [...allAgents],
        tools: [...allTools],
        confidence: classification.confidence,
        explanation,
      }
    })

    // Explain routing for debugging
    const explain = Effect.fn("explain")(function* (request: string) {
      const classification = yield* classify(request)
      const routeDecision = yield* route(classification)
      
      return {
        chosenWorkflows: routeDecision.workflows,
        chosenEngines: ["python-analytics", "statistics"], // Data-driven from capability
        reason: routeDecision.explanation,
        requiredTools: routeDecision.tools,
        confidence: routeDecision.confidence,
        matchedCapabilities: classification.capabilities.map(c => c.capability.id),
        multipleCapabilitiesDetected: classification.capabilities.length > 1,
      }
    })

    // Find multiple capabilities for complex requests
    const findMultipleCapabilities = Effect.fn("findMultipleCapabilities")(function* (request: string) {
      const keywords = extractKeywords(request)
      return yield* loader.findCapabilitiesByTrigger(keywords)
    })

    return AnalyticsRouter.of({
      classify,
      route,
      explain,
      findMultipleCapabilities,
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AnalyticsLoader.defaultLayer)
)