import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_SVELTE } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function svelte(
  options: {
    ignoreTypeScript?: boolean
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { ignoreTypeScript: hasTypeScript = false } = options

  const [pluginSvelte, parserSvelte] = await Promise.all([
    interopDefault(import("eslint-plugin-svelte")),
    interopDefault(import("svelte-eslint-parser")),
  ])

  return [
    {
      name: "protocol/svelte/setup",
      plugins: {
        svelte: pluginSvelte,
      },
    },
    {
      name: "protocol/svelte/rules",
      files: [GLOB_SVELTE],
      languageOptions: {
        parser: parserSvelte,
        parserOptions: {
          extraFileExtensions: [".svelte"],
          parser: hasTypeScript ? await interopDefault(import("@typescript-eslint/parser")) : null,
        },
      },
      processor: pluginSvelte.processors[".svelte"],
      rules: {
        "no-undef": "off",
        "no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all",
            varsIgnorePattern: "^(\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)",
          },
        ],
        ...pluginSvelte.configs.recommended
          .map((config) => config.rules)
          .reduce((acc, rules) => ({ ...acc, ...rules }), {}),
        "unused-imports/no-unused-vars": [
          "error",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            vars: "all",
            varsIgnorePattern: "^(_|\\$\\$Props$|\\$\\$Events$|\\$\\$Slots$)",
          },
        ],
      },
    },
  ]
}
