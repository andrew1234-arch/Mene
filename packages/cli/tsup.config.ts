import { defineConfig } from "tsup"

export default defineConfig({
  // index: the `mene` binary; lib: check/config logic shared with the GitHub Action.
  entry: ["src/index.ts", "src/lib.ts"],
  format: ["esm"],
  // Types for the library entry only; the binary has no importable API.
  dts: { entry: { lib: "src/lib.ts" } },
  clean: true,
  noExternal: ["@mene/sdk"],
})
