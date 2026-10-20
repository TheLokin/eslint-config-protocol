import type { TypedFlatConfigItem } from "../types/config"
import { interopDefault } from "../lib/utils"

export async function regexp(): Promise<TypedFlatConfigItem[]> {
  const pluginRegex = await interopDefault(import("eslint-plugin-regexp"))

  return [
    {
      ...pluginRegex.configs.recommended,
      name: "protocol/regexp/rules",
    },
  ]
}
