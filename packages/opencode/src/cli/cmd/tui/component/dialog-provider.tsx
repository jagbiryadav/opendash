import { createMemo, createSignal, onMount, Show } from "solid-js"
import { useSync } from "@tui/context/sync"
import { filter, map, pipe, sortBy } from "remeda"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog, type DialogContext } from "@tui/ui/dialog"
import { useSDK } from "../context/sdk"
import { DialogPrompt } from "../ui/dialog-prompt"
import { Link } from "../ui/link"
import { useTheme } from "../context/theme"
import { TextAttributes } from "@opentui/core"
import type { ProviderAuthAuthorization, ProviderAuthMethod } from "@opendash-ai/sdk/v2"
import { DialogModel } from "./dialog-model"
import { useKeyboard } from "@opentui/solid"
import * as Clipboard from "@tui/util/clipboard"
import { useToast, type ToastContext } from "../ui/toast"
import { isConsoleManagedProvider } from "@tui/util/provider-origin"
import { isPopularProvider, PROVIDER_PRIORITY } from "@/util/provider-priority"

export function createDialogProviderOptions() {
  const sync = useSync()
  const dialog = useDialog()
  const sdk = useSDK()
  const toast = useToast()
  const { theme } = useTheme()
  const options = createMemo(() => {
    // Collect names of connected providers so we can deduplicate
    const connectedNames = new Set(
      sync.data.provider_next.all
        .filter((p) => sync.data.provider_next.connected.includes(p.id))
        .map((p) => p.name ?? p.id),
    )

    const list = pipe(
      sync.data.provider_next.all,
      // If a connected provider has the same name as an unconnected one, remove the unconnected duplicate
      filter((provider) => {
        const isConnected = sync.data.provider_next.connected.includes(provider.id)
        if (isConnected) return true
        return !connectedNames.has(provider.name ?? provider.id)
      }),
      sortBy((x) => PROVIDER_PRIORITY[x.id] ?? 99),
      map((provider) => {
        const consoleManaged = isConsoleManagedProvider(sync.data.console_state.consoleManagedProviders, provider.id)
        const connected = sync.data.provider_next.connected.includes(provider.id)

        return {
          title: provider.name ?? provider.id,
          value: provider.id,
          description: {
            anthropic: "(API key)",
            openai: "(ChatGPT Plus/Pro or API key)",
          }[provider.id],
          footer: consoleManaged ? sync.data.console_state.activeOrgName : undefined,
          category: provider.id === "opendash" ? "Imports" : isPopularProvider(provider.id) ? "Popular" : "Other",
          gutter: connected ? <text fg={theme.success}>✓</text> : undefined,
          async onSelect() {
            if (consoleManaged) return

            const stored = sync.data.provider_auth[provider.id]
            const methods: ProviderAuthMethod[] =
              stored && stored.length > 0
                ? stored
                : [
                    {
                      type: "api",
                      label: "API key",
                    },
                  ]
            let index: number | null = 0
            if (methods.length > 1) {
              index = await new Promise<number | null>((resolve) => {
                dialog.replace(
                  () => (
                    <DialogSelect
                      title="Select auth method"
                      options={methods.map((x, index) => ({
                        title: x.label,
                        value: index,
                      }))}
                      onSelect={(option) => resolve(option.value)}
                    />
                  ),
                  () => resolve(null),
                )
              })
            }
            if (index == null) return
            const method = methods[index]
            if (method.type === "oauth") {
              let inputs: Record<string, string> | undefined
              if (method.prompts?.length) {
                const value = await PromptsMethod({
                  dialog,
                  prompts: method.prompts,
                })
                if (!value) return
                inputs = value
              }

              const result = await sdk.client.provider.oauth.authorize({
                providerID: provider.id,
                method: index,
                inputs,
              })
              if (result.error) {
                toast.show({
                  variant: "error",
                  message: JSON.stringify(result.error),
                })
                dialog.clear()
                return
              }
              if (result.data?.method === "code") {
                dialog.replace(() => (
                  <CodeMethod
                    providerID={provider.id}
                    title={method.label}
                    index={index}
                    authorization={result.data!}
                  />
                ))
              }
              if (result.data?.method === "auto") {
                dialog.replace(() => (
                  <AutoMethod
                    providerID={provider.id}
                    title={method.label}
                    index={index}
                    authorization={result.data!}
                  />
                ))
              }
            }
            if (method.type === "api") {
              let metadata: Record<string, string> | undefined
              if (method.prompts?.length) {
                const value = await PromptsMethod({ dialog, prompts: method.prompts })
                if (!value) return
                metadata = value
              }
              return dialog.replace(() => (
                <ApiMethod providerID={provider.id} title={method.label} metadata={metadata} />
              ))
            }
          },
        }
      }),
    )
    return [
      ...list,
      {
        title: "+ Custom provider",
        value: "__custom__",
        description: undefined,
        footer: undefined,
        category: "Other",
        gutter: undefined,
        async onSelect() {
          await runCustomProviderWizard({ dialog, sdk, sync, toast })
        },
      },
    ]
  })
  return options
}

export function DialogProvider() {
  const options = createDialogProviderOptions()
  return <DialogSelect title="Connect a provider" options={options()} />
}

export async function runCustomProviderWizard(opts: {
  dialog: DialogContext
  sdk: ReturnType<typeof useSDK>
  sync: ReturnType<typeof useSync>
  toast: ToastContext
}) {
  const { dialog, sdk, sync, toast } = opts

  function step(n: number, total: number, title: string, placeholder?: string, value?: string) {
    return DialogPrompt.show(dialog, `${title} (${n}/${total})`, { placeholder, value })
  }

  const providerIDRaw = await step(1, 6, "Provider id", "e.g. mimorouter")
  if (providerIDRaw === null) return
  const providerID = providerIDRaw.trim()
  if (!providerID) return

  const nameRaw = await step(2, 6, "Display name", "e.g. MiMo Router", providerID)
  if (nameRaw === null) return
  const name = nameRaw.trim() || providerID

  const baseURLRaw = await step(3, 6, "Base URL", "https://.../v1")
  if (baseURLRaw === null) return
  const baseURL = baseURLRaw.trim()
  if (!baseURL) return

  const apiKeyRaw = await step(4, 6, "API key", "sk-...")
  if (apiKeyRaw === null) return
  const apiKey = apiKeyRaw.trim()
  if (!apiKey) return

  const modelIDRaw = await step(5, 6, "First model id", "e.g. claude-sonnet-4-6")
  if (modelIDRaw === null) return
  const modelID = modelIDRaw.trim()
  if (!modelID) return

  const modelNameRaw = await step(6, 6, "First model name", "e.g. Claude Sonnet 4.6", modelID)
  if (modelNameRaw === null) return
  const modelName = modelNameRaw.trim() || modelID

  const envKey = `${providerID.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}_API_KEY`
  const patch = {
    provider: {
      [providerID]: {
        name,
        npm: "@ai-sdk/openai-compatible",
        env: [envKey],
        options: {
          baseURL,
          setCacheKey: true,
        },
        models: {
          [modelID]: {
            name: modelName,
          },
        },
      },
    },
  } as const

  const updateRes = await sdk.client.global.config.update({ config: patch as any })
  if (updateRes.error) {
    toast.show({ variant: "error", message: JSON.stringify(updateRes.error) })
    return
  }

  const authRes = await sdk.client.auth.set({
    providerID,
    auth: { type: "api", key: apiKey },
  })
  if (authRes.error) {
    toast.show({ variant: "error", message: JSON.stringify(authRes.error) })
    return
  }

  await sdk.client.instance.dispose()
  await sync.bootstrap()
  dialog.replace(() => <DialogModel providerID={providerID} />)
}

interface AutoMethodProps {
  index: number
  providerID: string
  title: string
  authorization: ProviderAuthAuthorization
}
function AutoMethod(props: AutoMethodProps) {
  const { theme } = useTheme()
  const sdk = useSDK()
  const dialog = useDialog()
  const sync = useSync()
  const toast = useToast()

  useKeyboard((evt) => {
    if (evt.name === "c" && !evt.ctrl && !evt.meta) {
      const code = props.authorization.instructions.match(/[A-Z0-9]{4}-[A-Z0-9]{4,5}/)?.[0] ?? props.authorization.url
      Clipboard.copy(code)
        .then(() => toast.show({ message: "Copied to clipboard", variant: "info" }))
        .catch(toast.error)
    }
  })

  onMount(async () => {
    const result = await sdk.client.provider.oauth.callback({
      providerID: props.providerID,
      method: props.index,
    })
    if (result.error) {
      dialog.clear()
      return
    }
    await sdk.client.instance.dispose()
    await sync.bootstrap()
    dialog.replace(() => <DialogModel providerID={props.providerID} />)
  })

  return (
    <box paddingLeft={2} paddingRight={2} gap={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          {props.title}
        </text>
        <text fg={theme.textMuted} onMouseUp={() => dialog.clear()}>
          esc
        </text>
      </box>
      <box gap={1}>
        <Link href={props.authorization.url} fg={theme.primary} />
        <text fg={theme.textMuted}>{props.authorization.instructions}</text>
      </box>
      <text fg={theme.textMuted}>Waiting for authorization...</text>
      <text fg={theme.text}>
        c <span style={{ fg: theme.textMuted }}>copy</span>
      </text>
    </box>
  )
}

interface CodeMethodProps {
  index: number
  title: string
  providerID: string
  authorization: ProviderAuthAuthorization
}
function CodeMethod(props: CodeMethodProps) {
  const { theme } = useTheme()
  const sdk = useSDK()
  const sync = useSync()
  const dialog = useDialog()
  const [error, setError] = createSignal(false)

  return (
    <DialogPrompt
      title={props.title}
      placeholder="Authorization code"
      onConfirm={async (value) => {
        const { error } = await sdk.client.provider.oauth.callback({
          providerID: props.providerID,
          method: props.index,
          code: value,
        })
        if (!error) {
          await sdk.client.instance.dispose()
          await sync.bootstrap()
          dialog.replace(() => <DialogModel providerID={props.providerID} />)
          return
        }
        setError(true)
      }}
      description={() => (
        <box gap={1}>
          <text fg={theme.textMuted}>{props.authorization.instructions}</text>
          <Link href={props.authorization.url} fg={theme.primary} />
          <Show when={error()}>
            <text fg={theme.error}>Invalid code</text>
          </Show>
        </box>
      )}
    />
  )
}

interface ApiMethodProps {
  providerID: string
  title: string
  metadata?: Record<string, string>
}
function ApiMethod(props: ApiMethodProps) {
  const dialog = useDialog()
  const sdk = useSDK()
  const sync = useSync()
  const { theme } = useTheme()
  const [loading, setLoading] = createSignal(false)
  const [loadingMessage, setLoadingMessage] = createSignal("")

  return (
    <DialogPrompt
      title={props.title}
      placeholder="API key"
      busy={loading()}
      busyText={loadingMessage()}
      description={
        loading() ? (
          () => (
            <box gap={1}>
              <text fg={theme.textMuted}>
                Connected to provider. Discovering available models...
              </text>
            </box>
          )
        ) : (
          {
            opendash: (
              <box gap={1}>
                <text fg={theme.textMuted}>
                  Configure your own provider API key. Supported providers include OpenAI,
                  Anthropic, Gemini, OpenRouter, Groq, Together AI, Ollama and others.
                </text>
                <text fg={theme.text}>
                  Documentation:{" "}
                  <span style={{ fg: theme.primary }}>https://opendash-ai.vercel.app/docs/providers</span>
                </text>
              </box>
            ),
          }[props.providerID] ?? undefined
        )
      }
      onConfirm={async (value) => {
        if (!value) return
        setLoading(true)
        setLoadingMessage("Saving credentials...")
        try {
          await sdk.client.auth.set({
            providerID: props.providerID,
            auth: {
              type: "api",
              key: value,
              ...(props.metadata ? { metadata: props.metadata } : {}),
            },
          })
          setLoadingMessage("Connecting to provider...")
          await sdk.client.instance.dispose()
          setLoadingMessage("Fetching available models...")
          await sync.bootstrap()
          const provider = sync.data.provider.find((x) => x.id === props.providerID)
          const modelCount = provider ? Object.keys(provider.models).length : 0
          if (modelCount > 0) {
            setLoadingMessage(`Found ${modelCount} models`)
            await new Promise((resolve) => setTimeout(resolve, 800))
          }
          dialog.replace(() => <DialogModel providerID={props.providerID} />)
        } catch (e) {
          setLoading(false)
          setLoadingMessage("")
        }
      }}
    />
  )
}

interface PromptsMethodProps {
  dialog: ReturnType<typeof useDialog>
  prompts: NonNullable<ProviderAuthMethod["prompts"]>[number][]
}
async function PromptsMethod(props: PromptsMethodProps) {
  const inputs: Record<string, string> = {}
  for (const prompt of props.prompts) {
    if (prompt.when) {
      const value = inputs[prompt.when.key]
      if (value === undefined) continue
      const matches = prompt.when.op === "eq" ? value === prompt.when.value : value !== prompt.when.value
      if (!matches) continue
    }

    if (prompt.type === "select") {
      const value = await new Promise<string | null>((resolve) => {
        props.dialog.replace(
          () => (
            <DialogSelect
              title={prompt.message}
              options={prompt.options.map((x) => ({
                title: x.label,
                value: x.value,
                description: x.hint,
              }))}
              onSelect={(option) => resolve(option.value)}
            />
          ),
          () => resolve(null),
        )
      })
      if (value === null) return null
      inputs[prompt.key] = value
      continue
    }

    const value = await new Promise<string | null>((resolve) => {
      props.dialog.replace(
        () => (
          <DialogPrompt title={prompt.message} placeholder={prompt.placeholder} onConfirm={(value) => resolve(value)} />
        ),
        () => resolve(null),
      )
    })
    if (value === null) return null
    inputs[prompt.key] = value
  }
  return inputs
}
