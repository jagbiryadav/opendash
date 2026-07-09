/**
 * Analytics Hook
 * 
 * Hook into OpenDash's prompt building to add analytics context.
 * 
 * This module provides a hook that can be used to:
 * - Intercept analytics requests
 * - Add analytics context to prompts
 * - Route to analytics orchestrator
 * - Build execution plans
 * 
 * Integration Point:
 * - Extend buildLLMRequestPrefix() in session/prompt.ts
 * - Add analytics context to system prompt
 * - Add analytics tools to tool list
 */

import { Effect } from "effect"
import { AnalyticsAdapters } from "./adapters"
import { Log } from "../../util"

const log = Log.create({ service: "analytics.hook" }

// Hook result
export interface AnalyticsHookResult {
  shouldIntercept: boolean
  analyticsContext?: string
  additionalTools?: string[]
  additionalSystemPrompt?: string
}

// Check if request should be intercepted
export async function shouldInterceptRequest(request: string): Promise<boolean> {
  try {
    // Simple keyword-based check for now
    const keywords = [
      "analyze", "analysis", "forecast", "predict", "model",
      "data", "clean", "eda", "dashboard", "visualization",
      "kpi", "metrics", "trend", "segment", "churn",
      "revenue", "sales", "profit", "regression", "classification",
      "clustering", "ab_test", "experiment", "root_cause", "cohort",
      "time_series", "machine_learning", "sql", "python",
    ]
    
    const lowerRequest = request.toLowerCase()
    for (const keyword of keywords) {
      if (lowerRequest.includes(keyword)) {
        return true
      }
    }
    
    return false
  } catch (error) {
    log.error("error checking request", { error })
    return false
  }
}

// Build analytics context for prompt
export async function buildAnalyticsContext(request: string): Promise<AnalyticsHookResult> {
  try {
    const shouldIntercept = await shouldInterceptRequest(request)
    
    if (!shouldIntercept) {
      return {
        shouldIntercept: false,
      }
    }

    // Build analytics context
    const analyticsContext = `
## Analytics Intelligence Layer
You are operating with the Data OS Analytics Intelligence Layer.

### Analytics Capabilities Available
- Time Series Forecasting
- Classification Modeling
- Regression Modeling
- Customer Segmentation
- Churn Prediction
- Root Cause Analysis
- A/B Testing
- Cohort Analysis
- Exploratory Data Analysis
- Dashboard Design

### Analytics Workflow
1. Business Consultant: Frame the problem
2. Data Auditor: Validate data quality
3. Data Analyst: Exploratory analysis
4. Statistician: Statistical validation
5. Data Scientist: Build models
6. Executive Advisor: Strategic recommendations
7. Report Writer: Compile deliverables

### Quality Gates
- Data Quality Gate
- Statistical Rigor Gate
- Model Quality Gate
- Business Logic Gate
- Communication Gate

### Memory System
- Track KPIs, stakeholders, assumptions
- Remember previous analyses
- Maintain business context
`.trim()

    const additionalSystemPrompt = `
## Analytics Instructions
When working with data or analytics requests:
1. First understand the business problem
2. Validate data quality before analysis
3. Use appropriate statistical methods
4. Report confidence scores
5. Consider alternative explanations
6. Provide actionable recommendations
`.trim()

    return {
      shouldIntercept: true,
      analyticsContext,
      additionalTools: ["python", "bash", "read", "write"],
      additionalSystemPrompt,
    }
  } catch (error) {
    log.error("error building analytics context", { error })
    return {
      shouldIntercept: false,
    }
  }
}

// Hook into OpenDash's prompt building
export function analyticsPromptHook(systemPrompt: string, request: string): Promise<string> {
  return buildAnalyticsContext(request).then(result => {
    if (!result.shouldIntercept) {
      return systemPrompt
    }

    // Add analytics context to system prompt
    let enhancedPrompt = systemPrompt
    
    if (result.analyticsContext) {
      enhancedPrompt += "\n\n" + result.analyticsContext
    }
    
    if (result.additionalSystemPrompt) {
      enhancedPrompt += "\n\n" + result.additionalSystemPrompt
    }

    return enhancedPrompt
  })
}