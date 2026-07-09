# Agents Guide

OpenDash uses a multi-agent architecture where different agents handle different types of work. This guide explains each agent, how they work, and how to use them effectively.

## Primary Agents

Every session has exactly one **primary agent**. Press `Tab` to switch between them.

### Build Agent

The default agent for development work.

**Capabilities:**
- Read and write files
- Run shell commands
- Manage Git operations
- Search codebases
- Spawn subagents

**Permissions:** Full access (subject to your configuration)

**When to use:** Most of the time. Build is your general-purpose coding assistant.

### Plan Agent

A read-only analysis agent for design and exploration.

**Capabilities:**
- Read files
- Search codebases
- Analyze architecture
- Write to plan files only (`.mimocode/plans/`)
- Spawn read-only subagents

**Permissions:** Read-only (hard-enforced, cannot be overridden)

**When to use:**
- Before implementing a complex feature
- When exploring unfamiliar code
- For architecture decisions and design reviews
- When you want analysis without any code changes

### Compose Agent

An orchestration agent for structured multi-step workflows.

**Capabilities:**
- All Build capabilities
- Workflow orchestration via skills
- Parallel subagent management
- Spec-driven development lifecycle

**When to use:**
- Complex features requiring multiple steps
- Tasks that benefit from TDD, review, and verification
- When you want structured, reproducible workflows

## Subagents

Subagents are spawned by primary agents for parallel or isolated work. They run in the background and return results.

### Built-in Subagent Types

| Type | Purpose | Tools |
|------|---------|-------|
| `explore` | Fast, read-only code exploration | `grep`, `glob`, `read`, `bash` |
| `general` | Multi-step task execution | All tools |

### Spawning Subagents

The primary agent spawns subagents automatically when it determines parallelism would help. You can also request specific behavior:

```
> Search the codebase for all error handling patterns
> Review the auth module for security issues
> Run the test suite in parallel
```

### Subagent Lifecycle

1. **Spawn** — Created with a specific task
2. **Run** — Executes independently
3. **Complete** — Returns results to parent
4. **Cleanup** — Resources released

### Parallel Execution

Multiple subagents can run simultaneously. The system manages concurrency automatically, with a default limit of 16 concurrent agents.

## Workflows

Workflows are deterministic scripts that orchestrate multiple subagents. They're defined in JavaScript and run in a sandbox.

### Built-in Workflows

| Workflow | Description |
|----------|-------------|
| `compose` | Full development lifecycle: brainstorm → design → implement → verify → review → merge |
| `deep-research` | Multi-source investigation with cited report generation |
| `fact-check` | Parallel web search and adversarial verification |
| `research-experiment` | Autonomous experiment loop with metric optimization |

### Custom Workflows

Create workflows in `.mimocode/workflows/`:

```javascript
export const meta = {
  name: "my-workflow",
  description: "Custom development workflow"
}

export default async function(args) {
  // Orchestrate subagents here
}
```

## Goal-Driven Sessions

The `/goal` command sets a stopping condition for a session. When the agent tries to stop, an independent judge evaluates whether the goal is met.

```
> /goal All tests pass and the PR is ready for review
```

This prevents premature stops during autonomous work.

## Best Practices

1. **Use Plan mode first** for complex tasks — understand before implementing
2. **Let Build handle** most day-to-day coding tasks
3. **Use Compose** for multi-step features that benefit from structure
4. **Set goals** for long-running autonomous tasks
5. **Trust subagents** — they're designed for parallel exploration and isolated tasks
