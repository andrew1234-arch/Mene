// Turns the preview build (dist-preview, built with base "/" and build.format "file") into a
// bundle of relative files that works from any URL prefix, e.g. a claude.ai artifact.
import { readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join, posix, relative } from "node:path"

const root = new URL("../dist-preview/", import.meta.url).pathname
const walk = (d) =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))

// Pagefind search can't work from relative files; drop it.
rmSync(join(root, "pagefind"), { recursive: true, force: true })
// "/" → home.html, so the artifact's own entry page can be a small launcher.
renameSync(join(root, "index.html"), join(root, "home.html"))

const ASSET = /^\/(assets|favicon|sitemap)/
/** Map a site path ("/wall", "/docs/cli/", "/") to its file ("wall.html", "docs/cli.html", "home.html"). */
function toFile(p) {
  if (ASSET.test(p) || /\.[a-z0-9]+$/i.test(p)) return p.slice(1)
  const clean = p.replace(/^\/|\/$/g, "")
  return `${clean || "home"}.html`
}

for (const file of walk(root).filter((f) => f.endsWith(".html"))) {
  const rel = relative(root, file) // e.g. "docs/cli.html"
  const pageDir = posix.dirname(rel) === "." ? "" : posix.dirname(rel)
  // URL the page had on the live site, in directory form, for resolving relative links.
  const liveUrl = new URL(`https://x/${rel.replace(/(^|\/)home\.html$/, "").replace(/\.html$/, "/")}`)
  let html = readFileSync(file, "utf8")
  html = html.replace(/(href|src)="([^"]*)"/g, (m, attr, val) => {
    if (!val || /^(https?:|mailto:|data:|#|javascript:)/i.test(val)) return m
    const u = new URL(val, liveUrl)
    const target = toFile(u.pathname)
    const out = posix.relative(pageDir || ".", target) || target
    return `${attr}="${out}${u.search}${u.hash}"`
  })
  // Any remaining absolute asset references (inline module imports, preloads).
  const up = pageDir ? "../".repeat(pageDir.split("/").length) : "./"
  html = html.replace(/(["'(])\/assets\//g, `$1${up}assets/`)
  writeFileSync(file, html)
}
for (const file of walk(join(root, "assets")).filter((f) => /\.(css)$/.test(f))) {
  writeFileSync(file, readFileSync(file, "utf8").replace(/url\(\/assets\//g, "url(./"))
}
console.log("relativized", root)
