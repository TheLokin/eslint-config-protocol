import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_ASTRO } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function astro(): Promise<TypedFlatConfigItem[]> {
  const [pluginAstro, parserAstro, parserTs] = await Promise.all([
    interopDefault(import("eslint-plugin-astro")),
    interopDefault(import("astro-eslint-parser")),
    interopDefault(import("@typescript-eslint/parser")),
  ])

  return [
    {
      name: "protocol/astro/setup",
      plugins: {
        astro: pluginAstro,
      },
    },
    {
      name: "protocol/astro/rules",
      files: [GLOB_ASTRO],
      languageOptions: {
        globals: pluginAstro.environments.astro.globals,
        parser: parserAstro,
        parserOptions: {
          extraFileExtensions: [".astro"],
          parser: parserTs,
        },
        sourceType: "module",
      },
      processor: "astro/client-side-ts",
      rules: {
        "astro/missing-client-only-directive-value": "error",
        "astro/no-conflict-set-directives": "error",
        "astro/no-deprecated-astro-canonicalurl": "error",
        "astro/no-deprecated-astro-fetchcontent": "error",
        "astro/no-deprecated-astro-resolve": "error",
        "astro/no-deprecated-getentrybyslug": "error",
        "astro/no-set-html-directive": "off",
        "astro/no-unused-define-vars-in-style": "error",
        "astro/semi": "off",
        "astro/valid-compile": "error",
      },
    },
  ]
}
