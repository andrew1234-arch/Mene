import { defineConfig } from "tsup"

export default defineConfig({
  // index: the `mene` binary; lib: check/config logic shared with the GitHub Action.
  entry: ["src/index.ts", "src/lib.ts"],
  format: ["esm"],
  clean: true,
  noExternal: ["@mene/sdk"],
})
