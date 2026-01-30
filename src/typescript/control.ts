import { genBlock } from "./function";
import type {
  GenIfOptions,
  GenElseOptions,
  GenTryOptions,
  GenCatchOptions,
  GenFinallyOptions,
  GenPrefixedBlockOptions,
  GenSwitchOptions,
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

/**
 * Generate C-style `for (init; test; update) { body }` or single-statement form.
 *
 * @example
 *
 * ```js
 * genFor("let i = 0", "i < n", "i++", "console.log(i);");
 * // ~> `for (let i = 0; i < n; i++) { console.log(i); }`
 *
 * genFor("", "true", "", ["doWork();", "if (done) break;"]);
 * // ~> `for (; true; ) { doWork(); if (done) break; }`
 *
 * genFor("i = 0", "i < 10", "i++", "sum += i;", { bracket: false });
 * // ~> `for (i = 0; i < 10; i++) sum += i;`
 * ```
 *
 * @group Typescript
 */
export function genFor(
  init: string,
  test: string,
  update: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  const prefix = `for (${init}; ${test}; ${update})`;
  return genPrefixedBlock(prefix, statements, options, indent);
}

/**
 * Generate `for (left of iterable) { body }` or single-statement form.
 *
 * @example
 *
 * ```js
 * genForOf("const x", "items", "console.log(x);");
 * // ~> `for (const x of items) { console.log(x); }`
 *
 * genForOf("let [k, v]", "Object.entries(obj)", ["process(k, v);"]);
 * // ~> `for (let [k, v] of Object.entries(obj)) { process(k, v); }`
 *
 * genForOf("const item", "list", "yield item;", { bracket: false });
 * // ~> `for (const item of list) yield item;`
 * ```
 *
 * @group Typescript
 */
export function genForOf(
  left: string,
  iterable: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  const prefix = `for (${left} of ${iterable})`;
  return genPrefixedBlock(prefix, statements, options, indent);
}

/**
 * Generate `for (left in obj) { body }` or single-statement form.
 *
 * @example
 *
 * ```js
 * genForIn("const key", "obj", "console.log(key, obj[key]);");
 * // ~> `for (const key in obj) { console.log(key, obj[key]); }`
 *
 * genForIn("const k", "o", ["sum += o[k];"]);
 * // ~> `for (const k in o) { sum += o[k]; }`
 *
 * genForIn("let p", "obj", "visit(p);", { bracket: false });
 * // ~> `for (let p in obj) visit(p);`
 * ```
 *
 * @group Typescript
 */
export function genForIn(
  left: string,
  obj: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  const prefix = `for (${left} in ${obj})`;
  return genPrefixedBlock(prefix, statements, options, indent);
}

/**
 * Generate `while (cond) { body }` or single-statement form.
 *
 * @example
 *
 * ```js
 * genWhile("running", "step();");
 * // ~> `while (running) { step(); }`
 *
 * genWhile("i > 0", ["process();", "i--;"]);
 * // ~> `while (i > 0) { process(); i--; }`
 *
 * genWhile("ok", "doIt();", { bracket: false });
 * // ~> `while (ok) doIt();`
 * ```
 *
 * @group Typescript
 */
export function genWhile(
  cond: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  return genPrefixedBlock(`while (${cond})`, statements, options, indent);
}

/**
 * Generate `do { body } while (cond);` or single-statement form.
 *
 * @example
 *
 * ```js
 * genDoWhile("step();", "!done");
 * // ~> `do { step(); } while (!done);`
 *
 * genDoWhile(["read();", "check();"], "eof");
 * // ~> `do { read(); check(); } while (eof);`
 *
 * genDoWhile("next();", "hasMore", { bracket: false });
 * // ~> `do next(); while (hasMore);`
 * ```
 *
 * @group Typescript
 */
export function genDoWhile(
  statements: string | string[],
  cond: string,
  options: GenPrefixedBlockOptions = {},
  indent = "",
): string {
  const prefix = "do";
  const suffix = ` while (${cond});`;
  const { bracket = true } = options;
  const lines = Array.isArray(statements) ? statements : [statements];
  if (!bracket) {
    const stmt = lines.length === 1 ? lines[0] : lines.join("\n");
    return `${indent}${prefix} ${stmt}${suffix}`;
  }
  const body = genBlock(lines, indent);
  return `${indent}${prefix} ${body}${suffix}`;
}

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

/**
 * Generate `throw expr;`.
 *
 * @example
 *
 * ```js
 * genThrow("new Error('failed')");
 * // ~> `throw new Error('failed');`
 *
 * genThrow("e");
 * // ~> `throw e;`
 * ```
 *
 * @group Typescript
 */
export function genThrow(expr: string, indent = ""): string {
  return `${indent}throw ${expr};`;
}

/**
 * Generate `return expr;` or `return;`.
 *
 * @example
 *
 * ```js
 * genReturn("x");
 * // ~> `return x;`
 *
 * genReturn();
 * // ~> `return;`
 *
 * genReturn("a + b");
 * // ~> `return a + b;`
 * ```
 *
 * @group Typescript
 */
export function genReturn(expr?: string, indent = ""): string {
  return expr === undefined ? `${indent}return;` : `${indent}return ${expr};`;
}
