import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_JSX, GLOB_TSX } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function solid(
  options: {
    ignoreTypeScript?: boolean
    tsconfigPath?: string[]
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { ignoreTypeScript: hasTypeScript = true, tsconfigPath } = options

  const isTypeAware = !!tsconfigPath

  const [pluginSolid, parserTs] = await Promise.all([
    interopDefault(import("eslint-plugin-solid")),
    interopDefault(import("@typescript-eslint/parser")),
  ])

  return [
    {
      name: "protocol/solid/setup",
      plugins: {
        solid: pluginSolid,
      },
    },
    {
      name: "protocol/solid/rules",
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ...(isTypeAware ? { project: tsconfigPath } : {}),
        },
        sourceType: "module",
      },
      rules: {
        "solid/components-return-once": "warn",
        "solid/event-handlers": ["error", { ignoreCase: false, warnOnSpread: false }],
        "solid/imports": "error",
        "solid/jsx-no-duplicate-props": "error",
        "solid/jsx-no-script-url": "error",
        "solid/jsx-no-undef": "error",
        "solid/jsx-uses-vars": "error",
        "solid/no-destructure": "error",
        "solid/no-innerhtml": ["error", { allowStatic: true }],
        "solid/no-react-deps": "error",
        "solid/no-react-specific-props": "error",
        "solid/no-unknown-namespaces": "error",
        "solid/prefer-for": "error",
        "solid/reactivity": "warn",
        "solid/self-closing-comp": "error",
        "solid/style-prop": ["error", { styleProps: ["style", "css"] }],
        ...(hasTypeScript
          ? {
              "solid/jsx-no-undef": ["error", { typescriptEnabled: true }],
              "solid/no-unknown-namespaces": "off",
            }
          : {}),
      },
    },
  ]
}
