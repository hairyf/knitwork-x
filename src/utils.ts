import { VALID_IDENTIFIER_RE } from "./_utils";
import { genString } from "./string";

/**
 * Generate a JSDoc block comment from lines.
 *
 * @example
 *
 * ```js
 * genJSDocComment("Single line");
 * // ~> block comment with one line
 *
 * genJSDocComment(["Line one", "@param x - number", "@returns void"]);
 * // ~> multi-line block with those lines
 *
 * genJSDocComment("Indented", "  ");
 * // ~> same block, each line prefixed with indent
 * ```
 *
 * @group utils
 */
export function genJSDocComment(jsdoc: string | string[], indent = ""): string {
  const lines = Array.isArray(jsdoc) ? jsdoc : [jsdoc];
  return (
    indent +
    "/**\n" +
    lines.map((line) => indent + " * " + line).join("\n") +
    "\n" +
    indent +
    " */\n"
  );
}

/**
 * Wrap an array of strings in delimiters.
 *
 * @group utils
 */
export function wrapInDelimiters(
  lines: string[],
  indent = "",
  delimiters = "{}",
  withComma = true,
) {
  if (lines.length === 0) {
    return delimiters;
  }
  const [start, end] = delimiters;
  return (
    `${start}\n` + lines.join(withComma ? ",\n" : "\n") + `\n${indent}${end}`
  );
}

/**
 * Generate a safe javascript variable name for an object key.
 *
 * @example
 *
 * ```js
 * genObjectKey("foo");
 * // ~> `foo`
 *
 * genObjectKey("foo-bar");
 * // ~> `"foo-bar"`
 *
 * genObjectKey("with space");
 * // ~> `"with space"`
 * ```
 *
 * @group utils
 */
export function genObjectKey(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}
