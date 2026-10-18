import type { TypedFlatConfigItem } from "../types/config"
import type { OptionsJSX } from "../types/options"
import { GLOB_JSX, GLOB_TSX } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function jsx(options: OptionsJSX = {}): Promise<TypedFlatConfigItem[]> {
  const { a11y } = options

  const baseConfig: TypedFlatConfigItem = {
    name: "protocol/jsx/setup",
    files: [GLOB_JSX, GLOB_TSX],
    plugins: {},
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {},
  }

  if (!a11y) return [baseConfig]

  const jsxA11yPlugin = await interopDefault(import("eslint-plugin-jsx-a11y"))

  return [
    {
      ...baseConfig,
      ...jsxA11yPlugin.flatConfigs.recommended,
      name: baseConfig.name,
      files: baseConfig.files,
      plugins: {
        ...baseConfig.plugins,
        "jsx-a11y": jsxA11yPlugin,
      },
      languageOptions: {
        ...baseConfig.languageOptions,
        ...jsxA11yPlugin.flatConfigs.recommended.languageOptions,
      },
      rules: {
        ...baseConfig.rules,
        ...(jsxA11yPlugin.flatConfigs.recommended.rules || {}),
      },
    },
  ]
}
