// Public entry point for code that embeds `mene check` (the GitHub Action).
export { type CheckResult, loadStatuses, matchTable, runCheck } from "./check"
export { cachePath, loadConfig, loadState, type MeneConfig, saveState } from "./config"
