import type { Linter } from "eslint"
import type { ConfigWithExtends } from "eslint-flat-config-utils"
import type { RuleOptions } from "./rules"

export type Rules = Record<string, Linter.RuleEntry<any> | undefined> & RuleOptions

/** ESLint's `Linter.Config` with autocompletion for `rules`. */
export type TypedFlatConfigItem = Omit<ConfigWithExtends, "plugins" | "rules"> & {
  /**
   * A map of plugin names to plugin objects. When `files` is specified, the
   * plugins are only available to the matching files.
   *
   * @see https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new
   */
  plugins?: Record<string, any>

  /**
   * The configured rules. When `files` or `ignores` are specified, the rules
   * are only applied to the matching files.
   */
  rules?: Rules
}
