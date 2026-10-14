import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"

// GitHub Pages: https://<owner>.github.io/<repo>/
const site = process.env.SITE_URL ?? "https://andrew1234-arch.github.io"
const base = process.env.SITE_BASE ?? "/Mene"

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  integrations: [
    starlight({
      title: "Mene docs",
      description: "Quorum-witnessed npm compromise advisories on Arkiv.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/andrew1234-arch/Mene" }],
      customCss: ["./src/styles/starlight.css"],
      head: [
        { tag: "link", attrs: { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;600&family=JetBrains+Mono&display=swap" } },
      ],
      sidebar: [
        { label: "← Mene home", link: `${base}/` },
        { label: "Start", items: ["docs/quickstart", "docs/cli", "docs/action"] },
        { label: "How it works", items: ["docs/trust-model", "docs/data-contract", "docs/witness", "docs/keepalive"] },
        { label: "More", items: ["docs/faq"] },
      ],
    }),
  ],
  vite: {
    resolve: { alias: { "@mene/sdk": new URL("../packages/sdk/src/index.ts", import.meta.url).pathname } },
    optimizeDeps: { exclude: ["brotli-wasm"] },
  },
})
