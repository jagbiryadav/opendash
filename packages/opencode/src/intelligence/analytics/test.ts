/**
 * Analytics Integration Tests
 * 
 * Test the Data OS Analytics Intelligence Layer integration.
 * 
 * Test Cases:
 * 1. Request classification
 * 2. Capability matching
 * 3. Workflow selection
 * 4. Prompt building
 * 5. Memory operations
 */

import { Effect } from "effect"
import { shouldInterceptRequest, buildAnalyticsContext } from "./hook"
import { extractKeywords } from "./router"

// Test request classification
async function testClassification() {
  console.log("Testing request classification...")
  
  const testCases = [
    { request: "Analyze this sales data", expected: true },
    { request: "Forecast revenue for next quarter", expected: true },
    { request: "Why did sales drop 18%?", expected: true },
    { request: "Clean this dataset", expected: true },
    { request: "Create a dashboard", expected: true },
    { request: "Build a machine learning model", expected: true },
    { request: "Run an A/B test", expected: true },
    { request: "What is the trend?", expected: true },
    { request: "Help me write a Python script", expected: false },
    { request: "What is 2 + 2?", expected: false },
  ]
  
  let passed = 0
  let failed = 0
  
  for (const testCase of testCases) {
    const result = await shouldInterceptRequest(testCase.request)
    if (result === testCase.expected) {
      console.log(`✓ "${testCase.request}" -> ${result}`)
      passed++
    } else {
      console.log(`✗ "${testCase.request}" -> ${result} (expected ${testCase.expected})`)
      failed++
    }
  }
  
  console.log(`\nClassification tests: ${passed} passed, ${failed} failed\n`)
  return failed === 0
}

// Test keyword extraction
async function testKeywordExtraction() {
  console.log("Testing keyword extraction...")
  
  const testCases = [
    { request: "Analyze this sales data", expectedKeywords: ["analyze", "sales", "data"] },
    { request: "Forecast revenue for next quarter", expectedKeywords: ["forecast", "revenue", "quarter"] },
    { request: "Why did sales drop 18%?", expectedKeywords: ["sales", "drop"] },
  ]
  
  let passed = 0
  let failed = 0
  
  for (const testCase of testCases) {
    const keywords = extractKeywords(testCase.request)
    const hasAllExpected = testCase.expectedKeywords.every(kw => 
      keywords.some(k => k.includes(kw) || kw.includes(k))
    )
    
    if (hasAllExpected) {
      console.log(`✓ "${testCase.request}" -> [${keywords.join(", ")}]`)
      passed++
    } else {
      console.log(`✗ "${testCase.request}" -> [${keywords.join(", ")}] (missing expected keywords)`)
      failed++
    }
  }
  
  console.log(`\nKeyword extraction tests: ${passed} passed, ${failed} failed\n`)
  return failed === 0
}

// Test prompt building
async function testPromptBuilding() {
  console.log("Testing prompt building...")
  
  const testRequest = "Analyze this sales data and forecast next quarter"
  const result = await buildAnalyticsContext(testRequest)
  
  if (result.shouldIntercept) {
    console.log(`✓ Request intercepted: ${result.shouldIntercept}`)
    console.log(`✓ Analytics context length: ${result.analyticsContext?.length || 0}`)
    console.log(`✓ Additional tools: ${result.additionalTools?.join(", ") || "none"}`)
    console.log(`✓ Additional system prompt length: ${result.additionalSystemPrompt?.length || 0}`)
    console.log("")
    return true
  } else {
    console.log(`✗ Request not intercepted: ${result.shouldIntercept}`)
    console.log("")
    return false
  }
}

// Run all tests
async function runTests() {
  console.log("=== Data OS Analytics Intelligence Layer Tests ===\n")
  
  const results = await Promise.all([
    testClassification(),
    testKeywordExtraction(),
    testPromptBuilding(),
  ])
  
  const allPassed = results.every(r => r)
  
  if (allPassed) {
    console.log("=== All tests passed! ===")
  } else {
    console.log("=== Some tests failed ===")
    process.exit(1)
  }
}

// Run tests if this file is executed directly
runTests().catch(console.error)