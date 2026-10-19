import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_JSX, GLOB_TSX } from "../lib/globs"

export async function jsx(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "protocol/jsx/setup",
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ]
}
