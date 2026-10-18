import type { TypedFlatConfigItem } from "../types/config"
import pluginUnicorn from "eslint-plugin-unicorn"
import { GLOB_SRC } from "../lib/globs"

export async function unicorn(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "protocol/unicorn/setup",
      plugins: {
        unicorn: pluginUnicorn,
      },
    },
    {
      name: "protocol/unicorn/rules",
      files: [GLOB_SRC],
      rules: {
        "unicorn/consistent-empty-array-spread": "error",
        "unicorn/error-message": "error",
        "unicorn/escape-case": "error",
        "unicorn/new-for-builtins": "error",
        "unicorn/no-instanceof-builtins": "error",
        "unicorn/no-new-array": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/prefer-dom-node-text-content": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-node-protocol": "error",
        "unicorn/prefer-number-properties": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/throw-new-error": "error",
      },
    },
  ]
}
