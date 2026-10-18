import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from "../lib/globs"

export async function ignores(
  options: {
    userIgnores?: string[]
    ignoreTypeScript?: boolean
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { userIgnores = [], ignoreTypeScript = false } = options

  const ignores = [...GLOB_EXCLUDE, ...userIgnores]
  if (ignoreTypeScript) ignores.push(GLOB_TS, GLOB_TSX)

  return [
    {
      name: "protocol/ignores",
      ignores,
    },
  ]
}
