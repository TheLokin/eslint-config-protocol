import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_SRC } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function jsdoc(): Promise<TypedFlatConfigItem[]> {
  const pluginJsdoc = await interopDefault(import("eslint-plugin-jsdoc"))

  return [
    {
      name: "protocol/jsdoc/setup",
      plugins: {
        jsdoc: pluginJsdoc,
      },
    },
    {
      name: "protocol/jsdoc/rules",
      files: [GLOB_SRC],
      rules: {
        "jsdoc/check-access": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-property-names": "warn",
        "jsdoc/check-types": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/require-property": "warn",
        "jsdoc/require-property-description": "warn",
        "jsdoc/require-property-name": "warn",
        "jsdoc/require-returns-check": "warn",
        "jsdoc/require-returns-description": "warn",
        "jsdoc/require-yields-check": "warn",
      },
    },
  ]
}
