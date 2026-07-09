declare global {
  const OPENDASH_VERSION: string
  const OPENDASH_CHANNEL: string
}

// Read version from package.json as fallback for dev environments
const pkgVersion: string | undefined = (() => {
  try {
    const { readFileSync } = require("fs") as typeof import("fs")
    const { join } = require("path") as typeof import("path")
    // Walk up from __dirname to find packages/opencode/package.json
    let dir = __dirname
    for (let i = 0; i < 10; i++) {
      const candidate = join(dir, "package.json")
      try {
        const raw = readFileSync(candidate, "utf-8")
        const pkg = JSON.parse(raw) as { name?: string; version?: string }
        if (pkg.name === "opendash" || pkg.name === "@opendash-ai/opendash" || pkg.name === "@opendash-ai/cli") return pkg.version
      } catch {}
      const parent = join(dir, "..")
      if (parent === dir) break
      dir = parent
    }
    return undefined
  } catch {
    return undefined
  }
})()

export const InstallationVersion = typeof OPENDASH_VERSION === "string" ? OPENDASH_VERSION : (pkgVersion ?? "0.1.0")
export const InstallationChannel = typeof OPENDASH_CHANNEL === "string" ? OPENDASH_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
