import { defineConfig } from "tsup"
export default defineConfig({
  entry: { index: "action/src/index.ts" },
  outDir: "action/dist",
  format: ["esm"],
  platform: "node",
  target: "node20",
  clean: true,
  noExternal: [/.*/],
  outExtension: () => ({ js: ".mjs" }),
  banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
})
