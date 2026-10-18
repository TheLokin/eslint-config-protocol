import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_SRC } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function nextjs(): Promise<TypedFlatConfigItem[]> {
  const pluginNextJS = await interopDefault(import("@next/eslint-plugin-next"))

  function getRules(name: keyof typeof pluginNextJS.configs): Record<string, any> {
    const rules = pluginNextJS.configs?.[name]?.rules
    if (!rules) {
      throw new Error(
        `[eslint-config-protocol] Failed to find config ${name} in @next/eslint-plugin-next`,
      )
    }

    return Object.fromEntries(
      Object.entries(rules).map(([key, value]) => [
        key,
        typeof value === "string" ? [value] : value,
      ]),
    )
  }

  return [
    {
      name: "protocol/nextjs/setup",
      plugins: {
        next: pluginNextJS,
      },
    },
    {
      name: "protocol/nextjs/rules",
      files: [GLOB_SRC],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: "module",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...getRules("recommended"),
        ...getRules("core-web-vitals"),
      },
    },
  ]
}
