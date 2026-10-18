import type { Linter } from "eslint"
import type { TypedFlatConfigItem } from "../types/config"
import type { OptionsConfig, OptionsTypescript } from "../types/options"
import process from "node:process"
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../lib/globs"
import { interopDefault, renameRules } from "../lib/utils"

export async function typescript(
  options: {
    type?: OptionsConfig["type"]
    componentExts?: string[]
  } & OptionsTypescript = {},
): Promise<TypedFlatConfigItem[]> {
  const { type = "app", componentExts = [], tsconfigPath, erasableOnly = false } = options

  const files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)]
  const filesTypeAware = [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS]
  const isTypeAware = !!tsconfigPath

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")),
    interopDefault(import("@typescript-eslint/parser")),
  ])

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[],
  ): TypedFlatConfigItem {
    return {
      name: `protocol/typescript/${typeAware ? "type-aware-parser" : "parser"}`,
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map((ext) => `.${ext}`),
          sourceType: "module",
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ["./*.js"],
                  defaultProject: tsconfigPath,
                },
                tsconfigRootDir: process.cwd(),
              }
            : {}),
        },
      },
    }
  }

  return [
    {
      name: "protocol/typescript/setup",
      plugins: {
        ts: pluginTs,
      },
    },
    ...(isTypeAware
      ? [makeParser(false, files), makeParser(true, filesTypeAware, ignoresTypeAware)]
      : [makeParser(false, files)]),
    {
      name: "protocol/typescript/rules",
      files,
      rules: {
        ...renameRules(pluginTs.configs["eslint-recommended"]!.overrides![0]!.rules!, {
          "@typescript-eslint": "ts",
        }),
        ...renameRules(pluginTs.configs.strict!.rules!, { "@typescript-eslint": "ts" }),
        "no-dupe-class-members": "off",
        "no-redeclare": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "ts/ban-ts-comment": ["error", { "ts-expect-error": "allow-with-description" }],
        "ts/consistent-type-definitions": ["error", "interface"],
        "ts/consistent-type-imports": [
          "error",
          {
            disallowTypeAnnotations: false,
            fixStyle: "separate-type-imports",
            prefer: "type-imports",
          },
        ],
        "ts/method-signature-style": ["error", "property"],
        "ts/no-dupe-class-members": "error",
        "ts/no-dynamic-delete": "off",
        "ts/no-empty-object-type": ["error", { allowInterfaces: "always" }],
        "ts/no-explicit-any": "off",
        "ts/no-extraneous-class": "off",
        "ts/no-import-type-side-effects": "error",
        "ts/no-invalid-void-type": "off",
        "ts/no-non-null-assertion": "off",
        "ts/no-redeclare": ["error", { builtinGlobals: false }],
        "ts/no-require-imports": "error",
        "ts/no-unused-expressions": [
          "error",
          { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true },
        ],
        "ts/no-unused-vars": "off",
        "ts/no-use-before-define": ["error", { classes: false, functions: false, variables: true }],
        "ts/no-useless-constructor": "off",
        "ts/no-wrapper-object-types": "error",
        "ts/triple-slash-reference": "off",
        "ts/unified-signatures": "off",
        ...(type === "lib"
          ? {
              "ts/explicit-function-return-type": [
                "error",
                { allowExpressions: true, allowHigherOrderFunctions: true, allowIIFEs: true },
              ],
            }
          : {}),
      },
    },
    ...(isTypeAware
      ? [
          {
            name: "protocol/typescript/rules-type-aware",
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            rules: {
              "dot-notation": "off",
              "no-implied-eval": "off",
              "ts/await-thenable": "error",
              "ts/dot-notation": ["error", { allowKeywords: true }],
              "ts/no-floating-promises": "error",
              "ts/no-for-in-array": "error",
              "ts/no-implied-eval": "error",
              "ts/no-misused-promises": "error",
              "ts/no-unnecessary-type-assertion": "error",
              "ts/no-unsafe-argument": "error",
              "ts/no-unsafe-assignment": "error",
              "ts/no-unsafe-call": "error",
              "ts/no-unsafe-member-access": "error",
              "ts/no-unsafe-return": "error",
              "ts/promise-function-async": "error",
              "ts/restrict-plus-operands": "error",
              "ts/restrict-template-expressions": "error",
              "ts/return-await": ["error", "in-try-catch"],
              "ts/strict-boolean-expressions": [
                "error",
                { allowNullableBoolean: true, allowNullableObject: true },
              ],
              "ts/switch-exhaustiveness-check": "error",
              "ts/unbound-method": "error",
            } as Record<string, Linter.RuleEntry>,
          },
        ]
      : []),
    ...(erasableOnly
      ? [
          {
            name: "protocol/typescript/erasable-syntax-only",
            plugins: {
              "erasable-syntax-only": await interopDefault(
                import("eslint-plugin-erasable-syntax-only"),
              ),
            },
            rules: {
              "erasable-syntax-only/enums": "error",
              "erasable-syntax-only/export-aliases": "error",
              "erasable-syntax-only/import-aliases": "error",
              "erasable-syntax-only/namespaces": "error",
              "erasable-syntax-only/parameter-properties": "error",
            } as Record<string, Linter.RuleEntry>,
          },
        ]
      : []),
  ]
}
