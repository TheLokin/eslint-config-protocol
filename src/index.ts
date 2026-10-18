import type { Linter } from "eslint"
import type { Awaitable } from "eslint-flat-config-utils"
import type { TypedFlatConfigItem } from "./types/config"
import type { OptionsConfig } from "./types/options"
import type { ConfigNames } from "./types/rules"
import { FlatConfigComposer } from "eslint-flat-config-utils"
import { isPackageExists } from "local-pkg"
import { angular } from "./config/angular"
import { astro } from "./config/astro"
import { comments } from "./config/comments"
import { disables } from "./config/disables"
import { e18e } from "./config/e18e"
import { ignores } from "./config/ignores"
import { imports } from "./config/imports"
import { javascript } from "./config/javascript"
import { jsdoc } from "./config/jsdoc"
import { jsonc } from "./config/jsonc"
import { jsx } from "./config/jsx"
import { markdown } from "./config/markdown"
import { nextjs } from "./config/nextjs"
import { node } from "./config/node"
import { perfectionist } from "./config/perfectionist"
import { react } from "./config/react"
import { regexp } from "./config/regexp"
import { solid } from "./config/solid"
import { sortPackageJson, sortTsConfig } from "./config/sort"
import { svelte } from "./config/svelte"
import { test } from "./config/test"
import { toml } from "./config/toml"
import { typescript } from "./config/typescript"
import { unicorn } from "./config/unicorn"
import { vue } from "./config/vue"
import { yaml } from "./config/yaml"
import { GLOB_MARKDOWN } from "./lib/globs"
import { interopDefault, isEditorEnvironment, resolveSubOptions } from "./lib/utils"

const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies (keyof TypedFlatConfigItem)[]

const defaultPluginRenaming = {
  "@typescript-eslint": "ts",
  "@eslint-react": "react",
  "@next/next": "next",
  "n": "node",
  "import-lite": "import",
  "vitest": "test",
  "yml": "yaml",
}

/**
 * Build the ESLint flat config.
 *
 * @param {OptionsConfig & Omit<TypedFlatConfigItem, "files" | "ignores">} options
 *   Options to generate the configuration, plus any flat config property to
 *   forward as-is (`rules`, `settings`, `linterOptions`, ...).
 * @param {Awaitable<
 *   | TypedFlatConfigItem
 *   | TypedFlatConfigItem[]
 *   | FlatConfigComposer<any, any>
 *   | Linter.Config[]
 * >} userConfigs
 *   Flat config items to merge after the generated ones.
 * @returns {FlatConfigComposer<TypedFlatConfigItem, ConfigNames>} The merged
 *   configuration.
 */
export default function protocol(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files" | "ignores"> = {},
  ...userConfigs: Awaitable<
    TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]
  >[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    type: appType = "app",
    ignores: userIgnores = [],
    gitignore: enableGitignore = true,
    typescript: enableTypeScript = isPackageExists("typescript") ||
      isPackageExists("@typescript/native-preview"),
    jsx: enableJsx = true,
    react: enableReact = false,
    nextjs: enableNextJS = false,
    vue: enableVue = false,
    svelte: enableSvelte = false,
    solid: enableSolid = false,
    angular: enableAngular = false,
    astro: enableAstro = false,
    node: enableNode = true,
    imports: enableImports = true,
    regexp: enableRegexp = true,
    jsdoc: enableJsdoc = true,
    test: enableTest = true,
    jsonc: enableJsonc = true,
    yaml: enableYaml = true,
    toml: enableToml = true,
    markdown: enableMarkdown = true,
  } = options

  const isInEditor = isEditorEnvironment()
  if (isInEditor) {
    // eslint-disable-next-line no-console
    console.log("[eslint-config-protocol] Detected running in editor, some rules are disabled.")
  }

  const componentExts = enableVue ? ["vue"] : []
  const typescriptOptions = resolveSubOptions(options, "typescript")

  const configs: Awaitable<TypedFlatConfigItem[]>[] = [
    ignores({ userIgnores, ignoreTypeScript: !enableTypeScript }),
  ]

  if (enableGitignore) {
    configs.push(
      interopDefault(import("eslint-config-flat-gitignore")).then((config) => [
        config({ name: "protocol/gitignore", strict: false }),
      ]),
    )
  }

  configs.push(
    javascript({ isInEditor }),
    comments(),
    unicorn(),
    perfectionist(),
    e18e({ type: appType, isInEditor }),
  )

  if (enableImports) configs.push(imports())

  if (enableTypeScript) {
    configs.push(typescript({ type: appType, componentExts, ...typescriptOptions }))
  }

  if (enableJsx) configs.push(jsx(resolveSubOptions(options, "jsx")))
  if (enableReact) configs.push(react(typescriptOptions))
  if (enableNextJS) configs.push(nextjs())

  if (enableVue) {
    configs.push(
      vue({ ignoreTypeScript: !!enableTypeScript, ...resolveSubOptions(options, "vue") }),
    )
  }

  if (enableSvelte) {
    configs.push(svelte({ ignoreTypeScript: !!enableTypeScript }))
  }

  if (enableSolid) {
    configs.push(
      solid({
        ignoreTypeScript: !!enableTypeScript,
        tsconfigPath: typescriptOptions?.tsconfigPath
          ? [typescriptOptions.tsconfigPath]
          : undefined,
      }),
    )
  }

  if (enableAngular) configs.push(angular())

  if (enableAstro) configs.push(astro())

  if (enableNode) configs.push(node())
  if (enableRegexp) configs.push(regexp())
  if (enableJsdoc) configs.push(jsdoc())
  if (enableTest) configs.push(test({ isInEditor }))

  if (enableJsonc) configs.push(jsonc(), sortPackageJson(), sortTsConfig())
  if (enableYaml) configs.push(yaml())
  if (enableToml) configs.push(toml())

  if (enableMarkdown) configs.push(markdown({ componentExts: enableVue ? ["vue"] : [] }))

  configs.push(disables())

  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options) acc[key] = options[key] as any
    return acc
  }, {} as TypedFlatConfigItem)
  if (Object.keys(fusedConfig).length) configs.push([fusedConfig])

  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>().append(
    ...configs,
    ...(userConfigs as any),
  )

  if (enableMarkdown) {
    composer = composer.setDefaultIgnores((prev) => [...prev, GLOB_MARKDOWN])
  }

  composer.renamePlugins(defaultPluginRenaming)

  if (isInEditor) {
    composer = composer.disableRulesFix(
      ["unused-imports/no-unused-imports", "test/no-only-tests", "prefer-const"],
      {
        builtinRules: () =>
          import(["eslint", "use-at-your-own-risk"].join("/")).then(
            (config) => config.builtinRules,
          ),
      },
    )
  }

  return composer
}
