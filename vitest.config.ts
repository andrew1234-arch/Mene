import { defineConfig } from "vitest/config"
export default defineConfig({
  test: { include: ["packages/*/test/**/*.test.ts"] },
  resolve: { alias: { "@mene/sdk": new URL("./packages/sdk/src/index.ts", import.meta.url).pathname } },
})
