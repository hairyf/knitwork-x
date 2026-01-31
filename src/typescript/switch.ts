import { genPrefixedBlock } from "./condition";
import type { GenSwitchOptions } from "./types";

/**
 * Generate `case value:` optionally followed by indented statements (fall-through when omitted).
 *
 * @example
 *
 * ```js
 * genCase("1", "break;");
 * // ~> `case 1:\n  break;`
 *
 * genCase("'a'", ["doA();", "break;"]);
 * // ~> `case 'a':\n  doA();\n  break;`
 *
 * genCase("0");
 * // ~> `case 0:` (fall-through)
 * ```
 *
 * @group Typescript
 */
export function genCase(
  value: string,
  statements?: string | string[],
  indent = "",
): string {
  const line = `${indent}case ${value}:`;
  if (statements === undefined) return line;
  const arr = Array.isArray(statements) ? statements : [statements];
  if (arr.length === 0) return line;
  const inner = indent + "  ";
  const body = arr
    .flatMap((s) => s.split("\n"))
    .map((l) => inner + l)
    .join("\n");
  return `${line}\n${body}`;
}

/**
 * Generate `default:` optionally followed by indented statements.
 *
 * @example
 *
 * ```js
 * genDefault("return 0;");
 * // ~> `default:\n  return 0;`
 *
 * genDefault(["log('default');", "break;"]);
 * // ~> `default:\n  log('default');\n  break;`
 *
 * genDefault();
 * // ~> `default:` (fall-through)
 * ```
 *
 * @group Typescript
 */
export function genDefault(
  statements?: string | string[],
  indent = "",
): string {
  const line = `${indent}default:`;
  if (statements === undefined) return line;
  const arr = Array.isArray(statements) ? statements : [statements];
  if (arr.length === 0) return line;
  const inner = indent + "  ";
  const body = arr
    .flatMap((s) => s.split("\n"))
    .map((l) => inner + l)
    .join("\n");
  return `${line}\n${body}`;
}

/**
 * Generate `switch (expr) { cases }`.
 *
 * @example
 *
 * ```js
 * genSwitch("x", [genCase("1", "break;"), genDefault("return 0;")]);
 * // ~> `switch (x) {\n  case 1:\n    break;\n  default:\n    return 0;\n}`
 *
 * genSwitch("key", []);
 * // ~> `switch (key) {}`
 *
 * genSwitch("n", [genCase("0"), genCase("1", "return 1;")]);
 * // ~> switch with fall-through case 0
 * ```
 *
 * @group Typescript
 */
export function genSwitch(
  expr: string,
  cases: string[],
  options: GenSwitchOptions = {},
  indent = "",
): string {
  return genPrefixedBlock(`switch (${expr})`, cases, options, indent);
}
