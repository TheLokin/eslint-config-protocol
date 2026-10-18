import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_YAML } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function yaml(): Promise<TypedFlatConfigItem[]> {
  const [pluginYaml, parserYaml] = await Promise.all([
    interopDefault(import("eslint-plugin-yml")),
    interopDefault(import("yaml-eslint-parser")),
  ])

  return [
    {
      name: "protocol/yaml/setup",
      plugins: {
        yaml: pluginYaml,
      },
    },
    {
      name: "protocol/yaml/rules",
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserYaml,
      },
      rules: {
        "yaml/block-mapping": "error",
        "yaml/block-sequence": "error",
        "yaml/no-empty-key": "error",
        "yaml/no-empty-sequence-entry": "error",
        "yaml/no-irregular-whitespace": "error",
        "yaml/plain-scalar": "error",
        "yaml/vue-custom-block/no-parsing-error": "error",
      },
    },
  ]
}
