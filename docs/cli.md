# CLI Reference

OpenDash provides a command-line interface and an in-TUI command system.

## Installation

```bash
npm install -g @opendash-ai/cli
```

## Global Commands

```bash
opendash                    # Launch the TUI
opendash --help             # Show help
opendash --version          # Show version
opendash config             # Open configuration
opendash config --path      # Show config file path
```

## TUI Slash Commands

Commands available inside the TUI (type `/` to see the list):

| Command | Description |
|---------|-------------|
| `/goal <condition>` | Set a session stopping condition |
| `/voice` | Activate voice input mode |
| `/dream` | Extract session knowledge into memory |
| `/distill` | Package repeated workflows into skills |
| `/connect` | Sign in to provider accounts |
| `/help` | Show available commands |
| `/clear` | Clear the current session |
| `/compact` | Manually trigger context compaction |

### /goal

Sets a stopping condition. An independent judge evaluates completion.

```
/goal All tests pass and documentation is updated
```

### /voice

Activates real-time voice input. Speak naturally — audio is transcribed incrementally.

**Requirements:**
- `sox` installed (`brew install sox` on macOS)
- MiMo logged-in user (for ASR model)

### /dream

Scans recent session traces and extracts persistent knowledge into project memory. Removes outdated entries.

### /distill

Discovers repeated manual workflows and packages them into reusable skills, subagents, or commands.

### /connect

Opens the provider authentication flow. Use to sign in to:
- Xiaomi MiMo
- OpenRouter
- Other supported providers

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Switch between primary agents |
| `Enter` | Send message |
| `Ctrl+C` | Cancel current operation |
| `Ctrl+L` | Clear screen |
| `Ctrl+K` | Clear input line |
| `Up/Down` | Navigate message history |
| `?` | Open help |

## Agent Switching

Press `Tab` to cycle through available primary agents:

1. **Build** — Full development mode
2. **Plan** — Read-only analysis
3. **Compose** — Workflow orchestration

## Configuration Paths

| Platform | Path |
|----------|------|
| macOS | `~/.config/opendash/opendash.json` |
| Linux | `~/.config/opendash/opendash.json` |
| Windows | `%APPDATA%\opendash\opendash.json` |
| Project | `.opendash/opendash.json` |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENBASH_HOME` | Override default home directory |
| `OPENBASH_CONFIG` | Override config file path |
| `OPENBASH_LOG_LEVEL` | Set log level (`debug`, `info`, `warn`, `error`) |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Configuration error |
| `3` | Authentication error |
