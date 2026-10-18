import type { Linter } from "eslint"
import type { TypedFlatConfigItem } from "../types/config"
import type { OptionsTypescript } from "../types/options"
import { isPackageExists } from "local-pkg"
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from "../lib/globs"
import { interopDefault } from "../lib/utils"

const ReactRefreshAllowConstantExportPackages = ["vite"]
const RemixPackages = ["@remix-run/node", "@remix-run/react", "@remix-run/serve", "@remix-run/dev"]
const ReactRouterPackages = [
  "@react-router/node",
  "@react-router/react",
  "@react-router/serve",
  "@react-router/dev",
]
const NextJsPackages = ["next"]

export async function react(options: OptionsTypescript = {}): Promise<TypedFlatConfigItem[]> {
  const { tsconfigPath } = options

  const filesTypeAware = [GLOB_TS, GLOB_TSX]
  const ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS]
  const isTypeAware = !!tsconfigPath

  const [pluginReact, pluginReactRefresh] = await Promise.all([
    interopDefault(import("@eslint-react/eslint-plugin")),
    interopDefault(import("eslint-plugin-react-refresh")),
  ])

  const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((pkg) =>
    isPackageExists(pkg),
  )
  const isUsingRemix = RemixPackages.some((pkg) => isPackageExists(pkg))
  const isUsingReactRouter = ReactRouterPackages.some((pkg) => isPackageExists(pkg))
  const isUsingNext = NextJsPackages.some((pkg) => isPackageExists(pkg))

  return [
    {
      name: "protocol/react/setup",
      plugins: {
        "react": pluginReact.configs.all.plugins!["@eslint-react"],
        "react-refresh": pluginReactRefresh,
      },
    },
    {
      name: "protocol/react/rules",
      files: [GLOB_SRC],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
        sourceType: "module",
      },
      rules: {
        ...pluginReact.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "error",
          {
            allowConstantExport: isAllowConstantExport,
            allowExportNames: [
              ...(isUsingNext
                ? [
                    "dynamic",
                    "dynamicParams",
                    "revalidate",
                    "fetchCache",
                    "runtime",
                    "preferredRegion",
                    "maxDuration",
                    "generateStaticParams",
                    "metadata",
                    "generateMetadata",
                    "viewport",
                    "generateViewport",
                    "generateImageMetadata",
                    "generateSitemaps",
                  ]
                : []),
              ...(isUsingRemix || isUsingReactRouter
                ? [
                    "meta",
                    "links",
                    "headers",
                    "loader",
                    "action",
                    "clientLoader",
                    "clientAction",
                    "handle",
                    "shouldRevalidate",
                  ]
                : []),
            ],
          },
        ],
      },
    },
    {
      name: "protocol/react/typescript",
      files: filesTypeAware,
      rules: {
        "react/dom-no-string-style-prop": "off",
        "react/dom-no-unknown-property": "off",
      },
    },
    ...(isTypeAware
      ? [
          {
            name: "protocol/react/type-aware-rules",
            files: filesTypeAware,
            ignores: ignoresTypeAware,
            rules: {
              "react/no-leaked-conditional-rendering": "error",
            } as Record<string, Linter.RuleEntry>,
          },
        ]
      : []),
  ]
}
