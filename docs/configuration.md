# Configuration Reference

OpenDash is configured via JSON files at two levels:

- **Project-level**: `.opendash/opendash.json` (in your project root)
- **Global**: `~/.config/opendash/opendash.json`

Project-level settings override global settings.

## Schema

```jsonc
{
  "$schema": "https://opendash-ai.vercel.app/config.json"
}
```

## Provider Configuration

### Built-in Providers

#### OpenDash Free Tier

No configuration needed. Selected automatically on first run.

#### Xiaomi MiMo

```jsonc
{
  "provider": "mimo"
}
```

#### Import from Claude Code

Migrates existing Claude Code authentication:

```jsonc
{
  "provider": "claude-code"
}
```

### Custom Providers

Add any OpenAI-compatible API:

```jsonc
{
  "provider": {
    "my-api": {
      "options": {
        "baseURL": "https://api.example.com/v1",
        "apiKey": "sk-..."
      },
      "models": {
        "gpt-4": { "name": "GPT-4" },
        "gpt-3.5-turbo": { "name": "GPT-3.5 Turbo" }
      }
    }
  }
}
```

## Model Selection

```jsonc
{
  "model": "mimo/mimo-v2.5-pro"
}
```

The format is `provider/model-id`. Available models depend on your configured provider.

## Agent Configuration

### Custom Agents

Define additional agents with specific behaviors:

```jsonc
{
  "agent": {
    "reviewer": {
      "description": "Code review specialist",
      "model": "mimo/mimo-v2.5-pro",
      "system": "You are a senior code reviewer. Focus on correctness, security, and maintainability.",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    }
  }
}
```

### Agent Permissions

Override default permissions per-agent:

```jsonc
{
  "agent": {
    "plan": {
      "permission": {
        "edit": "deny",
        "write": "deny"
      }
    }
  }
}
```

## Permission Configuration

Control tool access globally:

```jsonc
{
  "permission": {
    "external_directory": {
      "/tmp/**": "allow",
      "/home/user/**": "allow"
    },
    "bash": "ask",
    "edit": "allow"
  }
}
```

### Permission Levels

| Value | Behavior |
|-------|----------|
| `"allow"` | Always permitted |
| `"ask"` | Prompts for approval |
| `"deny"` | Always blocked |

## Checkpoint Configuration

```jsonc
{
  "checkpoint": {
    "enabled": true,
    "task_archive_days": 7,
    "max_checkpoints": 50
  }
}
```

## Memory Configuration

```jsonc
{
  "memory": {
    "enabled": true,
    "cc_index": false
  }
}
```

Set `cc_index: true` to index Claude Code memory under the `cc` scope.

## MCP Servers

Connect external tool servers:

```jsonc
{
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "ghp_..."
        }
      }
    }
  }
}
```

## Voice Configuration

```jsonc
{
  "voice": {
    "enabled": true,
    "asr_model": "mimo/mimo-v2.5-asr",
    "control_model": "mimo/mimo-v2.5"
  }
}
```

### Voice with Custom Providers

```jsonc
{
  "voice": {
    "asr_model": "internal/xiaomi/mimo-v2.5-asr",
    "control_model": "internal/xiaomi/mimo-v2.5"
  }
}
```

## Experimental Features

### Max Mode

Parallel best-of-N reasoning with judge selection:

```jsonc
{
  "experimental": {
    "maxMode": true,
    "maxModeCandidates": 3
  }
}
```

## Theme and Keybindings

```jsonc
{
  "theme": {
    "name": "default",
    "colors": {
      "primary": "#6366f1",
      "background": "#0f172a"
    }
  },
  "keybindings": {
    "switchAgent": "Tab",
    "cancel": "Ctrl+C",
    "clear": "Ctrl+L"
  }
}
```

## Complete Example

```jsonc
{
  "$schema": "https://opendash-ai.vercel.app/config.json",
  "provider": "mimo",
  "model": "mimo/mimo-v2.5-pro",
  "checkpoint": {
    "enabled": true,
    "task_archive_days": 7
  },
  "memory": {
    "enabled": true
  },
  "permission": {
    "external_directory": {
      "/tmp/**": "allow"
    }
  },
  "experimental": {
    "maxMode": false
  }
}
```
