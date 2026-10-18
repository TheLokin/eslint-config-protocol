import type { TypedFlatConfigItem } from "../types/config"
import type { OptionsVue } from "../types/options"
import { mergeProcessors } from "eslint-merge-processors"
import { GLOB_VUE } from "../lib/globs"
import { interopDefault } from "../lib/utils"

export async function vue(
  options: {
    ignoreTypeScript?: boolean
  } & OptionsVue = {},
): Promise<TypedFlatConfigItem[]> {
  const { ignoreTypeScript: hasTypeScript = false, a11y = false } = options

  const [pluginVue, parserVue, processorVueBlocks, pluginVueA11y] = await Promise.all([
    interopDefault(import("eslint-plugin-vue")),
    interopDefault(import("vue-eslint-parser")),
    interopDefault(import("eslint-processor-vue-blocks")),
    ...(a11y ? [interopDefault(import("eslint-plugin-vuejs-accessibility"))] : []),
  ])

  return [
    {
      name: "protocol/vue/setup",
      plugins: {
        vue: pluginVue,
        ...(a11y ? { "vue-a11y": pluginVueA11y } : {}),
      },
      languageOptions: {
        globals: {
          computed: "readonly",
          defineEmits: "readonly",
          defineExpose: "readonly",
          defineProps: "readonly",
          onMounted: "readonly",
          onUnmounted: "readonly",
          reactive: "readonly",
          ref: "readonly",
          shallowReactive: "readonly",
          shallowRef: "readonly",
          toRef: "readonly",
          toRefs: "readonly",
          watch: "readonly",
          watchEffect: "readonly",
        },
      },
    },
    {
      name: "protocol/vue/rules",
      files: [GLOB_VUE],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: [".vue"],
          parser: hasTypeScript ? await interopDefault(import("@typescript-eslint/parser")) : null,
          sourceType: "module",
        },
      },
      processor: mergeProcessors([
        pluginVue.processors[".vue"],
        processorVueBlocks({ blocks: { styles: true } }),
      ]),
      rules: {
        ...(pluginVue.configs.base.rules as any),
        ...(pluginVue.configs["flat/essential"]
          .map((config) => config.rules)
          .reduce((acc, config) => ({ ...acc, ...config }), {}) as any),
        ...(pluginVue.configs["flat/strongly-recommended"]
          .map((config) => config.rules)
          .reduce((acc, config) => ({ ...acc, ...config }), {}) as any),
        ...(pluginVue.configs["flat/recommended"]
          .map((config) => config.rules)
          .reduce((acc, config) => ({ ...acc, ...config }), {}) as any),
        "node/prefer-global/process": "off",
        "ts/explicit-function-return-type": "off",
        "vue/block-order": ["error", { order: ["script", "template", "style"] }],
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        "vue/component-options-name-casing": ["error", "PascalCase"],
        "vue/custom-event-name-casing": ["error", "camelCase"],
        "vue/define-macros-order": [
          "error",
          { order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"] },
        ],
        "vue/dot-location": ["error", "property"],
        "vue/dot-notation": ["error", { allowKeywords: true }],
        "vue/eqeqeq": ["error", "smart"],
        "vue/html-indent": ["error", 2],
        "vue/html-quotes": ["error", "double"],
        "vue/max-attributes-per-line": "off",
        "vue/multi-word-component-names": "off",
        "vue/no-dupe-keys": "off",
        "vue/no-empty-pattern": "error",
        "vue/no-irregular-whitespace": "error",
        "vue/no-loss-of-precision": "error",
        "vue/no-restricted-syntax": [
          "error",
          "DebuggerStatement",
          "LabeledStatement",
          "WithStatement",
        ],
        "vue/no-restricted-v-bind": ["error", "/^v-/"],
        "vue/no-setup-props-reactivity-loss": "off",
        "vue/no-sparse-arrays": "error",
        "vue/no-unused-refs": "error",
        "vue/no-useless-v-bind": "error",
        "vue/no-v-html": "off",
        "vue/object-shorthand": [
          "error",
          "always",
          { avoidQuotes: true, ignoreConstructors: false },
        ],
        "vue/prefer-separate-static-class": "error",
        "vue/prefer-template": "error",
        "vue/prop-name-casing": ["error", "camelCase"],
        "vue/require-default-prop": "off",
        "vue/require-prop-types": "off",
        "vue/space-infix-ops": "error",
        "vue/space-unary-ops": ["error", { nonwords: false, words: true }],
        ...(a11y
          ? {
              "vue-a11y/alt-text": "error",
              "vue-a11y/anchor-has-content": "error",
              "vue-a11y/aria-props": "error",
              "vue-a11y/aria-role": "error",
              "vue-a11y/aria-unsupported-elements": "error",
              "vue-a11y/click-events-have-key-events": "error",
              "vue-a11y/form-control-has-label": "error",
              "vue-a11y/heading-has-content": "error",
              "vue-a11y/iframe-has-title": "error",
              "vue-a11y/interactive-supports-focus": "error",
              "vue-a11y/label-has-for": "error",
              "vue-a11y/media-has-caption": "warn",
              "vue-a11y/mouse-events-have-key-events": "error",
              "vue-a11y/no-access-key": "error",
              "vue-a11y/no-aria-hidden-on-focusable": "error",
              "vue-a11y/no-autofocus": "warn",
              "vue-a11y/no-distracting-elements": "error",
              "vue-a11y/no-redundant-roles": "error",
              "vue-a11y/no-role-presentation-on-focusable": "error",
              "vue-a11y/no-static-element-interactions": "error",
              "vue-a11y/role-has-required-aria-props": "error",
              "vue-a11y/tabindex-no-positive": "warn",
            }
          : {}),
      },
    },
  ]
}
