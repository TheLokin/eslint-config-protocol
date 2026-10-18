import type { ESLint, Linter, Rule } from "eslint"
import type { JSONSchema4 } from "json-schema"
import { compile, normalizeIdentifier } from "json-schema-to-typescript-lite"

const EXPORT_PREFIX_REGEX = /^(export )/

export async function flatConfigsToPlugins(
  configs: Linter.Config[],
): Promise<Record<string, ESLint.Plugin>> {
  const plugins: Record<string, ESLint.Plugin> = {}
  for (const config of configs) {
    if (!config.plugins) continue
    for (const [name, plugin] of Object.entries(config.plugins)) {
      plugins[name] = plugin
    }
  }

  return plugins
}

export async function pluginsToRules(
  plugins: Record<string, ESLint.Plugin>,
): Promise<[name: string, rule: Rule.RuleModule][]> {
  const rules: [name: string, rule: Rule.RuleModule][] = []
  for (const [pluginName, plugin] of Object.entries(plugins)) {
    for (const [ruleName, rule] of Object.entries(plugin.rules || {})) {
      if (rule?.meta == null || typeof rule.meta === "object") {
        rules.push([pluginName ? `${pluginName}/${ruleName}` : ruleName, rule])
      }
    }
  }

  return rules
}

export interface RuleType {
  jsdoc: string[]
  name: string
  typeName: string
  typeDeclarations: string[]
}

export async function compileRule(name: string, rule: Rule.RuleModule): Promise<RuleType> {
  const meta = rule.meta ?? {}
  const schemas = Array.isArray(meta.schema) ? meta.schema : meta.schema ? [meta.schema] : []

  const jsdoc: string[] = []
  if (meta.docs?.description) jsdoc.push(meta.docs.description)
  if (meta.deprecated) jsdoc.push("@deprecated")
  if (meta.docs?.url) jsdoc.push(`@see ${meta.docs.url}`)

  if (!meta.schema || !schemas.length) {
    return {
      jsdoc,
      name,
      typeName: "[]",
      typeDeclarations: [],
    }
  }

  const schema: JSONSchema4 = Array.isArray(meta.schema)
    ? { type: "array", items: meta.schema, definitions: meta.schema?.[0]?.definitions }
    : meta.schema
  const typeName = normalizeIdentifier(name)
  const compiled = await compile(schema, typeName, {
    unreachableDefinitions: false,
    strictIndexSignatures: true,
    customName(schema, keyName) {
      const baseName = schema.title || schema.$id || keyName
      if (baseName === typeName) return typeName
      if (!baseName) return undefined!

      return `_${normalizeIdentifier(`${typeName}_${baseName}`)}`
    },
  })
  const typeDeclarations = compiled
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) =>
      line
        .replace(EXPORT_PREFIX_REGEX, "")
        .replace(/\s*\|\s*/g, " | ")
        .trimEnd(),
    )
    .filter(Boolean)

  return {
    jsdoc,
    name,
    typeName,
    typeDeclarations,
  }
}
