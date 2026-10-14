import { defineConfig } from "astro/config"

// GitHub Pages: https://<owner>.github.io/<repo>/
const PREVIEW = process.env.PUBLIC_MENE_PREVIEW === "1"
const site = process.env.SITE_URL ?? "https://andrew1234-arch.github.io"
// Preview builds are a bundle of relative files (see tools/relativize-preview.mjs).
const base = PREVIEW ? "/" : (process.env.SITE_BASE ?? "/Mene")

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  outDir: PREVIEW ? "dist-preview" : "dist",
  build: PREVIEW ? { format: "file", assets: "assets" } : {},
  vite: {
    resolve: {
      alias: {
        "@mene/sdk": new URL("../packages/sdk/src/index.ts", import.meta.url).pathname,
        "mene:preview": new URL(PREVIEW ? "./src/preview/sample.ts" : "./src/preview/empty.ts", import.meta.url)
          .pathname,
      },
    },
    optimizeDeps: { exclude: ["brotli-wasm"] },
  },
})
