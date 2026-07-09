import { createEffect, createSignal, on, onCleanup, type Accessor } from "solid-js"
import { debounce, type Scheduled } from "@solid-primitives/scheduled"

export function createDebouncedSignal<T>(value: T, ms: number): [Accessor<T>, Scheduled<[value: T]>] {
  const [get, set] = createSignal(value)
  return [get, debounce((v: T) => set(() => v), ms)]
}

export function createFadeIn(show: Accessor<boolean>, enabled: Accessor<boolean>) {
  const [alpha, setAlpha] = createSignal(show() ? 1 : 0)
  let revealed = show()

  createEffect(
    on([show, enabled], ([visible, animate]) => {
      if (!visible) {
        setAlpha(0)
        return
      }

      if (!animate || revealed) {
        revealed = true
        setAlpha(1)
        return
      }

      const start = performance.now()
      revealed = true
      setAlpha(0)

      const timer = setInterval(() => {
        const progress = Math.min((performance.now() - start) / 160, 1)
        setAlpha(progress * progress * (3 - 2 * progress))
        if (progress >= 1) clearInterval(timer)
      }, 16)

      onCleanup(() => clearInterval(timer))
    }),
  )

  return alpha
}

export function createFadeOut(active: Accessor<boolean>, enabled: Accessor<boolean>, duration = 120) {
  const [alpha, setAlpha] = createSignal(active() ? 1 : 0)

  createEffect(
    on([active, enabled], ([isActive, animate]) => {
      if (isActive) {
        setAlpha(1)
        return
      }

      if (!animate) {
        setAlpha(0)
        return
      }

      const start = performance.now()
      const timer = setInterval(() => {
        const elapsed = performance.now() - start
        const progress = Math.min(elapsed / duration, 1)
        setAlpha(1 - progress * progress * (3 - 2 * progress))
        if (progress >= 1) clearInterval(timer)
      }, 16)

      onCleanup(() => clearInterval(timer))
    }),
  )

  return alpha
}
