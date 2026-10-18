export interface OptionsTypescript {
  /**
   * Enable erasable syntax only rules.
   *
   * Disallows TypeScript syntax that cannot be erased at runtime, such as
   * enums, namespaces and parameter properties.
   *
   * @default false
   */
  erasableOnly?: boolean

  /**
   * Path to the tsconfig used for type-aware rules.
   *
   * Type-aware rules are only enabled when this option is provided.
   *
   * @default undefined
   */
  tsconfigPath?: string
}

export interface OptionsJSX {
  /**
   * Enable JSX accessibility rules.
   *
   * @default false
   */
  a11y?: boolean
}

export interface OptionsVue {
  /**
   * Enable Vue accessibility rules.
   *
   * @default false
   */
  a11y?: boolean
}

export interface OptionsConfig {
  /**
   * Type of the project.
   *
   * `"lib"` enables stricter rules for published libraries.
   *
   * @default "app"
   */
  type?: "app" | "lib"

  /**
   * Globs to add to the global ignores.
   *
   * `.eslintignore` is no longer supported in flat config, use this option
   * instead. These globs are always treated as global ignores and extend the
   * default ignores, they don't replace them.
   *
   * @default [ ]
   */
  ignores?: string[]

  /**
   * Add the patterns from `.gitignore` to the global ignores.
   *
   * @default true
   */
  gitignore?: boolean

  /**
   * Enable TypeScript rules.
   *
   * Passing an object also forwards its options, see {@link OptionsTypescript}.
   *
   * @default auto-detected from the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable JSX rules.
   *
   * Passing an object also forwards its options, see {@link OptionsJSX}.
   *
   * @default true
   */
  jsx?: boolean | OptionsJSX

  /**
   * Enable React rules.
   *
   * @default false
   */
  react?: boolean

  /**
   * Enable Next.js rules.
   *
   * @default false
   */
  nextjs?: boolean

  /**
   * Enable Vue rules.
   *
   * Passing an object also forwards its options, see {@link OptionsVue}.
   *
   * @default false
   */
  vue?: boolean | OptionsVue

  /**
   * Enable Svelte rules.
   *
   * @default false
   */
  svelte?: boolean

  /**
   * Enable Solid rules.
   *
   * @default false
   */
  solid?: boolean

  /**
   * Enable Angular rules.
   *
   * @default false
   */
  angular?: boolean

  /**
   * Enable Astro rules.
   *
   * @default false
   */
  astro?: boolean

  /**
   * Enable Node.js rules.
   *
   * @default true
   */
  node?: boolean

  /**
   * Enable import rules.
   *
   * Covers import order, duplicated imports and export styles.
   *
   * @default true
   */
  imports?: boolean

  /**
   * Enable regular expression rules.
   *
   * @default true
   */
  regexp?: boolean

  /**
   * Enable JSDoc rules.
   *
   * @default true
   */
  jsdoc?: boolean

  /**
   * Enable test rules.
   *
   * Includes Vitest rules and reports focused tests.
   *
   * @default true
   */
  test?: boolean

  /**
   * Enable JSONC rules.
   *
   * Covers `.json`, `.json5` and `.jsonc` files.
   *
   * @default true
   */
  jsonc?: boolean

  /**
   * Enable YAML rules.
   *
   * @default true
   */
  yaml?: boolean

  /**
   * Enable TOML rules.
   *
   * @default true
   */
  toml?: boolean

  /**
   * Enable Markdown rules, including code snippets inside Markdown files.
   *
   * @default true
   */
  markdown?: boolean
}
