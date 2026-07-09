<h1 align="center">OpenDash</h1>

<p align="center"><strong>Open Dash: Where Models and Agents Co-Evolve</strong></p>

<p align="center">
  <a href="https://opendashai.netlify.app/analyst">Website</a> | <a href="https://opendashai.netlify.app/en/blog/opendash">Blog</a> | <a href="https://github.com/jagbiryadav/opendash">GitHub</a>
</p>

---

OpenDash is a terminal-native AI coding assistant. It can read and write code, run commands, manage Git, and use a persistent memory system to keep a deep understanding of your project across sessions while continuously improving itself.

OpenDash is built in as a free-for-limited-time channel, so you can start with zero configuration. OpenDash also supports connecting to any mainstream LLM provider API.

---

## Quick Start

```bash
# One-line install
curl -fsSL https://opendashai.netlify.app/install | bash

# Or install via npm
npm install -g @opendash-ai/cli

# Run
opendash
```

The first launch guides you through configuration automatically. Supported options:
- **OpenDash (free for a limited time)** — anonymous channel, zero configuration
- **Xiaomi MiMo Platform** — OAuth login
- **Import from Claude Code** — migrate existing authentication in one step
- **Custom Provider** — add any OpenAI-compatible API in the TUI

---

## Core Features

- **Multiple Agents** — build (default), plan (read-only analysis), compose (specs-driven orchestration); press `Tab` to switch
- **Persistent Memory** — cross-session project knowledge, checkpoints, and task progress powered by SQLite FTS5
- **Intelligent Context Management** — automatic checkpoints, context reconstruction, and budgeted injection to stay within model limits
- **Task Tracking** — tree-shaped task system integrated with the checkpoint system
- **Subagent System** — parallel subagents with lifecycle tracking, cancellation, and background execution
- **Goal / Stop Condition** — judge model prevents premature stops during autonomous work
- **Compose Mode** — structured workflow for specs-driven development with built-in skills
- **Voice Input** — real-time streaming voice input powered by TenVAD and MiMo ASR
- **Dream & Distill** — extract knowledge into memory (`/dream`) and discover reusable workflows (`/distill`)

For detailed documentation, configuration options, and troubleshooting, see the [GitHub repository](https://github.com/jagbiryadav/opendash).

---

## License

Source code is licensed under the [MIT License](https://github.com/jagbiryadav/opendash/blob/main/LICENSE).

Use of OpenDash is also subject to the [Use Restrictions](https://github.com/jagbiryadav/opendash/blob/main/USE_RESTRICTIONS.md).
Use of Xiaomi MiMo-hosted services is subject to the [MiMo Terms of Service](https://platform.opendashai.netlify.app/docs/terms/user-agreement).
Use of the MiMo name, logo, and trademarks is subject to the MiMo Trademark Policy.
