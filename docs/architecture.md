# Architecture

This document describes the high-level architecture of OpenDash.

## Overview

OpenDash is a terminal-native AI coding assistant built as a modular TypeScript application. It runs entirely in the terminal (TUI) and communicates with LLM providers via their APIs.

```
┌─────────────────────────────────────────────────┐
│                    TUI Layer                     │
│  (Terminal rendering, input handling, panels)    │
├─────────────────────────────────────────────────┤
│                  Agent System                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Build   │  │   Plan   │  │ Compose  │      │
│  │ (primary)│  │ (primary)│  │ (primary)│      │
│  └──────────┘  └──────────┘  └──────────┘      │
│       │              │              │             │
│  ┌──────────────────────────────────────────┐   │
│  │           Subagent Runtime               │   │
│  │   (explore, general, specialized)        │   │
│  └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│                Core Services                     │
│  Memory │ Checkpoint │ Task │ Session │ Skills  │
├─────────────────────────────────────────────────┤
│              Provider Layer                      │
│  OpenAI │ Anthropic │ MiMo │ OpenRouter │ ...  │
├─────────────────────────────────────────────────┤
│                Tool Registry                     │
│  File │ Search │ Shell │ Knowledge │ Orchestrate│
└─────────────────────────────────────────────────┘
```

## Agent Model

Every session has a **primary agent** — one of three modes:

| Agent | Mode | Purpose |
|-------|------|---------|
| **Build** | `primary` | Full tool access for development work |
| **Plan** | `primary` | Read-only analysis and design |
| **Compose** | `primary` | Orchestrated multi-step workflows |

Press `Tab` to switch between them.

### Subagents

Primary agents can spawn **subagents** for parallel or isolated work:

- **explore** — Fast, read-only codebase exploration
- **general** — Multi-step task execution
- **custom** — User-defined via skills or workflows

Subagents run in the background and return results to the parent.

## Permission Model

Permissions flow through three layers, applied in order:

```
agent.permission → user/session config → agent.hardPermission
```

The last layer always wins. This is how Plan mode enforces read-only access regardless of user settings.

### Permission Levels

| Level | Description |
|-------|-------------|
| `allow` | Always permitted without prompting |
| `ask` | Prompts for user approval |
| `deny` | Always blocked |

## Memory System

OpenDash maintains persistent memory across sessions using SQLite FTS5:

### Memory Types

| Type | Path | Purpose |
|------|------|---------|
| **Project** | `MEMORY.md` | Cross-session project knowledge |
| **Checkpoint** | `checkpoint.md` | Structured session state snapshots |
| **Notes** | `notes.md` | Scratchpad for agents |
| **Task Progress** | `tasks/<id>/progress.md` | Per-task logs |

### Context Reconstruction

When the context window fills up:

1. The current session is checkpointed
2. Older messages are summarized and pruned
3. Context is rebuilt from checkpoints, memory, and recent messages
4. A token budget controls what enters the new context

## Tool System

Tools are registered in `packages/opencode/src/tool/`. Each tool is a TypeScript implementation with a prompt description.

### Tool Categories

| Category | Tools |
|----------|-------|
| **File** | `read`, `edit`, `multiedit`, `write`, `notebook-edit` |
| **Search** | `glob`, `grep`, `codesearch` |
| **Shell** | `bash`, `bash-interactive`, `change-directory` |
| **Knowledge** | `webfetch`, `websearch`, `memory`, `history`, `lsp` |
| **Orchestration** | `actor`, `task`, `workflow`, `skill` |
| **Mode** | `plan-enter`, `plan-exit`, `question` |

## Session Lifecycle

A session progresses through:

1. **Classification** — Intent extraction from user input
2. **Instruction** — System prompt assembly
3. **Goal** — Stop condition evaluation
4. **Checkpoint** — Periodic state snapshots
5. **Compaction** — Context window management
6. **Dream/Distill** — Background knowledge reinforcement

## Package Structure

```
packages/
├── opencode/          # Core CLI and TUI
├── desktop/           # Electron desktop app
├── app/               # Web application
├── console/           # Management console
├── sdk/js/            # JavaScript SDK
├── plugin/            # Plugin system
├── script/            # Build scripts
└── storybook/         # UI component stories
```
