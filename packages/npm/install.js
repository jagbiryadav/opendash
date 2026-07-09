#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const os = require("os")

const platform = os.platform()
const arch = os.arch()

const platformMap = {
  darwin: "darwin",
  linux: "linux",
  win32: "windows",
}

const archMap = {
  x64: "x64",
  arm64: "arm64",
}

const platformName = platformMap[platform]
const archName = archMap[arch]

if (!platformName || !archName) {
  console.error(`Unsupported platform: ${platform}/${arch}`)
  process.exit(1)
}

// Check for musl on Linux
let abi = ""
if (platformName === "linux") {
  try {
    if (fs.existsSync("/etc/alpine-release")) {
      abi = "-musl"
    } else {
      const { execSync } = require("child_process")
      const output = execSync("ldd --version 2>&1 || true", { encoding: "utf8" })
      if (output.toLowerCase().includes("musl")) {
        abi = "-musl"
      }
    }
  } catch {
    // ignore
  }
}

// Check for AVX2 on x64
let baseline = ""
if (archName === "x64") {
  let hasAvx2 = false

  if (platformName === "linux") {
    try {
      const cpuinfo = fs.readFileSync("/proc/cpuinfo", "utf8")
      hasAvx2 = /(^|\s)avx2(\s|$)/i.test(cpuinfo)
    } catch {
      // ignore
    }
  } else if (platformName === "darwin") {
    try {
      const { execSync } = require("child_process")
      const result = execSync("sysctl -n hw.optional.avx2_0", { encoding: "utf8", timeout: 1500 })
      hasAvx2 = result.trim() === "1"
    } catch {
      // ignore
    }
  } else if (platformName === "windows") {
    try {
      const { execSync } = require("child_process")
      const cmd = '(Add-Type -MemberDefinition "[DllImport(\\"kernel32.dll\\")] public static extern bool IsProcessorFeaturePresent(int ProcessorFeature);" -Name Kernel32 -Namespace Win32 -PassThru)::IsProcessorFeaturePresent(40)'
      const result = execSync(`powershell -NoProfile -NonInteractive -Command "${cmd}"`, {
        encoding: "utf8",
        timeout: 3000,
        windowsHide: true,
      })
      hasAvx2 = result.trim().toLowerCase() === "true" || result.trim() === "1"
    } catch {
      // ignore
    }
  }

  if (!hasAvx2) {
    baseline = "-baseline"
  }
}

// Build the package name
const pkgName = `@opendash-ai/opendash-${platformName}-${archName}${abi}${baseline}`
const binaryName = platform === "win32" ? "opendash.exe" : "opendash"

// Find the installed platform package
function findPackage() {
  const candidates = [
    // Same node_modules tree
    path.join(__dirname, "node_modules", pkgName, "bin", binaryName),
    // Hoisted to parent
    path.join(__dirname, "..", pkgName, "bin", binaryName),
    // Global installs
    path.join(__dirname, "..", "..", pkgName, "bin", binaryName),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

const binaryPath = findPackage()
if (!binaryPath) {
  console.error(`Could not find binary for ${pkgName}`)
  console.error("Try reinstalling: npm install -g @opendash-ai/cli")
  process.exit(1)
}

// Create bin directory and symlink/copy
const binDir = path.join(__dirname, "bin")
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true })
}

const targetPath = path.join(binDir, binaryName)

// Copy the binary
fs.copyFileSync(binaryPath, targetPath)

// Make executable on Unix
if (platform !== "win32") {
  fs.chmodSync(targetPath, 0o755)
}

// Also create the "analyst" alias
const aliasPath = path.join(binDir, "analyst")
if (!fs.existsSync(aliasPath)) {
  if (platform === "win32") {
    // On Windows, create a copy
    fs.copyFileSync(targetPath, aliasPath)
  } else {
    // On Unix, create a symlink
    try {
      fs.symlinkSync(binaryName, aliasPath)
    } catch {
      // Fallback to copy if symlink fails
      fs.copyFileSync(targetPath, aliasPath)
    }
  }
}

console.log(`OpenDash installed: ${targetPath}`)
