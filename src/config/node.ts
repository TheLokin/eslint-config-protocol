import type { TypedFlatConfigItem } from "../types/config"
import pluginNode from "eslint-plugin-n"
import { GLOB_SRC } from "../lib/globs"

export async function node(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "protocol/node/setup",
      plugins: {
        node: pluginNode,
      },
    },
    {
      name: "protocol/node/rules",
      files: [GLOB_SRC],
      rules: {
        "node/handle-callback-err": ["error", "^(err|error)$"],
        "node/no-deprecated-api": "error",
        "node/no-exports-assign": "error",
        "node/no-new-require": "error",
        "node/no-path-concat": "error",
        "node/prefer-global/buffer": ["error", "never"],
        "node/prefer-global/process": ["error", "never"],
        "node/process-exit-as-throw": "error",
      },
    },
  ]
}
