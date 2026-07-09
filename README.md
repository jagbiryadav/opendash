<h1 align="center">

```
 ██████  ██████  ███████ ███    ██    ██████   █████  ███████ ██   ██
██    ██ ██   ██ ██      ████   ██    ██   ██ ██   ██ ██      ██   ██
██    ██ ██████  █████   ██ ██  ██    ██   ██ ███████ ███████ ███████
██    ██ ██      ██      ██  ██ ██    ██   ██ ██   ██      ██ ██   ██
 ██████  ██      ███████ ██   ████    ██████  ██   ██ ███████ ██   ██
```

</h1>

<p align="center">
  <strong>The open-source AI workspace for analysts</strong>
</p>

<p align="center">
  <a href="https://opendash-ai.vercel.app">Website</a> · <a href="https://github.com/jagbiryadav/opendash">GitHub</a> · <a href="#getting-started">Get Started</a> · <a href="./docs">Documentation</a>
</p>

---

<p align="center">
  <em>Terminal-native AI assistant for data analysis, SQL, reporting, and dashboard automation.</em>
</p>

---

## About

OpenDash is an open-source, terminal-native AI workspace designed for analysts and data professionals. It connects to your databases, runs SQL queries, generates reports, builds dashboards, and uses a persistent memory system to maintain deep context across sessions — continuously improving itself over time.

OpenDash ships with a free built-in channel so you can start with zero configuration. It also supports connecting to any mainstream LLM provider API.

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Agent Architecture** | Build, Plan, and Compose agents with distinct capabilities and permission levels |
| **SQL & Data Analysis** | Connect to databases, run queries, and analyze results directly in your terminal |
| **Report Generation** | Auto-generate executive summaries, stakeholder reports, and technical documentation |
| **Dashboard Automation** | Create interactive dashboards from your data with AI assistance |
| **Persistent Memory** | Cross-session memory powered by SQLite FTS5 full-text search |
| **Intelligent Context** | Automatic checkpoints, context reconstruction, and budgeted injection |
| **Task Tracking** | Tree-shaped task system (`T1`, `T1.1`, `T1.2`...) integrated with checkpoints |
| **Subagent System** | Spawn parallel subagents for independent analysis work |
| **Goal-Driven Sessions** | `/goal` sets stopping conditions with independent judge evaluation |
| **Voice Input** | Real-time streaming voice via MiMo ASR |
| **Knowledge Management** | `/dream` extracts knowledge, `/distill` packages workflows into skills |
| **MCP Integration** | Connect external tool servers via JSON-RPC |
| **Self-Evolution** | Modify capabilities through `.mimocode/` configuration |

---

## Quick Start

### Installation

```bash
# Install via npm (recommended)
npm install -g @opendash-ai/cli

# Or install via curl (macOS / Linux)
curl -fsSL https://opendash-ai.vercel.app/install | bash

# Or install via Bun
bun install -g @opendash-ai/cli
```

### First Run

```bash
opendash
```

On first launch, OpenDash guides you through configuration:

1. **Choose a provider** — OpenDash free channel, Xiaomi MiMo, Claude Code import, or custom
2. **Authenticate** — OAuth flow or API key
3. **Select a model** — Pick the default model for your sessions
4. **Start analyzing** — The TUI loads immediately

---

## Usage

### Launching

```bash
opendash                    # Start in current directory
opendash /path/to/project   # Start in specific directory
opendash --help             # Show all options
```

### Navigation

| Key | Action |
|-----|--------|
| `Tab` | Switch between agents (Build, Plan, Compose) |
| `Enter` | Send message |
| `Ctrl+C` | Cancel operation |
| `?` | Open help |

### Commands (inside TUI)

| Command | Description |
|---------|-------------|
| `/goal <condition>` | Set session stopping condition |
| `/voice` | Activate voice input |
| `/dream` | Extract session knowledge into memory |
| `/distill` | Package repeated workflows into skills |
| `/connect` | Sign in to provider accounts |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    TUI Layer                     │
├─────────────────────────────────────────────────┤
│                  Agent System                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Build   │  │   Plan   │  │ Compose  │      │
│  │ (primary)│  │ (primary)│  │ (primary)│      │
│  └──────────┘  └──────────┘  └──────────┘      │
│       │              │              │             │
│  ┌──────────────────────────────────────────┐   │
│  │           Subagent Runtime               │   │
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

For detailed architecture documentation, see [docs/architecture.md](./docs/architecture.md).

---

## Documentation

Full documentation is available in the [`docs/`](./docs) directory:

| Document | Description |
|----------|-------------|
| [Getting Started](./docs/getting-started.md) | Installation, first run, and configuration |
| [Architecture](./docs/architecture.md) | System design, agent model, and permission layers |
| [Configuration](./docs/configuration.md) | All config options for `.opendash/opendash.json` |
| [Agents Guide](./docs/agents.md) | Build, Plan, and Compose agents in depth |
| [Memory System](./docs/memory.md) | Project memory, checkpoints, and session persistence |
| [Skills & Workflows](./docs/skills.md) | Creating, installing, and using skills |
| [CLI Reference](./docs/cli.md) | Commands, flags, and slash commands |

---

## Platform Support

| Platform | Status |
|----------|--------|
| macOS | Supported |
| Linux | Supported |
| Windows | Supported (WSL recommended) |

<details>
<summary><strong>Windows: WSL Setup</strong></summary>

For best experience on Windows, use WSL2:

```bash
wsl --install
sudo apt install xsel  # For clipboard support
```

</details>

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

### Development

```bash
# Clone the repository
git clone https://github.com/jagbiryadav/opendash.git
cd opendash

# Install dependencies
bun install

# Start development
bun dev
```

### Project Structure

```
opendash/
├── packages/
│   ├── opencode/          # Core CLI and TUI
│   ├── desktop/           # Electron desktop app
│   ├── app/               # Web application
│   ├── console/           # Management console
│   ├── sdk/js/            # JavaScript SDK
│   ├── plugin/            # Plugin system
│   ├── ui/                # UI components
│   └── web/               # Documentation website
├── docs/                  # Documentation
├── scripts/               # Build and release scripts
└── patches/               # Dependency patches
```

---

## Security

For security vulnerabilities, please see our [Security Policy](./SECURITY.md).

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">
  Built with care by the <a href="https://opendash-ai.vercel.app">OpenDash</a> team
</p>
