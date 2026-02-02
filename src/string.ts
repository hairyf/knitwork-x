import type { CodegenOptions } from './types'

/**
 * Generate a string with double or single quotes and handle escapes.
 *
 * @example
 *
 * ```js
 * genString("foo");
 * // ~> `"foo"`
 *
 * genString("foo", { singleQuotes: true });
 * // ~> `'foo'`
 *
 * genString("foo\nbar");
 * // ~> `"foo\nbar"`
 * ```
 *
 * @group string
 */
export function genString(input: string, options: CodegenOptions = {}) {
  const str = JSON.stringify(input)
  if (!options.singleQuotes) {
    return str
  }
  return `'${escapeString(str).slice(1, -1)}'`
}

// https://github.com/rollup/rollup/blob/master/src/utils/escapeId.ts
const NEEDS_ESCAPE_RE = /[\n\r'\\\u2028\u2029]/
const QUOTE_NEWLINE_RE = /([\n\r'\u2028\u2029])/g
const BACKSLASH_RE = /\\/g

/**
 * Escape a string for use in a javascript string.
 *
 * @example
 *
 * ```js
 * escapeString("foo'bar");
 * // ~> `foo\'bar`
 *
 * escapeString("foo\nbar");
 * // ~> `foo\nbar`
 * ```
 *
 * @group string
 */
export function escapeString(id: string): string {
  if (!NEEDS_ESCAPE_RE.test(id)) {
    return id
  }
  return id.replace(BACKSLASH_RE, '\\\\').replace(QUOTE_NEWLINE_RE, '\\$1')
}

/**
 * Generate runtime template literal: `` `hello ${x}` `` (value, not type).
 *
 * @example
 *
 * ```js
 * genTemplateLiteral(["hello ", "x"]);
 * // ~> `` `hello ${x}` ``
 *
 * genTemplateLiteral(["prefix", "expr", "suffix"]);
 * // ~> `` `prefix${expr}suffix` ``
 *
 * genTemplateLiteral(["", "value"]);
 * // ~> `` `${value}` ``
 *
 * genTemplateLiteral(["text"]);
 * // ~> `` `text` ``
 * ```
 *
 * @param parts - array of parts: even indices are string literals, odd indices are expressions
 * @group string
 */
export function genTemplateLiteral(parts: string[]): string {
  if (parts.length === 0) {
    return '``'
  }
  // Escape backticks and ${ in string parts
  const escapeTemplateString = (str: string): string => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
  }
  let result = '`'
  for (const [i, part] of parts.entries()) {
    result += i % 2 === 0 ? escapeTemplateString(part) : `\${${part}}`
  }
  result += '`'
  return result
}

// -- internal --
