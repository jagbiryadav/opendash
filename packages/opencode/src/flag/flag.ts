import { Config } from "effect"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

function number(key: string) {
  const value = process.env[key]
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

const OPENDASH_EXPERIMENTAL = truthy("OPENDASH_EXPERIMENTAL")

// Defaults to false. When enabled, opendash runs in pure-mimo mode:
//   — does NOT inherit Claude Code's settings (CLAUDE.md, ~/.claude/skills, etc.)
//   — does NOT pick up provider API keys from environment variables
//   — falls back to the mimo-auto model as the default
// Set OPENDASH_MIMO_ONLY=true to disable .claude inheritance and env-based
// provider auto-detection.
const OPENDASH_MIMO_ONLY = truthy("OPENDASH_MIMO_ONLY")
const OPENDASH_DISABLE_CLAUDE_CODE_ENV = truthy("OPENDASH_DISABLE_CLAUDE_CODE")
const OPENDASH_DISABLE_CLAUDE_CODE = OPENDASH_MIMO_ONLY || OPENDASH_DISABLE_CLAUDE_CODE_ENV

const OPENDASH_DISABLE_EXTERNAL_SKILLS = truthy("OPENDASH_DISABLE_EXTERNAL_SKILLS")
const OPENDASH_DISABLE_CLAUDE_CODE_SKILLS =
  OPENDASH_DISABLE_EXTERNAL_SKILLS || OPENDASH_DISABLE_CLAUDE_CODE || truthy("OPENDASH_DISABLE_CLAUDE_CODE_SKILLS")
const copy = process.env["OPENDASH_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  OPENDASH_AUTO_SHARE: truthy("OPENDASH_AUTO_SHARE"),
  OPENDASH_AUTO_HEAP_SNAPSHOT: truthy("OPENDASH_AUTO_HEAP_SNAPSHOT"),
  OPENDASH_GIT_BASH_PATH: process.env["OPENDASH_GIT_BASH_PATH"],
  OPENDASH_CONFIG: process.env["OPENDASH_CONFIG"],
  OPENDASH_CONFIG_CONTENT: process.env["OPENDASH_CONFIG_CONTENT"],

  OPENDASH_DISABLE_AUTOUPDATE: truthy("OPENDASH_DISABLE_AUTOUPDATE"),

  // Defaults to false (rotation enabled). When enabled, the active log file is
  // never archived to <name>.log.<stamp> on hitting MAX_FILE_SIZE — it grows in
  // place. Useful when an external tool tails/manages the single log file.
  OPENDASH_DISABLE_LOG_ROTATION: truthy("OPENDASH_DISABLE_LOG_ROTATION"),

  // Defaults to true (analytics enabled). Set OPENDASH_ENABLE_ANALYSIS=false
  // to opt out of POSTing model_call/tool_call/agent_request metrics.
  OPENDASH_ENABLE_ANALYSIS: !falsy("OPENDASH_ENABLE_ANALYSIS"),
  OPENDASH_ALWAYS_NOTIFY_UPDATE: truthy("OPENDASH_ALWAYS_NOTIFY_UPDATE"),
  OPENDASH_DISABLE_PRUNE: truthy("OPENDASH_DISABLE_PRUNE"),
  OPENDASH_DISABLE_TERMINAL_TITLE: truthy("OPENDASH_DISABLE_TERMINAL_TITLE"),
  OPENDASH_SHOW_TTFD: truthy("OPENDASH_SHOW_TTFD"),
  OPENDASH_PERMISSION: process.env["OPENDASH_PERMISSION"],
  OPENDASH_DISABLE_DEFAULT_PLUGINS: truthy("OPENDASH_DISABLE_DEFAULT_PLUGINS"),
  OPENDASH_DISABLE_LSP_DOWNLOAD: truthy("OPENDASH_DISABLE_LSP_DOWNLOAD"),
  OPENDASH_ENABLE_EXPERIMENTAL_MODELS: truthy("OPENDASH_ENABLE_EXPERIMENTAL_MODELS"),
  OPENDASH_DISABLE_AUTOCOMPACT: truthy("OPENDASH_DISABLE_AUTOCOMPACT"),
  OPENDASH_DISABLE_MODELS_FETCH: truthy("OPENDASH_DISABLE_MODELS_FETCH"),
  OPENDASH_DISABLE_MOUSE: truthy("OPENDASH_DISABLE_MOUSE"),
  OPENDASH_OUTPUT_LENGTH_CONTINUATION_LIMIT: number("OPENDASH_OUTPUT_LENGTH_CONTINUATION_LIMIT") ?? 3,
  OPENDASH_INVALID_OUTPUT_CONTINUATION_LIMIT: number("OPENDASH_INVALID_OUTPUT_CONTINUATION_LIMIT") ?? 2,
  OPENDASH_TEXT_TOOL_CALL_RETRY_LIMIT: number("OPENDASH_TEXT_TOOL_CALL_RETRY_LIMIT") ?? 2,

  // Consecutive-block repetition detection for streamed reasoning + text.
  // A block of at least N tokens repeating REPEAT_THRESHOLD times consecutively
  // within the last WINDOW_TOKENS tokens triggers recovery (remind → replan → terminate).
  OPENDASH_TEXT_NGRAM_N: number("OPENDASH_TEXT_NGRAM_N") ?? 4,
  OPENDASH_TEXT_REPEAT_THRESHOLD: number("OPENDASH_TEXT_REPEAT_THRESHOLD") ?? 20,
  OPENDASH_TEXT_WINDOW_TOKENS: number("OPENDASH_TEXT_WINDOW_TOKENS") ?? 500,

  // Caps applied to image attachments before a prompt is sent. Both default to
  // undefined (no limit). OPENDASH_MAX_PROMPT_IMAGES bounds how many images may
  // be sent per request (oldest excess images are dropped); OPENDASH_MAX_PROMPT_IMAGE_SIZE
  // bounds the decoded byte size of a single image. Values must be positive integers.
  OPENDASH_MAX_PROMPT_IMAGES: number("OPENDASH_MAX_PROMPT_IMAGES"),
  OPENDASH_MAX_PROMPT_IMAGE_SIZE: number("OPENDASH_MAX_PROMPT_IMAGE_SIZE"),
  OPENDASH_MIMO_ONLY,
  OPENDASH_DISABLE_PROVIDER_ENV: OPENDASH_MIMO_ONLY || truthy("OPENDASH_DISABLE_PROVIDER_ENV"),
  OPENDASH_DISABLE_CLAUDE_CODE,
  get OPENDASH_DISABLE_CLAUDE_CODE_MCP() {
    // MCP compatibility stays on in mimo-only mode so users can reuse Claude Code
    // MCP servers without inheriting prompts, skills, or provider env keys.
    return OPENDASH_DISABLE_CLAUDE_CODE_ENV || truthy("OPENDASH_DISABLE_CLAUDE_CODE_MCP")
  },
  OPENDASH_DISABLE_CLAUDE_CODE_PROMPT: OPENDASH_DISABLE_CLAUDE_CODE || truthy("OPENDASH_DISABLE_CLAUDE_CODE_PROMPT"),
  // Defaults to false (enabled): markdown commands under ~/.claude/commands and
  // {project}/.claude/commands load as slash commands. Independent of the
  // mimo-only master switch. Set OPENDASH_DISABLE_CLAUDE_CODE_COMMANDS=true to disable.
  OPENDASH_DISABLE_CLAUDE_CODE_COMMANDS: truthy("OPENDASH_DISABLE_CLAUDE_CODE_COMMANDS"),
  OPENDASH_DISABLE_CLAUDE_CODE_SKILLS,
  OPENDASH_DISABLE_EXTERNAL_SKILLS,
  OPENDASH_DISABLE_CODEX_SKILLS: OPENDASH_DISABLE_EXTERNAL_SKILLS || truthy("OPENDASH_DISABLE_CODEX_SKILLS"),
  OPENDASH_DISABLE_OPENCODE_SKILLS: OPENDASH_DISABLE_EXTERNAL_SKILLS || truthy("OPENDASH_DISABLE_OPENCODE_SKILLS"),
  OPENDASH_FAKE_VCS: process.env["OPENDASH_FAKE_VCS"],

  // When enabled, skips all git subprocess calls during project discovery
  // (which git, rev-parse --git-common-dir, rev-parse --show-toplevel) and
  // branch detection. The project is treated as a non-git directory rooted at
  // the working directory. Use to avoid touching git in restricted/sandboxed
  // environments or where git startup probing is undesirable.
  OPENDASH_DISABLE_GIT: truthy("OPENDASH_DISABLE_GIT"),
  OPENDASH_SERVER_PASSWORD: process.env["OPENDASH_SERVER_PASSWORD"],
  OPENDASH_SERVER_USERNAME: process.env["OPENDASH_SERVER_USERNAME"],
  OPENDASH_ENABLE_QUESTION_TOOL: truthy("OPENDASH_ENABLE_QUESTION_TOOL"),

  // Defaults to false. The edit tool does pure exact-string matching with
  // explicit error signals. Set OPENDASH_ENABLE_FUZZY_EDIT=true to opt into the
  // legacy multi-stage fuzzy fallback chain (line-trimmed / block-anchor /
  // whitespace-normalized / indentation-flexible / etc.) when old_string fails
  // to match exactly.
  OPENDASH_ENABLE_FUZZY_EDIT: truthy("OPENDASH_ENABLE_FUZZY_EDIT"),

  // Experimental
  OPENDASH_EXPERIMENTAL,
  OPENDASH_EXPERIMENTAL_FILEWATCHER: Config.boolean("OPENDASH_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  OPENDASH_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("OPENDASH_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  OPENDASH_EXPERIMENTAL_ICON_DISCOVERY: OPENDASH_EXPERIMENTAL || truthy("OPENDASH_EXPERIMENTAL_ICON_DISCOVERY"),
  OPENDASH_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("OPENDASH_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  OPENDASH_ENABLE_EXA: truthy("OPENDASH_ENABLE_EXA") || OPENDASH_EXPERIMENTAL || truthy("OPENDASH_EXPERIMENTAL_EXA"),
  OPENDASH_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS: number("OPENDASH_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS"),
  // Token-efficient post-cleanse: strip ANSI / fold \r progress bars / redact
  // secrets / elide super-long lines from bash tool output before it is
  // returned to the model. Only applies when the output fits inline — if the
  // output spills to a truncation file, cleaning is skipped so the on-disk
  // archive stays raw. Off by default. Set to 1/true to opt in.
  OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY: truthy("OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY"),
  // Tunables for the token-efficient post-cleanse pipeline (see
  // src/tool/bash_token_efficient_pipeline.ts). Positive integers only;
  // unset / non-positive values fall back to the documented defaults.
  //   MAX_LINE_CHARS   threshold above which a single line is elided  (default 500)
  //   LINE_HEAD_KEEP   chars kept from the head of an elided line     (default 160)
  //   NEVER_WORSE_MARGIN  bytes the cleaned output must beat the raw  (default 0)
  OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_MAX_LINE_CHARS: number("OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_MAX_LINE_CHARS") ?? 500,
  OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_LINE_HEAD_KEEP: number("OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_LINE_HEAD_KEEP") ?? 160,
  OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_NEVER_WORSE_MARGIN: number("OPENDASH_EXPERIMENTAL_TOKEN_EFFICIENCY_NEVER_WORSE_MARGIN") ?? 0,
  OPENDASH_EXPERIMENTAL_OUTPUT_TOKEN_MAX: number("OPENDASH_EXPERIMENTAL_OUTPUT_TOKEN_MAX"),
  OPENDASH_EXPERIMENTAL_OXFMT: OPENDASH_EXPERIMENTAL || truthy("OPENDASH_EXPERIMENTAL_OXFMT"),
  OPENDASH_EXPERIMENTAL_LSP_TY: truthy("OPENDASH_EXPERIMENTAL_LSP_TY"),
  OPENDASH_EXPERIMENTAL_LSP_TOOL: OPENDASH_EXPERIMENTAL || truthy("OPENDASH_EXPERIMENTAL_LSP_TOOL"),
  // Defaults to true: dynamic workflow + built-in deep-research are on by default.
  // Set OPENDASH_EXPERIMENTAL_WORKFLOW_TOOL=false to opt out. The env-var name is
  // kept for backwards compat (long-running experiments still pass it as `1`).
  OPENDASH_EXPERIMENTAL_WORKFLOW_TOOL: !falsy("OPENDASH_EXPERIMENTAL_WORKFLOW_TOOL"),
  OPENDASH_EXPERIMENTAL_MARKDOWN: !falsy("OPENDASH_EXPERIMENTAL_MARKDOWN"),
  OPENDASH_MODELS_URL: process.env["OPENDASH_MODELS_URL"],
  OPENDASH_MODELS_PATH: process.env["OPENDASH_MODELS_PATH"],
  OPENDASH_DISABLE_EMBEDDED_WEB_UI: truthy("OPENDASH_DISABLE_EMBEDDED_WEB_UI"),
  OPENDASH_DB: process.env["OPENDASH_DB"],

  // Defaults to true — all channels share a single opendash.db. The per-channel
  // DB isolation (opendash-{channel}.db) is unnecessary for opendash since we
  // don't ship multiple release channels yet. Use OPENDASH_HOME to isolate dev
  // environments instead. Set OPENDASH_DISABLE_CHANNEL_DB=false to restore
  // per-channel isolation.
  OPENDASH_DISABLE_CHANNEL_DB: !falsy("OPENDASH_DISABLE_CHANNEL_DB"),
  OPENDASH_SKIP_MIGRATIONS: truthy("OPENDASH_SKIP_MIGRATIONS"),
  OPENDASH_STRICT_CONFIG_DEPS: truthy("OPENDASH_STRICT_CONFIG_DEPS"),

  OPENDASH_WORKSPACE_ID: process.env["OPENDASH_WORKSPACE_ID"],
  OPENDASH_EXPERIMENTAL_HTTPAPI: truthy("OPENDASH_EXPERIMENTAL_HTTPAPI"),
  OPENDASH_EXPERIMENTAL_WORKSPACES: OPENDASH_EXPERIMENTAL || truthy("OPENDASH_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.

  // Disables compose-agent-internal skills (e.g. compose:plan, compose:review,
  // compose:tdd). These are hidden workflow-orchestration skills only visible
  // to the compose agent and are NOT part of builtin skills.
  get OPENDASH_DISABLE_COMPOSE_SKILLS() {
    return truthy("OPENDASH_DISABLE_COMPOSE_SKILLS")
  },
  // Disables user-facing builtin skills shipped with the binary (e.g.
  // self-extend). Does not affect compose skills — the two sets are
  // independent and non-overlapping.
  get OPENDASH_DISABLE_BUILTIN_SKILLS() {
    return truthy("OPENDASH_DISABLE_BUILTIN_SKILLS")
  },
  get OPENDASH_DISABLE_PROJECT_CONFIG() {
    return truthy("OPENDASH_DISABLE_PROJECT_CONFIG")
  },
  get OPENDASH_TUI_CONFIG() {
    return process.env["OPENDASH_TUI_CONFIG"]
  },
  get OPENDASH_CONFIG_DIR() {
    return process.env["OPENDASH_CONFIG_DIR"]
  },
  get OPENDASH_HOME() {
    return process.env["OPENDASH_HOME"]
  },
  get OPENDASH_PURE() {
    return truthy("OPENDASH_PURE")
  },
  get OPENDASH_PLUGIN_META_FILE() {
    return process.env["OPENDASH_PLUGIN_META_FILE"]
  },
  get OPENDASH_CLIENT() {
    return process.env["OPENDASH_CLIENT"] ?? "cli"
  },
}
