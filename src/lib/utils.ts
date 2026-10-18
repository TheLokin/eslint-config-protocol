import type { Awaitable } from "eslint-flat-config-utils"
import type { OptionsConfig } from "../types/options"
import process from "node:process"

export async function interopDefault<T>(
  module: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await module

  return (resolved as any).default || resolved
}

export function isEditorEnvironment(): boolean {
  if (process.env.CI) return false
  if (isGitHooksOrLintStaged()) return false

  return !!(
    process.env.VSCODE_PID ||
    process.env.VSCODE_CWD ||
    process.env.JETBRAINS_IDE ||
    process.env.VIM ||
    process.env.NVIM ||
    (process.env.ZED_ENVIRONMENT && !process.env.ZED_TERM)
  )
}

export function isGitHooksOrLintStaged(): boolean {
  return !!(
    process.env.GIT_PARAMS ||
    process.env.VSCODE_GIT_COMMAND ||
    process.env.npm_lifecycle_script?.startsWith("lint-staged")
  )
}

export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules).map(([key, value]) => {
      for (const [from, to] of Object.entries(map)) {
        if (key.startsWith(`${from}/`)) return [to + key.slice(from.length), value]
      }

      return [key, value]
    }),
  )
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K,
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === "boolean" ? ({} as any) : options[key] || ({} as any)
}
