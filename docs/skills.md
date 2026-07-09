# Skills & Workflows

Skills are reusable instruction sets that extend OpenDash's capabilities. Workflows are scripts that orchestrate multiple agents for complex tasks.

## Skills

### What Are Skills?

Skills are Markdown files (`SKILL.md`) that provide specialized instructions and workflows for specific tasks. They're discovered from:

- `.claude/skills/`
- `.agents/skills/`
- `.codex/skills/`
- `.opencode/skills/`

### Using Skills

Invoke a skill by name:

```
/my-skill-name
```

Or the agent may automatically load a skill when it recognizes a matching task.

### Built-in Skills

| Skill | Purpose |
|-------|---------|
| `arxiv` | Find, read, and cite academic papers |
| `deep-research` | Multi-source investigation with cited reports |
| `design-blueprint` | Structured design specifications |
| `docx-official` | Microsoft Word document operations |
| `frontend-design` | Visual design guidance |
| `pdf-official` | PDF operations |
| `pptx-official` | PowerPoint operations |
| `research-paper-writing` | Academic paper writing |
| `xlsx-official` | Spreadsheet operations |
| `ui-ux-pro-max` | UI/UX design intelligence |

### Creating Skills

Create a `SKILL.md` file in any of the skill directories:

```markdown
---
name: my-skill
description: Does something useful
---

# My Skill

Instructions for the agent go here.
```

### Skill Anatomy

```markdown
---
name: skill-name                    # Unique identifier
description: What this skill does   # Trigger description
---

# Title

## When to Use
...

## Instructions
...

## Examples
...
```

### Best Practices

1. **Be specific** in the description — it determines when the skill triggers
2. **Include examples** — they help the agent understand usage
3. **Keep instructions focused** — one skill, one purpose
4. **Use frontmatter** — `name` and `description` are required

## Workflows

### What Are Workflows?

Workflows are JavaScript scripts that run deterministic multi-agent orchestration. They use `phase()`, `parallel()`, `pipeline()`, and `agent()` to coordinate work.

### Built-in Workflows

#### compose

Full development lifecycle:

```
Brainstorm → Design → Implement → Verify → Review → Report → Merge
```

Use for features, bugfixes, refactors, or review-feedback tasks.

#### deep-research

Multi-source investigation:

```
Brief → Plan → Research → Reflect → Write → Review
```

Produces a cited Markdown report from parallel web research.

#### fact-check

Adversarial verification:

```
Plan → Search → Extract → Group → Crosscheck → Report
```

Verifies specific claims across multiple sources.

#### research-experiment

Autonomous metric optimization:

```
Baseline → Loop (hypothesize → implement → run → keep/revert) → Audit → Report
```

Hill-climbs a metric with automatic experimentation.

### Creating Workflows

Create a `.js` file in `.mimocode/workflows/`:

```javascript
export const meta = {
  name: "my-workflow",
  description: "Custom workflow description"
}

export default async function(args) {
  phase("Research")

  const findings = await parallel([
    agent("Search for relevant code", { subagent_type: "explore" }),
    agent("Check for existing patterns", { subagent_type: "explore" })
  ])

  phase("Implement")

  await agent("Implement based on findings", {
    subagent_type: "general",
    prompt: `Implement: ${JSON.stringify(findings)}`
  })

  return { status: "complete" }
}
```

### Workflow APIs

| Function | Description |
|----------|-------------|
| `phase(title)` | Mark a workflow phase |
| `log(message)` | Emit a progress message |
| `parallel(thunks)` | Run multiple agents concurrently |
| `pipeline(items, ...stages)` | Process items through sequential stages |
| `agent(prompt, opts)` | Spawn a subagent |
| `readFile(path)` | Read a file in the workspace |
| `writeFile(path, content)` | Write a file |
| `glob(pattern)` | List matching files |

### Workflow Limits

- **Timeout:** 12 hours per run
- **Max agents:** 1000 lifecycle agents
- **Concurrency:** 16 (default)
- **Shared budget:** Token budget shared with parent session

### Resume from Journal

Workflows support resume via `resumeFromRunId`, allowing long-running workflows to survive interruptions.

## Skills vs Workflows

| Aspect | Skills | Workflows |
|--------|--------|-----------|
| **Format** | Markdown | JavaScript |
| **Purpose** | Instructions & guidance | Deterministic orchestration |
| **Trigger** | `/skill-name` or auto | Manual or programmatic |
| **Scope** | Single invocation | Multi-phase pipeline |
| **State** | Stateless | Can persist via files |
| **Complexity** | Simple to moderate | Moderate to complex |

Use **skills** for knowledge and guidance. Use **workflows** for orchestrated multi-agent pipelines.
