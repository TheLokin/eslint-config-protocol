import type { Linter } from "eslint"
import type { TypedFlatConfigItem } from "../types/config"
import type { OptionsConfig } from "../types/options"
import pluginE18e from "@e18e/eslint-plugin"

export async function e18e(
  options: {
    type?: OptionsConfig["type"]
    isInEditor?: boolean
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { type = "app", isInEditor = false } = options

  const moduleReplacements = type === "lib" && isInEditor
  const configs = pluginE18e.configs as Record<string, Linter.Config>

  return [
    {
      name: "protocol/e18e/rules",
      plugins: {
        e18e: pluginE18e,
      },
      rules: {
        ...configs.modernization!.rules,
        ...(moduleReplacements ? { ...configs.moduleReplacements!.rules } : {}),
        ...configs.performanceImprovements!.rules,
        ...(type === "lib" ? {} : { "e18e/prefer-static-regex": "off" }),
        "e18e/prefer-array-at": "off",
        "e18e/prefer-array-from-map": "off",
        "e18e/prefer-array-to-reversed": "off",
        "e18e/prefer-array-to-sorted": "off",
        "e18e/prefer-array-to-spliced": "off",
        "e18e/prefer-spread-syntax": "off",
      },
    },
  ]
}
