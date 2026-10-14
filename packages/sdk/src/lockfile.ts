/** One installed package from a lockfile. `path` is the node_modules path it was found at. */
export interface InstalledPackage {
  name: string
  version: string
  path: string
}

export class LockfileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LockfileError"
  }
}

/**
 * Parses an npm `package-lock.json` (lockfileVersion 2 or 3, via the `packages` map; version 1 via
 * the nested `dependencies` tree). Pure — works in Node and in the browser.
 */
export function parseLockfile(text: string): InstalledPackage[] {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new LockfileError("lockfile is not valid JSON")
  }
  if (!json || typeof json !== "object") throw new LockfileError("lockfile must be a JSON object")
  const lock = json as {
    lockfileVersion?: number
    packages?: Record<string, { version?: string; name?: string; link?: boolean }>
    dependencies?: Record<string, V1Dep>
  }

  if (lock.packages && typeof lock.packages === "object") {
    const out: InstalledPackage[] = []
    for (const [path, meta] of Object.entries(lock.packages)) {
      if (!path || !meta || meta.link || typeof meta.version !== "string") continue
      const name = meta.name ?? nameFromPath(path)
      if (!name) continue
      out.push({ name, version: meta.version, path })
    }
    return out
  }
  if (lock.dependencies && typeof lock.dependencies === "object") {
    const out: InstalledPackage[] = []
    walkV1(lock.dependencies, "", out)
    return out
  }
  throw new LockfileError("unsupported lockfile: no `packages` or `dependencies` map")
}

interface V1Dep {
  version?: string
  dependencies?: Record<string, V1Dep>
}

function walkV1(deps: Record<string, V1Dep>, prefix: string, out: InstalledPackage[]) {
  for (const [name, dep] of Object.entries(deps)) {
    const path = `${prefix}node_modules/${name}`
    if (typeof dep.version === "string") {
      const alias = dep.version.match(/^npm:((?:@[^/]+\/)?[^@]+)@(.+)$/)
      if (alias) out.push({ name: alias[1]!, version: alias[2]!, path })
      else if (!dep.version.includes(":")) out.push({ name, version: dep.version, path })
    }
    if (dep.dependencies) walkV1(dep.dependencies, `${path}/`, out)
  }
}

/** `node_modules/a/node_modules/@scope/b` → `@scope/b`. Workspace paths without node_modules → null. */
export function nameFromPath(path: string): string | null {
  const idx = path.lastIndexOf("node_modules/")
  if (idx === -1) return null
  const rest = path.slice(idx + "node_modules/".length)
  const parts = rest.split("/")
  if (parts[0]?.startsWith("@")) return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null
  return parts[0] || null
}

/**
 * Names the root project depends on directly (dependencies, dev, optional, peer). `null` when the
 * lockfile does not record it (v1), in which case top-level installs are treated as direct.
 */
export function directDependencies(text: string): Set<string> | null {
  try {
    const lock = JSON.parse(text) as { packages?: Record<string, Record<string, Record<string, string> | undefined>> }
    const root = lock.packages?.[""]
    if (!root) return null
    const names = new Set<string>()
    for (const f of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
      for (const n of Object.keys(root[f] ?? {})) names.add(n)
    }
    return names
  } catch {
    return null
  }
}
