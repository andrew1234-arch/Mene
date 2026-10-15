/**
 * Keeps line-anchored code links in the docs honest. A link of the form
 *   [text](https://github.com/andrew1234-arch/Mene/blob/main/<path>#L<n> "<needle>")
 * must land on a line containing <needle> (the link title). Judges follow these links, and a
 * reformat shifts line numbers, so CI runs this check.
 *
 *   npm run docs:links          # check (exit 1 on a stale link)
 *   npm run docs:links -- --fix # rewrite each #L<n> to the line where <needle> now is
 */
import { readFileSync, writeFileSync } from "node:fs"

const DOCS = ["README.md", "docs/SUBMISSION.md", "arkiv/schema.md", "arkiv/friction.md"]
const LINK = /\((https:\/\/github\.com\/andrew1234-arch\/Mene\/blob\/main\/([^)#\s]+)#L(\d+)) "([^"]+)"\)/g
const fix = process.argv.includes("--fix")
let bad = 0

for (const doc of DOCS) {
  const text = readFileSync(doc, "utf8")
  const out = text.replace(LINK, (whole, _url: string, path: string, line: string, needle: string) => {
    const lines = readFileSync(path, "utf8").split("\n")
    const at = Number(line)
    if (lines[at - 1]?.includes(needle)) return whole
    const found = lines.findIndex((l) => l.includes(needle)) + 1
    if (!found) {
      console.error(`${doc}: ${path} has no line containing "${needle}"`)
      bad++
      return whole
    }
    if (!fix) {
      console.error(`${doc}: ${path}#L${at} should be #L${found} ("${needle}")`)
      bad++
      return whole
    }
    console.log(`${doc}: ${path}#L${at} → #L${found} ("${needle}")`)
    return whole.replace(`#L${at} "`, `#L${found} "`)
  })
  if (fix && out !== text) writeFileSync(doc, out)
}
if (bad) process.exit(1)
console.log("doc code links: ok")
