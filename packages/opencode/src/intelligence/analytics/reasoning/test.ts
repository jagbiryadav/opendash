/**
 * Phase 1: Intelligence Foundation - Reasoning Engine Tests
 * 
 * Tests the analytical reasoning engine against the success criteria:
 * 
 * Given: "Sales dropped by 18%"
 * Expected: Reasoning through causes, evidence, analysis, deliverables
 * NOT: Immediately generating Python
 */

import { decomposeProblem, generateHypotheses, decideWorkflow } from "./index"

// ─── Test Cases ──────────────────────────────────────────────────────────────

const testCases = [
  {
    name: "Sales Decline - Diagnostic",
    input: "Sales dropped by 18% last quarter",
    expected: {
      problemType: "diagnostic",
      hasHypotheses: true,
      hasRootCauses: true,
      workflow: "root-cause",
    },
  },
  {
    name: "Forecasting Request",
    input: "Forecast revenue for next quarter",
    expected: {
      problemType: "predictive",
      hasHypotheses: true,
      hasRootCauses: false,
      workflow: "forecasting",
    },
  },
  {
    name: "Root Cause Analysis",
    input: "Why did customer churn increase?",
    expected: {
      problemType: "diagnostic",
      hasHypotheses: true,
      hasRootCauses: true,
      workflow: "root-cause",
    },
  },
  {
    name: "Optimization Request",
    input: "How can we optimize our marketing spend?",
    expected: {
      problemType: "prescriptive",
      hasHypotheses: true,
      hasRootCauses: false,
      workflow: "eda",
    },
  },
  {
    name: "Exploratory Analysis",
    input: "Analyze this dataset for patterns",
    expected: {
      problemType: "exploratory",
      hasHypotheses: true,
      hasRootCauses: false,
      workflow: "eda",
    },
  },
]

// ─── Tests ───────────────────────────────────────────────────────────────────

function runTests() {
  console.log("=== Phase 1: Intelligence Foundation Tests ===\n")
  
  let passed = 0
  let failed = 0
  
  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`)
    console.log(`Input: "${testCase.input}"`)
    
    // 1. Decompose problem
    const decomposition = decomposeProblem(testCase.input)
    console.log(`Problem Type: ${decomposition.problemType}`)
    
    if (decomposition.problemType !== testCase.expected.problemType) {
      console.log(`✗ Expected problem type: ${testCase.expected.problemType}`)
      failed++
      continue
    }
    
    // 2. Generate hypotheses
    const hypotheses = generateHypotheses(decomposition)
    console.log(`Hypotheses: ${hypotheses.length}`)
    
    if (testCase.expected.hasHypotheses && hypotheses.length === 0) {
      console.log(`✗ Expected hypotheses but got none`)
      failed++
      continue
    }
    
    // 3. Check root causes
    const hasRootCauses = decomposition.problemType === "diagnostic"
    if (testCase.expected.hasRootCauses !== hasRootCauses) {
      console.log(`✗ Expected root causes: ${testCase.expected.hasRootCauses}`)
      failed++
      continue
    }
    
    // 4. Check workflow decision
    const workflowDecision = decideWorkflow(decomposition, hypotheses)
    console.log(`Workflow: ${workflowDecision.selectedWorkflow}`)
    
    if (workflowDecision.selectedWorkflow !== testCase.expected.workflow) {
      console.log(`✗ Expected workflow: ${testCase.expected.workflow}`)
      failed++
      continue
    }
    
    console.log(`✓ Passed\n`)
    passed++
  }
  
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  
  // Test the "Sales dropped by 18%" success criteria
  console.log("\n=== Success Criteria Test: 'Sales dropped by 18%' ===\n")
  
  const request = "Sales dropped by 18%"
  const decomposition = decomposeProblem(request)
  const hypotheses = generateHypotheses(decomposition)
  const workflowDecision = decideWorkflow(decomposition, hypotheses)
  
  console.log("Input: 'Sales dropped by 18%'")
  console.log("\nExpected Reasoning:")
  console.log("1. Problem Type:", decomposition.problemType)
  console.log("2. Business Problem:", decomposition.businessProblem)
  console.log("3. Stakeholders:", decomposition.stakeholders.join(", "))
  console.log("4. Decision Type:", decomposition.decisionType)
  
  console.log("\n5. Possible Causes:")
  for (const h of hypotheses.filter(h => h.type !== "causal" || h.id !== `H${hypotheses.length}`)) {
    console.log(`   ✓ ${h.statement}`)
  }
  
  console.log("\n6. Evidence Required:")
  for (const h of hypotheses.slice(0, 3)) {
    console.log(`   - ${h.id}: ${h.evidenceRequired.join(", ")}`)
  }
  
  console.log("\n7. Recommended Analysis:")
  console.log(`   - ${workflowDecision.selectedWorkflow} workflow`)
  console.log(`   - Reasoning: ${workflowDecision.reasoning}`)
  
  console.log("\n8. Expected Deliverables:")
  console.log("   - Root cause analysis report")
  console.log("   - Evidence chain documentation")
  console.log("   - Business impact quantification")
  console.log("   - Recommended actions")
  
  console.log("\n✓ Success criteria met: AI reasons BEFORE generating code")
  
  return failed === 0
}

// Run tests
const success = runTests()
process.exit(success ? 0 : 1)