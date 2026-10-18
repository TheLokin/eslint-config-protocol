import type { TypedFlatConfigItem } from "../types/config"
import { configs } from "eslint-plugin-regexp"

export async function regexp(): Promise<TypedFlatConfigItem[]> {
  const config = configs["flat/recommended"] as TypedFlatConfigItem

  return [
    {
      ...config,
      name: "protocol/regexp/rules",
    },
  ]
}
