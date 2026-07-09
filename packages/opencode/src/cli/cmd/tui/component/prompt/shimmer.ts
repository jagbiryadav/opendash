import { RGBA } from "@opentui/core"

const WHITE = RGBA.fromInts(255, 255, 255)
const BUILD_COLOR = RGBA.fromInts(3, 76, 255)
const PLAN_COLOR = RGBA.fromInts(255, 77, 106)

export function getAgentBrandColor(agentName: string, time?: number): RGBA {
  const name = agentName?.toLowerCase() ?? ""
  if (name === "build") return BUILD_COLOR
  if (name === "plan") return PLAN_COLOR
  if (name === "compose") return rainbowColor(time ?? performance.now(), 0)
  return BUILD_COLOR
}

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  return clamped * clamped * (3 - 2 * clamped)
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export function rainbowColor(time: number, x: number): RGBA {
  const hue = ((time * 0.05) + (x * 12)) % 360
  const [r, g, b] = hslToRgb(hue, 80, 55)
  return RGBA.fromInts(r, g, b)
}

export function sweepBrightness(x: number, width: number, progress: number): number {
  const head = -3 + (width + 6) * smoothstep(progress)
  const dx = x + 0.5 - head
  const band = Math.exp(-((dx / 4.5) ** 2))
  const core = Math.exp(-((dx / 1.3) ** 2)) * 1.7
  const env = Math.sin(progress * Math.PI)
  return (band * 0.7 + core) * env * 1.5
}

export function tintBorder(base: RGBA, brightness: number): RGBA {
  if (brightness <= 0) return base

  const mid = tint(base, WHITE, 0.4)
  const high = tint(base, WHITE, 0.8)

  if (brightness <= 1) {
    return tint(base, mid, Math.sqrt(brightness) * 0.7)
  }
  return tint(mid, high, 1 - Math.exp(-2.4 * (brightness - 1)))
}

function tint(a: RGBA, b: RGBA, t: number): RGBA {
  return RGBA.fromInts(
    Math.round(a.r + (b.r - a.r) * t),
    Math.round(a.g + (b.g - a.g) * t),
    Math.round(a.b + (b.b - a.b) * t),
  )
}
