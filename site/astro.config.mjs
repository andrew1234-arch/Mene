import { defineConfig } from "astro/config"

// Hosted on Vercel at the domain root. Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time;
// SITE_URL overrides it (e.g. a custom domain). SITE_BASE serves the site from a sub-path instead.
const PREVIEW = process.env.PUBLIC_MENE_PREVIEW === "1"
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:4321")
// Preview builds are a bundle of relative files (see tools/relativize-preview.mjs).
const base = PREVIEW ? "/" : (process.env.SITE_BASE ?? "/")

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
