import { describe, expect, test } from "bun:test"
import path from "path"
import { resolveMimocodeHome } from "@opendash-ai/shared/global"

describe("resolveMimocodeHome", () => {
  test("with OPENDASH_HOME set, resolves 4 subdirs under root", () => {
    const result = resolveMimocodeHome({
      OPENDASH_HOME: "/tmp/profile-a",
    })
    expect(result.mode).toBe("opendash_home")
    expect(result.root).toBe("/tmp/profile-a")
    expect(result.config).toBe(path.join("/tmp/profile-a", "config"))
    expect(result.data).toBe(path.join("/tmp/profile-a", "data"))
    expect(result.state).toBe(path.join("/tmp/profile-a", "state"))
    expect(result.cache).toBe(path.join("/tmp/profile-a", "cache"))
  })

  test("without OPENDASH_HOME, falls through to xdg mode", () => {
    const result = resolveMimocodeHome({})
    expect(result.mode).toBe("xdg")
    expect(result.root).toBeUndefined()
    // xdg paths end with "/opendash"
    expect(result.config.endsWith(path.join("", "opendash"))).toBe(true)
    expect(result.data.endsWith(path.join("", "opendash"))).toBe(true)
    expect(result.state.endsWith(path.join("", "opendash"))).toBe(true)
    expect(result.cache.endsWith(path.join("", "opendash"))).toBe(true)
  })

  test("empty OPENDASH_HOME string is treated as unset (xdg mode)", () => {
    const result = resolveMimocodeHome({ OPENDASH_HOME: "" })
    expect(result.mode).toBe("xdg")
  })

  test("relative OPENDASH_HOME path throws with clear error", () => {
    expect(() => resolveMimocodeHome({ OPENDASH_HOME: "./foo" })).toThrow(
      /OPENDASH_HOME must be an absolute path/,
    )
    expect(() => resolveMimocodeHome({ OPENDASH_HOME: "foo/bar" })).toThrow(
      /OPENDASH_HOME must be an absolute path/,
    )
  })

  test("tilde-prefixed OPENDASH_HOME throws (not treated as absolute)", () => {
    expect(() => resolveMimocodeHome({ OPENDASH_HOME: "~/profiles/a" })).toThrow(
      /OPENDASH_HOME must be an absolute path/,
    )
  })

  test("error message includes the offending value", () => {
    expect(() => resolveMimocodeHome({ OPENDASH_HOME: "./relative" })).toThrow(
      /\.\/relative/,
    )
  })
})
