# Memory System

OpenDash maintains persistent memory across sessions, so it doesn't need to relearn your project every time you start it.

## How It Works

Memory is stored as Markdown files with BM25 full-text search indexing. When a session starts, relevant memory is automatically injected into the agent's context.

## Memory Types

### Project Memory

**Path:** `~/.claude/projects/<project>/memory/MEMORY.md`

Stores cross-session project knowledge:

- Architecture decisions
- Project rules and conventions
- Durable facts about the codebase
- User preferences

Project memory is updated:
- When you state a rule that should persist
- When the agent discovers something durable
- During `/dream` execution

### Session Checkpoint

**Path:** `~/.claude/projects/<project>/memory/sessions/<sid>/checkpoint.md`

Structured snapshots of session state, maintained automatically by the checkpoint-writer subagent:

1. Active intent
2. Next action
3. Directives
4. Task tree
5. Current work
6. Files
7. Learnings
8. Errors
9. Live resources
10. Design decisions
11. Open notes

Checkpoints are created periodically and when the context window needs management.

### Scratch Notes

**Path:** `~/.claude/projects/<project>/memory/sessions/<sid>/notes.md`

Temporary note area for agents. Used for:

- Quotes with lasting value
- Unresolved questions
- Cross-project observations
- Notes for future sessions

### Task Progress

**Path:** `~/.claude/projects/<project>/memory/sessions/<sid>/tasks/<id>/progress.md`

Per-task logs written by subagents. Captures:

- What was done
- What was discovered
- What's blocking

## Context Reconstruction

When the context window fills up, OpenDash rebuilds context from:

1. **Latest checkpoint** — Most recent session state
2. **Project memory** — Cross-session knowledge
3. **Task progress** — What's been done
4. **Recent messages** — The most recent conversation

A token budget controls how much of each source enters the new context, with importance ranking.

## Memory Search

Memory uses BM25 full-text search for retrieval:

- Queries are OR-joined and ranked by relevance
- Low-relevance common-word matches are filtered out
- Punctuation is stripped during tokenization

### Query Tips

**Good queries:**
- `T5.3 closure` — Specific task reference
- `permission deadlock` — Rare, distinctive phrase
- `auth module architecture` — Focused topic

**Bad queries:**
- `config params database connection` — Too generic, adds noise
- `the function that handles errors` — Too vague

### Partial Matches

A hit may give the gist but miss the precise form. For exact recall, use the `history` tool to pull raw conversation messages.

## `/dream` Command

Scans recent session traces and:

1. Extracts persistent knowledge into project memory
2. Removes outdated entries
3. Consolidates related information

Run `/dream` when you want to formalize what was learned in a session.

## `/distill` Command

Discovers repeated manual workflows and packages high-confidence candidates into:

- **Skills** — Reusable instruction sets
- **Subagents** — Specialized workers
- **Commands** — Shortcut operations

Run `/distill` when you notice yourself doing the same thing repeatedly.

## Memory Configuration

```jsonc
{
  "memory": {
    "enabled": true,
    "cc_index": false
  }
}
```

- `enabled` — Toggle memory system on/off
- `cc_index` — Index Claude Code memory (for cross-tool compatibility)

## Privacy

Memory files are stored locally. No data is sent to external servers unless you explicitly share it. The `cc_index` option indexes Claude Code's memory, which may contain personal context — disable it if you don't want cross-tool visibility.
