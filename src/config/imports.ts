import type { TypedFlatConfigItem } from "../types/config"
import pluginImportLite from "eslint-plugin-import-lite"

export async function imports(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "protocol/imports/rules",
      plugins: {
        import: pluginImportLite,
      },
      rules: {
        "import/consistent-type-specifier-style": ["error", "top-level"],
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
      },
    },
  ]
}
