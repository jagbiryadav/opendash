/**
 * Analytics Loader - DYNAMIC DISCOVERY
 * 
 * Scans Data OS directories at startup. No hardcoded module lists.
 * 
 * Scans:
 * - data-os/agents/*.md
 * - data-os/workflows/*.md
 * - data-os/registry/capabilities.json
 * - data-os/templates/*.md
 * - data-os/policies/*.md
 * - data-os/domains/*.md
 * - data-os/knowledge/*.md
 * - data-os/contracts/*.md
 * 
 * New modules are discovered automatically.
 * No code changes needed when Data OS adds new agents/workflows.
 */

import { Effect, Context, Layer } from "effect"
import { AppFileSystem } from "@opendash-ai/shared/filesystem"
import { Log } from "../../../util"
import path from "path"

const log = Log.create({ service: "analytics.loader" }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoadedAgent {
  id: string
  name: string
  responsibility: string
  inputs: string[]
  outputs: string[]
  qualityGates: string[]
  escalation: string
  raw: string
}

export interface LoadedWorkflow {
  id: string
  name: string
  description: string
  phases: WorkflowPhase[]
  triggers: string[]
  raw: string
}

export interface WorkflowPhase {
  id: string
  agent: string
  task: string
  description: string
  inputs: string[]
  outputs: string[]
  blocking: boolean
  condition?: string
}

export interface LoadedCapability {
  id: string
  name: string
  description: string
  workflow: string
  uses: {
    agents: string[]
    knowledge: string[]
    templates: string[]
  }
  requires: {
    inputs: string[]
    optional: string[]
  }
  outputs: string[]
  triggers: string[]
}

export interface LoadedTemplate {
  id: string
  name: string
  content: string
}

export interface LoadedPolicy {
  id: string
  name: string
  content: string
  rules: string[]
}

export interface LoadedDomain {
  id: string
  name: string
  content: string
}

export interface LoadedKnowledge {
  id: string
  name: string
  content: string
}

export interface LoadedContract {
  id: string
  name: string
  content: string
}

// ─── Loader Interface ────────────────────────────────────────────────────────

export interface LoaderInterface {
  readonly load: () => Effect.Effect<void>
  readonly reload: () => Effect.Effect<void>
  readonly getDataOsPath: () => Effect.Effect<string>
  
  // Dynamic discovery - returns whatever was found
  readonly getAgents: () => Effect.Effect<Record<string, LoadedAgent>>
  readonly getWorkflows: () => Effect.Effect<Record<string, LoadedWorkflow>>
  readonly getCapabilities: () => Effect.Effect<Record<string, LoadedCapability>>
  readonly getTemplates: () => Effect.Effect<Record<string, LoadedTemplate>>
  readonly getPolicies: () => Effect.Effect<Record<string, LoadedPolicy>>
  readonly getDomains: () => Effect.Effect<Record<string, LoadedDomain>>
  readonly getKnowledge: () => Effect.Effect<Record<string, LoadedKnowledge>>
  readonly getContracts: () => Effect.Effect<Record<string, LoadedContract>>
  
  // Lookup by ID
  readonly getAgent: (id: string) => Effect.Effect<LoadedAgent | undefined>
  readonly getWorkflow: (id: string) => Effect.Effect<LoadedWorkflow | undefined>
  readonly getCapability: (id: string) => Effect.Effect<LoadedCapability | undefined>
  
  // Search by trigger keywords
  readonly findCapabilitiesByTrigger: (keywords: string[]) => Effect.Effect<LoadedCapability[]>
  
  // Registry
  readonly getRegistry: () => Effect.Effect<LoadedCapability[]>
}

export class AnalyticsLoader extends Context.Service<AnalyticsLoader, LoaderInterface>()("@opendash/AnalyticsLoader") {}

// ─── State ───────────────────────────────────────────────────────────────────

interface LoaderState {
  dataOsPath: string
  agents: Record<string, LoadedAgent>
  workflows: Record<string, LoadedWorkflow>
  capabilities: Record<string, LoadedCapability>
  templates: Record<string, LoadedTemplate>
  policies: Record<string, LoadedPolicy>
  domains: Record<string, LoadedDomain>
  knowledge: Record<string, LoadedKnowledge>
  contracts: Record<string, LoadedContract>
  loaded: boolean
}

// ─── Parsers ─────────────────────────────────────────────────────────────────

function parseAgent(content: string, id: string): LoadedAgent {
  const lines = content.split("\n")
  let name = ""
  let responsibility = ""
  const inputs: string[] = []
  const outputs: string[] = []
  const qualityGates: string[] = []
  let escalation = ""

  for (const line of lines) {
    if (line.startsWith("# ")) {
      name = line.slice(2).trim()
    } else if (line.includes("**Responsibility**:")) {
      responsibility = line.split("**Responsibility**:")[1]?.trim() || ""
    } else if (line.includes("**Inputs**:")) {
      const inputStr = line.split("**Inputs**:")[1]?.trim() || ""
      inputs.push(...inputStr.split(",").map(s => s.trim()))
    } else if (line.includes("**Outputs**:")) {
      const outputStr = line.split("**Outputs**:")[1]?.trim() || ""
      outputs.push(...outputStr.split(",").map(s => s.trim()))
    } else if (line.startsWith("- [ ] ")) {
      qualityGates.push(line.slice(6).trim())
    } else if (line.includes("**Escalation**:")) {
      escalation = line.split("**Escalation**:")[1]?.trim() || ""
    }
  }

  return { id, name: name || id, responsibility, inputs, outputs, qualityGates, escalation, raw: content }
}

function parseWorkflow(content: string, id: string): LoadedWorkflow {
  const lines = content.split("\n")
  let name = ""
  let description = ""
  const phases: WorkflowPhase[] = []
  const triggers: string[] = []
  let phaseIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith("# ")) {
      name = line.slice(2).trim()
    } else if (line.startsWith("## ")) {
      description = line.slice(3).trim()
    } else if (line.includes("→") || line.includes("->")) {
      const separator = line.includes("→") ? "→" : "->"
      const parts = line.split(separator).map(s => s.trim())
      if (parts.length >= 2) {
        phaseIndex++
        const agentPart = parts[0].replace(/\[.*\]/g, "").trim()
        const task = parts[1]
        const output = parts[2] || ""
        const blocking = line.toUpperCase().includes("BLOCKING")
        
        phases.push({
          id: `phase_${phaseIndex}`,
          agent: agentPart,
          task,
          description: "",
          inputs: [],
          outputs: output ? [output] : [],
          blocking,
        })
      }
    } else if (line.startsWith("- ") && phases.length > 0) {
      const lastPhase = phases[phases.length - 1]
      if (line.includes("condition:")) {
        lastPhase.condition = line.split("condition:")[1]?.trim()
      }
    }
  }

  return { id, name: name || id, description, phases, triggers, raw: content }
}

function parseCapabilities(content: string): LoadedCapability[] {
  try {
    const data = JSON.parse(content)
    return data.capabilities || []
  } catch {
    return []
  }
}

// ─── Dynamic Directory Scanner ───────────────────────────────────────────────

async function scanDirectory(
  fs: AppFileSystem.Service,
  dirPath: string,
  extension: string
): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  
  const exists = await fs.existsSafe(dirPath)
  if (exists._tag === "Left") return result
  
  const files = await fs.readDirectory(dirPath)
  for (const file of files) {
    if (file.endsWith(extension)) {
      const content = await fs.readFileString(path.join(dirPath, file))
      const id = file.replace(extension, "")
      result[id] = content
    }
  }
  
  return result
}

// ─── Implementation ──────────────────────────────────────────────────────────

const layer: Layer.Layer<AnalyticsLoader, never, AppFileSystem.Service> = Layer.effect(
  AnalyticsLoader,
  Effect.gen(function* () {
    const fs = yield* AppFileSystem.Service
    
    // State is mutable but contained within the service
    const state: LoaderState = {
      dataOsPath: "",
      agents: {},
      workflows: {},
      capabilities: {},
      templates: {},
      policies: {},
      domains: {},
      knowledge: {},
      contracts: {},
      loaded: false,
    }

    // Discover Data OS path dynamically
    const discoverDataOsPath = Effect.fn("discoverDataOsPath")(function* () {
      const candidates = [
        path.join(process.cwd(), "kimchi-data-os", "kimchi-data-os-bymimo", "kimchi-data-os"),
        path.join(process.cwd(), "data-os"),
        path.join(process.cwd(), ".data-os"),
        path.join(process.env.HOME || process.env.USERPROFILE || "", ".data-os"),
      ]
      
      for (const candidate of candidates) {
        const exists = yield* fs.existsSafe(candidate)
        if (exists._tag === "Right") {
          log.info("discovered Data OS path", { path: candidate })
          return candidate
        }
      }
      
      // Default to first candidate
      log.warn("Data OS path not found, using default", { path: candidates[0] })
      return candidates[0]
    })

    // Dynamic scan functions - no hardcoded module lists
    const scanAgents = Effect.fn("scanAgents")(function* () {
      const agentsDir = path.join(state.dataOsPath, "agents")
      const raw = yield* Effect.promise(() => scanDirectory(fs, agentsDir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.agents[id] = parseAgent(content, id)
      }
      
      log.info("discovered agents", { count: Object.keys(state.agents).length, ids: Object.keys(state.agents) })
    })

    const scanWorkflows = Effect.fn("scanWorkflows")(function* () {
      const workflowsDir = path.join(state.dataOsPath, "workflows")
      const raw = yield* Effect.promise(() => scanDirectory(fs, workflowsDir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.workflows[id] = parseWorkflow(content, id)
      }
      
      log.info("discovered workflows", { count: Object.keys(state.workflows).length, ids: Object.keys(state.workflows) })
    })

    const scanCapabilities = Effect.fn("scanCapabilities")(function* () {
      const registryPath = path.join(state.dataOsPath, "registry", "capabilities.json")
      const exists = yield* fs.existsSafe(registryPath)
      if (exists._tag === "Left") return
      
      const content = yield* fs.readFileString(registryPath)
      const caps = parseCapabilities(content)
      
      for (const cap of caps) {
        state.capabilities[cap.id] = cap
      }
      
      log.info("discovered capabilities", { count: caps.length, ids: caps.map(c => c.id) })
    })

    const scanTemplates = Effect.fn("scanTemplates")(function* () {
      const dir = path.join(state.dataOsPath, "templates")
      const raw = yield* Effect.promise(() => scanDirectory(fs, dir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.templates[id] = { id, name: id, content }
      }
      
      log.info("discovered templates", { count: Object.keys(state.templates).length })
    })

    const scanPolicies = Effect.fn("scanPolicies")(function* () {
      const dir = path.join(state.dataOsPath, "policies")
      const raw = yield* Effect.promise(() => scanDirectory(fs, dir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        const rules = content.split("\n").filter(l => l.startsWith("- ")).map(l => l.slice(2))
        state.policies[id] = { id, name: id, content, rules }
      }
      
      log.info("discovered policies", { count: Object.keys(state.policies).length })
    })

    const scanDomains = Effect.fn("scanDomains")(function* () {
      const dir = path.join(state.dataOsPath, "domains")
      const raw = yield* Effect.promise(() => scanDirectory(fs, dir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.domains[id] = { id, name: id, content }
      }
      
      log.info("discovered domains", { count: Object.keys(state.domains).length })
    })

    const scanKnowledge = Effect.fn("scanKnowledge")(function* () {
      const dir = path.join(state.dataOsPath, "knowledge")
      const raw = yield* Effect.promise(() => scanDirectory(fs, dir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.knowledge[id] = { id, name: id, content }
      }
      
      log.info("discovered knowledge", { count: Object.keys(state.knowledge).length })
    })

    const scanContracts = Effect.fn("scanContracts")(function* () {
      const dir = path.join(state.dataOsPath, "contracts")
      const raw = yield* Effect.promise(() => scanDirectory(fs, dir, ".md"))
      
      for (const [id, content] of Object.entries(raw)) {
        state.contracts[id] = { id, name: id, content }
      }
      
      log.info("discovered contracts", { count: Object.keys(state.contracts).length })
    })

    // Full load - scans all directories
    const loadAll = Effect.fn("loadAll")(function* () {
      state.dataOsPath = yield* discoverDataOsPath()
      
      // Scan all directories in parallel
      yield* Effect.all([
        scanAgents(),
        scanWorkflows(),
        scanCapabilities(),
        scanTemplates(),
        scanPolicies(),
        scanDomains(),
        scanKnowledge(),
        scanContracts(),
      ], { concurrency: "unbounded" })
      
      state.loaded = true
      
      log.info("Data OS loaded", {
        path: state.dataOsPath,
        agents: Object.keys(state.agents).length,
        workflows: Object.keys(state.workflows).length,
        capabilities: Object.keys(state.capabilities).length,
        templates: Object.keys(state.templates).length,
        policies: Object.keys(state.policies).length,
        domains: Object.keys(state.domains).length,
        knowledge: Object.keys(state.knowledge).length,
        contracts: Object.keys(state.contracts).length,
      })
    })

    // Find capabilities by trigger keywords (data-driven, no switch statements)
    const findCapabilitiesByTrigger = Effect.fn("findCapabilitiesByTrigger")(function* (keywords: string[]) {
      const matches: Array<{ capability: LoadedCapability; score: number }> = []
      
      for (const cap of Object.values(state.capabilities)) {
        let score = 0
        const triggers = cap.triggers || []
        
        for (const keyword of keywords) {
          const lower = keyword.toLowerCase()
          for (const trigger of triggers) {
            if (trigger.toLowerCase().includes(lower) || lower.includes(trigger.toLowerCase())) {
              score += 1
            }
          }
        }
        
        if (score > 0) {
          matches.push({ capability: cap, score })
        }
      }
      
      // Sort by score descending
      matches.sort((a, b) => b.score - a.score)
      
      return matches.map(m => m.capability)
    })

    return AnalyticsLoader.of({
      load: loadAll,
      
      reload: Effect.fn("reload")(function* () {
        state.loaded = false
        state.agents = {}
        state.workflows = {}
        state.capabilities = {}
        state.templates = {}
        state.policies = {}
        state.domains = {}
        state.knowledge = {}
        state.contracts = {}
        yield* loadAll()
      }),
      
      getDataOsPath: () => Effect.succeed(state.dataOsPath),
      
      getAgents: () => Effect.succeed(state.agents),
      getWorkflows: () => Effect.succeed(state.workflows),
      getCapabilities: () => Effect.succeed(state.capabilities),
      getTemplates: () => Effect.succeed(state.templates),
      getPolicies: () => Effect.succeed(state.policies),
      getDomains: () => Effect.succeed(state.domains),
      getKnowledge: () => Effect.succeed(state.knowledge),
      getContracts: () => Effect.succeed(state.contracts),
      
      getAgent: (id: string) => Effect.succeed(state.agents[id]),
      getWorkflow: (id: string) => Effect.succeed(state.workflows[id]),
      getCapability: (id: string) => Effect.succeed(state.capabilities[id]),
      
      findCapabilitiesByTrigger,
      
      getRegistry: () => Effect.succeed(Object.values(state.capabilities)),
    })
  })
)

export const defaultLayer = layer.pipe(
  Layer.provide(AppFileSystem.defaultLayer)
)