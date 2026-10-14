import { defineConfig } from "tsup"

// The Action runs from the committed dist/ with nothing installed, so everything is bundled.
export default defineConfig({
  entry: { index: "src/index.ts" },
  outDir: "dist",
  format: ["esm"],
  platform: "node",
  target: "node20",
  clean: true,
  noExternal: [/.*/],
  outExtension: () => ({ js: ".mjs" }),
  banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
})
