import type { TypedFlatConfigItem } from "../types/config"
import { mergeProcessors, processorPassThrough } from "eslint-merge-processors"
import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE, GLOB_MARKDOWN_IN_MARKDOWN } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function markdown(
  options: {
    componentExts?: string[]
  } = {},
): Promise<TypedFlatConfigItem[]> {
  const { componentExts = [] } = options

  const markdown = await interopDefault(import("@eslint/markdown"))

  return [
    {
      name: "protocol/markdown/setup",
      plugins: {
        markdown,
      },
    },
    {
      name: "protocol/markdown/processor",
      files: [GLOB_MARKDOWN],
      ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
      processor: mergeProcessors([markdown.processors.markdown, processorPassThrough]),
    },
    {
      name: "protocol/markdown/parser",
      files: [GLOB_MARKDOWN],
      language: "markdown/gfm",
    },
    {
      name: "protocol/markdown/rules",
      files: [GLOB_MARKDOWN],
      rules: {
        ...markdown.configs.recommended.at(0)?.rules,
        "markdown/fenced-code-language": "off",
        "markdown/no-missing-label-refs": "off",
      },
    },
    {
      name: "protocol/markdown/disables/code",
      files: [GLOB_MARKDOWN_CODE, ...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`)],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            impliedStrict: true,
          },
        },
      },
      rules: {
        "e18e/prefer-static-regex": "off",
        "no-alert": "off",
        "no-console": "off",
        "no-labels": "off",
        "no-lone-blocks": "off",
        "no-restricted-syntax": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-labels": "off",
        "no-unused-vars": "off",
        "node/prefer-global/process": "off",
        "ts/consistent-type-imports": "off",
        "ts/explicit-function-return-type": "off",
        "ts/no-namespace": "off",
        "ts/no-redeclare": "off",
        "ts/no-require-imports": "off",
        "ts/no-unused-expressions": "off",
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": "off",
        "unicode-bom": "off",
        "unused-imports/no-unused-imports": "off",
        "unused-imports/no-unused-vars": "off",
      },
    },
  ]
}
