import type { TypedFlatConfigItem } from "../types/config"
import { GLOB_HTML, GLOB_TS } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function angular(): Promise<TypedFlatConfigItem[]> {
  const [pluginAngular, pluginAngularTemplate, parserAngularTemplate] = await Promise.all([
    interopDefault(import("@angular-eslint/eslint-plugin")),
    interopDefault(import("@angular-eslint/eslint-plugin-template")),
    interopDefault(import("@angular-eslint/template-parser")),
  ])

  return [
    {
      name: "protocol/angular/setup",
      plugins: {
        "angular": pluginAngular,
        "angular-template": pluginAngularTemplate,
      },
    },
    {
      name: "protocol/angular/rules/ts",
      files: [GLOB_TS],
      processor: pluginAngularTemplate.processors[
        "extract-inline-html"
      ] as TypedFlatConfigItem["processor"],
      rules: {
        "angular/contextual-lifecycle": "error",
        "angular/no-empty-lifecycle-method": "error",
        "angular/no-input-rename": "error",
        "angular/no-inputs-metadata-property": "error",
        "angular/no-output-native": "error",
        "angular/no-output-on-prefix": "error",
        "angular/no-output-rename": "error",
        "angular/no-outputs-metadata-property": "error",
        "angular/prefer-inject": "error",
        "angular/prefer-standalone": "error",
        "angular/use-lifecycle-interface": "error",
        "angular/use-pipe-transform-interface": "error",
      },
    },
    {
      name: "protocol/angular/rules/template",
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserAngularTemplate,
      },
      rules: {
        "angular-template/banana-in-box": "error",
        "angular-template/eqeqeq": "error",
        "angular-template/no-negated-async": "error",
        "angular-template/prefer-control-flow": "error",
      },
    },
  ]
}
