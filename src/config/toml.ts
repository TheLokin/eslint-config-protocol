import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_TOML } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function toml(): Promise<TypedFlatConfigItem[]> {
  const [pluginToml, parserToml] = await Promise.all([
    interopDefault(import("eslint-plugin-toml")),
    interopDefault(import("toml-eslint-parser")),
  ])

  return [
    {
      name: "protocol/toml/setup",
      plugins: {
        toml: pluginToml,
      },
    },
    {
      name: "protocol/toml/rules",
      files: [GLOB_TOML],
      languageOptions: {
        parser: parserToml,
      },
      rules: {
        "toml/comma-style": "error",
        "toml/keys-order": "error",
        "toml/no-space-dots": "error",
        "toml/no-unreadable-number-separator": "error",
        "toml/precision-of-fractional-seconds": "error",
        "toml/precision-of-integer": "error",
        "toml/tables-order": "error",
        "toml/vue-custom-block/no-parsing-error": "error",
      },
    },
  ]
}
