#!/usr/bin/env bun
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@opendash-ai/script"
import { fileURLToPath } from "url"
import fs from "fs"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

async function published(name: string, version: string) {
  return (await $`npm view ${name}@${version} version`.nothrow()).exitCode === 0
}

async function publish(dir: string, name: string, version: string) {
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(dir)
  if (await published(name, version)) {
    console.log(`already published ${name}@${version}`)
    return
  }
  await $`rm -f *.tgz`.cwd(dir).nothrow()
  await $`npm pack`.cwd(dir)
  const tgz = fs.readdirSync(dir).find(f => f.endsWith(".tgz"))
  if (!tgz) throw new Error("No .tgz file found after pack")
  await $`npm publish ${tgz} --access public --tag ${Script.channel}`.cwd(dir)
}

function copyDirSync(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = `${src}/${entry.name}`
    const destPath = `${dest}/${entry.name}`
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

const binaries: { dir: string; name: string; version: string }[] = []
for (const filepath of new Bun.Glob("*/package.json").scanSync({ cwd: "./dist" })) {
  const p = await Bun.file(`./dist/${filepath}`).json()
  binaries.push({ dir: `./dist/${filepath.replace("/package.json", "")}`, name: p.name, version: p.version })
}
console.log("binaries", Object.fromEntries(binaries.map((b) => [b.name, b.version])))
const version = binaries[0].version

const wrapperDir = `./dist/${pkg.name}`
fs.rmSync(wrapperDir, { recursive: true, force: true })
fs.mkdirSync(wrapperDir, { recursive: true })
copyDirSync("./bin", `${wrapperDir}/bin`)
fs.copyFileSync("./script/postinstall.mjs", `${wrapperDir}/postinstall.mjs`)
fs.writeFileSync(`${wrapperDir}/LICENSE`, await Bun.file("../../LICENSE").text())
fs.writeFileSync(`${wrapperDir}/README.md`, await Bun.file("../../README_npm.md").text())

await Bun.file(`${wrapperDir}/package.json`).write(
  JSON.stringify(
    {
      name: pkg.name,
      version: version,
      description: "The open-source AI workspace for analysts.",
      license: "MIT",
      author: "Jagbir Yadav",
      homepage: "https://opendash-ai.vercel.app",
      repository: {
        type: "git",
        url: "git+https://github.com/jagbiryadav/opendash.git",
      },
      bugs: {
        url: "https://github.com/jagbiryadav/opendash/issues",
      },
      keywords: ["ai", "cli", "analytics", "data-analysis", "sql", "reporting", "automation", "dashboard", "terminal", "opendash"],
      bin: {
        opendash: "./bin/opendash",
      },
      scripts: {
        postinstall: "node ./postinstall.mjs",
      },
      optionalDependencies: Object.fromEntries(binaries.map((b) => [b.name, b.version])),
    },
    null,
    2,
  ),
)

const tasks = binaries.map(async (b) => {
  await publish(b.dir, b.name, b.version)
})
await Promise.all(tasks)
await publish(wrapperDir, pkg.name, version)
