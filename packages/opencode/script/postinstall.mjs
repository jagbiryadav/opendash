#!/usr/bin/env node

import fs from "fs"
import path from "path"
import os from "os"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import { execSync } from "child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

function detectPlatform() {
  switch (os.platform()) {
    case "darwin": return "darwin"
    case "linux": return "linux"
    case "win32": return "windows"
    default: return os.platform()
  }
}

function detectArch() {
  switch (os.arch()) {
    case "x64": return "x64"
    case "arm64": return "arm64"
    default: return os.arch()
  }
}

function detectMusl() {
  if (os.platform() !== "linux") return false
  try {
    if (fs.existsSync("/etc/alpine-release")) return true
    const output = execSync("ldd --version 2>&1 || true", { encoding: "utf8", timeout: 3000 })
    return output.toLowerCase().includes("musl")
  } catch {
    return false
  }
}

function detectBaseline() {
  if (os.arch() !== "x64") return false
  let hasAvx2 = false

  if (os.platform() === "linux") {
    try {
      const cpuinfo = fs.readFileSync("/proc/cpuinfo", "utf8")
      hasAvx2 = /(^|\s)avx2(\s|$)/i.test(cpuinfo)
    } catch {}
  } else if (os.platform() === "darwin") {
    try {
      const result = execSync("sysctl -n hw.optional.avx2_0", { encoding: "utf8", timeout: 1500 })
      hasAvx2 = result.trim() === "1"
    } catch {}
  } else if (os.platform() === "win32") {
    try {
      const cmd = '(Add-Type -MemberDefinition "[DllImport(\\"kernel32.dll\\")] public static extern bool IsProcessorFeaturePresent(int ProcessorFeature);" -Name Kernel32 -Namespace Win32 -PassThru)::IsProcessorFeaturePresent(40)'
      const result = execSync(`powershell -NoProfile -NonInteractive -Command "${cmd}"`, {
        encoding: "utf8",
        timeout: 3000,
        windowsHide: true,
      })
      hasAvx2 = result.trim().toLowerCase() === "true" || result.trim() === "1"
    } catch {}
  }

  return !hasAvx2
}

function buildPackageName(platform, arch) {
  const musl = detectMusl() ? "-musl" : ""
  const baseline = detectBaseline() ? "-baseline" : ""
  return `@opendash-ai/opendash-${platform}-${arch}${musl}${baseline}`
}

function findBinary(packageName, platform) {
  const binaryName = platform === "windows" ? "opendash.exe" : "opendash"

  try {
    const packageJsonPath = require.resolve(`${packageName}/package.json`)
    const packageDir = path.dirname(packageJsonPath)
    const binaryPath = path.join(packageDir, "bin", binaryName)

    if (!fs.existsSync(binaryPath)) {
      throw new Error(`Binary not found at ${binaryPath}`)
    }

    return { binaryPath, binaryName }
  } catch (error) {
    throw new Error(`Could not find package ${packageName}: ${error.message}`, { cause: error })
  }
}

async function main() {
  const platform = detectPlatform()
  const arch = detectArch()
  const packageName = buildPackageName(platform, arch)

  try {
    const { binaryPath } = findBinary(packageName, platform)
    const target = path.join(__dirname, "bin", ".opendash")

    if (fs.existsSync(target)) fs.unlinkSync(target)

    try {
      fs.linkSync(binaryPath, target)
    } catch {
      fs.copyFileSync(binaryPath, target)
    }

    fs.chmodSync(target, 0o755)
    console.log(`OpenDash binary linked: ${target}`)
  } catch (error) {
    console.error(`Failed to setup OpenDash binary: ${error.message}`)
    process.exit(0)
  }
}

try {
  void main()
} catch (error) {
  console.error("Postinstall script error:", error.message)
  process.exit(0)
}
