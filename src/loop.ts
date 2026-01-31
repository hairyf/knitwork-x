import { genBlock } from "./function";
import { genPrefixedBlock } from "./condition";
import type { GenPrefixedBlockOptions } from "./types";

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
