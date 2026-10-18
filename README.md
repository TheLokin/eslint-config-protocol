# eslint-config-protocol

- Opinionated by design, but [very customizable](#customization).
- Works out of the box with TypeScript, JSX, JSON, YAML, TOML, Markdown and more.
- Optional support for [React](#react), [Next.js](#nextjs), [Vue](#vue), [Svelte](#svelte), [Solid](#solid), [Angular](#angular) and [Astro](#astro).
- Respects `.gitignore` by default.
- Built on [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).
- Requires ESLint v9.10.0 or later.

## Install

```bash
pnpm i -D eslint eslint-config-protocol
```

Create `eslint.config.js` in your project root:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol()
```

<details>
<summary>Using a legacy config</summary>

If you still use `.eslintrc` configs, adapt them for flat config with [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc):

```js
// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc"
import protocol from "eslint-config-protocol"

const compat = new FlatCompat()

export default protocol(
  // Options for the preset.
  {},
  // Legacy config.
  ...compat.config({
    extends: [
      "eslint:recommended",
      // Other extends...
    ],
  }),
  // Your own flat config items.
)
```

> `.eslintignore` is not supported by flat config. See [Options](#options) for the `ignores` replacement.

</details>

## Customization

The default configuration requires no options:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol()
```

To customize the configuration, pass an options object:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  // Project type: `lib` for libraries, `app` for applications.
  type: "app",
  // Extra glob patterns to ignore. These extend the default ignores.
  ignores: [
    "**/fixtures",
    // ...other globs.
  ],
  // Read ignores patterns from `.gitignore`.
  gitignore: true,
  // TypeScript is auto-detected, but can also be enabled explicitly.
  typescript: true,
  // Disable the JSONC and YAML integrations.
  jsonc: false,
  yaml: false,
})
```

Standard ESLint flat config properties in the first argument are passed through unchanged. Additional ESLint flat config items can be passed as arguments:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol(
  // Options for the preset.
  {},

  // Plain ESLint flat config items can follow the options object.
  // Pass as many as you need.
  {
    files: ["**/*.ts"],
    rules: {},
  },
  {
    rules: {},
  },
)
```

### Options

| Option       | Type                           | Default       | Description                                                                                                         |
| ------------ | ------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `type`       | `"app" \| "lib"`               | `"app"`       | Type of the project. `"lib"` enables stricter rules for published libraries.                                        |
| `ignores`    | `string[]`                     | `[]`          | Globs to add to the global ignores. `.eslintignore` is no longer supported in flat config, use this option instead. |
| `gitignore`  | `boolean`                      | `true`        | Add the patterns from `.gitignore` to the global ignores.                                                           |
| `typescript` | `boolean \| OptionsTypescript` | Auto-detected | Enable TypeScript rules.                                                                                            |
| `jsx`        | `boolean \| OptionsJSX`        | `true`        | Enable JSX rules.                                                                                                   |
| `react`      | `boolean`                      | `false`       | Enable React rules.                                                                                                 |
| `nextjs`     | `boolean`                      | `false`       | Enable Next.js rules.                                                                                               |
| `vue`        | `boolean \| OptionsVue`        | `false`       | Enable Vue rules.                                                                                                   |
| `svelte`     | `boolean`                      | `false`       | Enable Svelte rules.                                                                                                |
| `solid`      | `boolean`                      | `false`       | Enable Solid rules.                                                                                                 |
| `angular`    | `boolean`                      | `false`       | Enable Angular rules.                                                                                               |
| `astro`      | `boolean`                      | `false`       | Enable Astro rules.                                                                                                 |
| `node`       | `boolean`                      | `true`        | Enable Node.js rules.                                                                                               |
| `imports`    | `boolean`                      | `true`        | Enable import rules. Covers import order, duplicated imports and export styles.                                     |
| `regexp`     | `boolean`                      | `true`        | Enable regular expression rules.                                                                                    |
| `jsdoc`      | `boolean`                      | `true`        | Enable JSDoc rules.                                                                                                 |
| `test`       | `boolean`                      | `true`        | Enable test rules. Includes Vitest rules and reports focused tests.                                                 |
| `jsonc`      | `boolean`                      | `true`        | Enable JSONC rules. Covers `.json`, `.json5` and `.jsonc` files.                                                    |
| `yaml`       | `boolean`                      | `true`        | Enable YAML rules.                                                                                                  |
| `toml`       | `boolean`                      | `true`        | Enable TOML rules.                                                                                                  |
| `markdown`   | `boolean`                      | `true`        | Enable Markdown rules, including code snippets inside Markdown files.                                               |

Sub-options are available when the corresponding option is set to an object:

| Option                    | Type      | Default     | Description                                     |
| ------------------------- | --------- | ----------- | ----------------------------------------------- |
| `typescript.erasableOnly` | `boolean` | `false`     | Enable erasable syntax only rules.              |
| `typescript.tsconfigPath` | `string`  | `undefined` | Path to the tsconfig used for type-aware rules. |
| `jsx.a11y`                | `boolean` | `false`     | Enable JSX accessibility rules.                 |
| `vue.a11y`                | `boolean` | `false`     | Enable Vue accessibility rules.                 |

### Type-Aware Rules

TypeScript is detected automatically, but [type-aware rules](https://typescript-eslint.io/linting/typed-linting/) only run when you provide a tsconfig path:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
})
```

### Erasable Syntax Only

To disallow TypeScript syntax that cannot be stripped at runtime, such as enums, namespaces and parameter properties, enable `erasableOnly`:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  typescript: {
    erasableOnly: true,
  },
})
```

### JSX

JSX support is enabled by default. Accessibility rules are opt-in:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  jsx: {
    a11y: true,
  },
})
```

### React

Enable React support with the `react` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  react: true,
})
```

### Next.js

Enable Next.js support with the `nextjs` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  nextjs: true,
})
```

### Vue

Only Vue 3 is supported. [Vue 2 has reached end of life](https://v2.vuejs.org/eol/).

Enable Vue support with the `vue` option.

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  vue: true,
})
```

Accessibility rules can be enabled with `a11y`:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  vue: {
    a11y: true,
  },
})
```

### Svelte

Enable Svelte support with the `svelte` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  svelte: true,
})
```

### Solid

Enable Solid support with the `solid` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  solid: true,
})
```

### Angular

Enable Angular support with the `angular` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  angular: true,
})
```

### Astro

Enable Astro support with the `astro` option:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol({
  astro: true,
})
```

### Plugin Renaming

Flat config requires explicit plugin names, but some plugins are registered under custom namespaces rather than their original npm package names for consistency and ease of use:

| New Prefix | Original Prefix        | Source                                                                                                |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)            |
| `react/*`  | `@eslint-react/*`      | [@eslint-react/eslint-plugin](https://github.com/jsx-eslint/eslint-plugin-react)                      |
| `next/*`   | `@next/next`           | [@next/eslint-plugin-next](https://github.com/vercel/next.js/tree/canary/packages/eslint-plugin-next) |
| `import/*` | `import-lite/*`        | [eslint-plugin-import-lite](https://github.com/9promise/eslint-plugin-import-lite)                    |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                                |
| `test/*`   | `vitest/*`             | [@vitest/eslint-plugin](https://github.com/vitest-dev/eslint-plugin-vitest)                           |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                                   |

Use the new prefix when overriding or disabling rules inline:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type item = { value: string }
```

<details>
<summary>Restore the original prefixes</summary>

To use the original prefixes, rename them back:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol().renamePlugins({
  ts: "@typescript-eslint",
  react: "@eslint-react",
  next: "@next/next",
  import: "import-lite",
  node: "n",
  test: "vitest",
  yaml: "yml",
})
```

</details>

### Rule Overrides

Most rules are scoped to the file types they apply to: `ts/*` rules only run on `.ts` files, `vue/*` rules only on `.vue` files and so on. Scope your config with `files` to override them:

```js
// eslint.config.js
import protocol from "eslint-config-protocol"

export default protocol(
  {
    vue: true,
    typescript: true,
  },
  {
    // Scope Vue rules to Vue files. Otherwise, the Vue plugin may also handle non-Vue files.
    files: ["**/*.vue"],
    rules: {
      "vue/operator-linebreak": ["error", "before"],
    },
  },
  {
    // Without `files`, these rules apply to every linted file.
    rules: {
      "no-console": "off",
    },
  },
)
```
