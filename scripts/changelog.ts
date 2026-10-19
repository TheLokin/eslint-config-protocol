import { readFile, writeFile } from "node:fs/promises"
import process from "node:process"

const H1_PATTERN = /^#\s/

const version = process.argv[2]
if (!version) throw new Error("The version argument cannot be empty.")

const changelog = await readFile("CHANGELOG.md", "utf8")
const lines = changelog.split(/\r?\n/)

const headingIndex = lines.findIndex((line) => H1_PATTERN.test(line) && line.includes(version))
if (headingIndex === -1) throw new Error(`Version "${version}" was not found.`)

const nextHeadingIndex = lines.findIndex(
  (line, index) => index > headingIndex && H1_PATTERN.test(line),
)

const content = lines
  .slice(headingIndex + 1, nextHeadingIndex === -1 ? undefined : nextHeadingIndex)
  .join("\n")
  .trim()

if (!content) throw new Error(`The changelog section for version "${version}" is empty.`)

await writeFile("release.md", content, "utf8")

console.log(`Extracted changelog for ${version}.`)
