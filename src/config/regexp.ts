import { interopDefault } from "../lib/utils"
import type { TypedFlatConfigItem } from "../types/config"

export async function regexp(): Promise<TypedFlatConfigItem[]> {
  const pluginRegex = await interopDefault(import("eslint-plugin-regexp"))

  return [
    {
      ...pluginRegex.configs.recommended,
      name: "protocol/regexp/rules",
    },
  ]
}
