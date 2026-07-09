# Getting Started with OpenDash

OpenDash is the open-source AI workspace for analysts — a terminal-native assistant for data analysis, SQL, reporting, and dashboard automation. This guide walks you through installation, first run, and basic configuration.

## Installation

### Prerequisites

- **Node.js** 18+ or **Bun** 1.1+
- A terminal emulator (iTerm2, Windows Terminal, Alacritty, etc.)
- An API key from a supported LLM provider (or use the free OpenDash channel)

### Install via npm (recommended)

```bash
npm install -g @opendash-ai/cli
```

### Install via curl (macOS / Linux)

```bash
curl -fsSL https://opendash-ai.vercel.app/install | bash
```

### Install via Bun

```bash
bun install -g @opendash-ai/cli
```

## First Run

```bash
opendash
```

On first launch, OpenDash presents a configuration wizard:

1. **Choose a provider** — Select from OpenDash free tier, Xiaomi MiMo, Claude Code import, or custom
2. **Authenticate** — Follow the OAuth flow or paste your API key
3. **Select a model** — Pick the default model for your sessions
4. **Start analyzing** — The TUI loads and you can begin immediately

## Basic Usage

### Launching

```bash
opendash                    # Start in current directory
opendash /path/to/project   # Start in a specific directory
opendash --help             # Show all available options
```

### Navigating the TUI

- **Tab** — Cycle between primary agents (Build, Plan, Compose)
- **Enter** — Send a message to the active agent
- **Ctrl+C** — Cancel the current operation
- **Ctrl+L** — Clear the screen
- **?** — Open the help menu

### First Task

Once launched, you can ask the agent to:

- Read and explain code in your project
- Write new functions or modules
- Run tests and fix failures
- Manage Git commits and branches
- Search the codebase for patterns

Example:

```
> What does the auth module do?
> Add a validation function for email addresses
> Run the test suite and fix any failures
```

## Project Structure

OpenDash works best when run from your project root. It automatically detects:

- `package.json`, `tsconfig.json`, `pyproject.toml` — project type
- `.git/` — Git repository
- `src/`, `lib/`, `app/` — source directories
- `.opendash/opendash.json` — project-specific configuration

## Next Steps

- Read the [Architecture Guide](./architecture.md) to understand how OpenDash works
- Check the [Configuration Reference](./configuration.md) to customize behavior
- Explore the [Agents Guide](./agents.md) to learn about Build, Plan, and Compose modes
