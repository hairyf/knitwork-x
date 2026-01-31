import { genBlock } from "./function";
import type {
  GenIfOptions,
  GenElseOptions,
  GenPrefixedBlockOptions,
} from "./types";

/**
 * Low-level helper: generate `prefix { statements }` or `prefix statement`.
 *
 * @example
 *
 * ```js
 * genPrefixedBlock("if (ok)", "return true;");
 * // ~> `if (ok) { return true; }`
 *
 * genPrefixedBlock("while (running)", ["step();", "check();"]);
 * // ~> `while (running) { step(); check(); }`
 *
 * genPrefixedBlock("for (;;)", "break;", { bracket: false });
 * // ~> `for (;;) break;`
 * ```
 *
 * @group Typescript
 */
export function genPrefixedBlock(
  prefix: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  const { bracket = true } = options;
  const lines = Array.isArray(statements) ? statements : [statements];
  if (!bracket) {
    const stmt = lines.length === 1 ? lines[0] : lines.join("\n");
    return `${indent}${prefix} ${stmt}`;
  }
  const body = genBlock(lines, indent);
  return `${indent}${prefix} ${body}`;
}

/**
 * Generate ternary expression `cond ? whenTrue : whenFalse`.
 *
 * @example
 *
 * ```js
 * genTernary("x > 0", "x", "-x");
 * // ~> `x > 0 ? x : -x`
 *
 * genTernary("ok", "'yes'", "'no'");
 * // ~> `ok ? 'yes' : 'no'`
 * ```
 *
 * @group Typescript
 */
export function genTernary(
  cond: string,
  whenTrue: string,
  whenFalse: string,
): string {
  return `${cond} ? ${whenTrue} : ${whenFalse}`;
}

/**
 * Generate `if (cond) { statements }` or `if (cond) statement`.
 *
 * @example
 *
 * ```js
 * genIf("x > 0", "return x;");
 * // ~> `if (x > 0) { return x; }`
 *
 * genIf("ok", ["doA();", "doB();"]);
 * // ~> `if (ok) { doA(); doB(); }`
 *
 * genIf("x", "console.log(x);", { bracket: false });
 * // ~> `if (x) console.log(x);`
 * ```
 *
 * @group Typescript
 */
export function genIf(
  cond: string,
  statements: string | string[],
  options: GenIfOptions = {},
  indent = "",
): string {
  return genPrefixedBlock(`if (${cond})`, statements, options, indent);
}

/**
 * Generate `else if (cond) { statements }` or `else if (cond) statement`.
 *
 * @example
 *
 * ```js
 * genElseIf("x < 0", "return -x;");
 * // ~> `else if (x < 0) { return -x; }`
 *
 * genElseIf("ok", "doIt();", { bracket: false });
 * // ~> `else if (ok) doIt();`
 * ```
 *
 * @group Typescript
 */
export function genElseIf(
  cond: string,
  statements: string | string[],
  options: GenIfOptions = {},
  indent = "",
): string {
  return genPrefixedBlock(`else if (${cond})`, statements, options, indent);
}

/**
 * Generate `else { statements }` or `else statement`.
 *
 * @example
 *
 * ```js
 * genElse(["return 0;"]);
 * // ~> `else { return 0; }`
 *
 * genElse("fallback();");
 * // ~> `else { fallback(); }`
 *
 * genElse("doIt();", { bracket: false });
 * // ~> `else doIt();`
 * ```
 *
 * @group Typescript
 */
export function genElse(
  statements: string | string[],
  options: GenElseOptions = {},
  indent = "",
): string {
  return genPrefixedBlock("else", statements, options, indent);
}
