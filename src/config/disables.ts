import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_SRC, GLOB_SRC_EXT } from "../lib/globs"

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "protocol/disables/scripts",
      files: [`**/scripts/${GLOB_SRC}`],
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
    {
      name: "protocol/disables/cli",
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      rules: {
        "no-console": "off",
      },
    },
    {
      name: "protocol/disables/dts",
      files: ["**/*.d.?([cm])ts"],
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
    {
      name: "protocol/disables/cjs",
      files: ["**/*.js", "**/*.cjs"],
      rules: {
        "ts/no-require-imports": "off",
      },
    },
    {
      name: "protocol/disables/config-files",
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
  ]
}
