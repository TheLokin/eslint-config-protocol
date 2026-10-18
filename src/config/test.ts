import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_TESTS } from "../lib/globs"
import { interopDefault } from "../lib/utils"

// Cached across calls so the merged plugin is only built once
let pluginTest: unknown

export async function test(
  options: {
    isInEditor?: boolean
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { isInEditor = false } = options

  const [pluginVitest, pluginNoOnlyTests] = await Promise.all([
    interopDefault(import("@vitest/eslint-plugin")),
    // @ts-expect-error missing types
    interopDefault(import("eslint-plugin-no-only-tests")),
  ])

  pluginTest = pluginTest || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      ...pluginNoOnlyTests.rules,
    },
  }

  return [
    {
      name: "protocol/test/setup",
      plugins: {
        test: pluginTest,
      },
    },
    {
      name: "protocol/test/rules",
      files: [GLOB_TESTS],
      rules: {
        "test/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-only-tests": isInEditor ? "warn" : "error",
        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",
        "e18e/prefer-static-regex": "off",
        "no-unused-expressions": "off",
        "node/prefer-global/process": "off",
        "ts/explicit-function-return-type": "off",
      },
    },
  ]
}
