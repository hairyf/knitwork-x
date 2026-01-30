import { genBlock } from "./function";
import type {
  GenIfOptions,
  GenElseOptions,
  GenTryOptions,
  GenCatchOptions,
  GenFinallyOptions,
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

/**
 * Generate `try { statements }` or `try statement`.
 *
 * @example
 *
 * ```js
 * genTry("mightThrow();");
 * // ~> `try { mightThrow(); }`
 *
 * genTry(["const x = await f();", "return x;"]);
 * // ~> `try { const x = await f(); return x; }`
 *
 * genTry("f();", { bracket: false });
 * // ~> `try f();`
 * ```
 *
 * @group Typescript
 */
export function genTry(
  statements: string | string[],
  options: GenTryOptions = {},
  indent = "",
): string {
  return genPrefixedBlock("try", statements, options, indent);
}

/**
 * Generate `catch (binding) { statements }`, `catch { statements }`, or single-statement form.
 *
 * @example
 *
 * ```js
 * genCatch(["throw e;"], { binding: "e" });
 * // ~> `catch (e) { throw e; }`
 *
 * genCatch(["logError();"]);
 * // ~> `catch { logError(); }`
 *
 * genCatch("handle(e);", { binding: "e", bracket: false });
 * // ~> `catch (e) handle(e);`
 * ```
 *
 * @group Typescript
 */
export function genCatch(
  statements: string | string[],
  options: GenCatchOptions = {},
  indent = "",
): string {
  const prefix =
    typeof options.binding === "string"
      ? `catch (${options.binding})`
      : "catch";
  return genPrefixedBlock(prefix, statements, options, indent);
}

/**
 * Generate `finally { statements }` or `finally statement`.
 *
 * @example
 *
 * ```js
 * genFinally("cleanup();");
 * // ~> `finally { cleanup(); }`
 *
 * genFinally(["release();", "log('done');"]);
 * // ~> `finally { release(); log('done'); }`
 *
 * genFinally("cleanup();", { bracket: false });
 * // ~> `finally cleanup();`
 * ```
 *
 * @group Typescript
 */
export function genFinally(
  statements: string | string[],
  options: GenFinallyOptions = {},
  indent = "",
): string {
  return genPrefixedBlock("finally", statements, options, indent);
}
