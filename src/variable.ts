import type { GenVariableOptions } from "./types";

/**
 * Create variable declaration.
 *
 * @example
 *
 * ```js
 * genVariable("a", "2");
 * // ~> `const a = 2`
 *
 * genVariable("foo", "'bar'");
 * // ~> `const foo = 'bar'`
 *
 * genVariable("x", "1", { kind: "let" });
 * // ~> `let x = 1`
 *
 * genVariable("y", "2", { export: true });
 * // ~> `export const y = 2`
 * ```
 *
 * @param name - variable name
 * @param value - initializer (right-hand side expression)
 * @param options - optional { export?, kind? }
 * @group Typescript
 */
export function genVariable(
  name: string,
  value: string,
  options: GenVariableOptions = {},
): string {
  const kind = options.kind ?? "const";
  const prefix = [options.export && "export", kind, name]
    .filter(Boolean)
    .join(" ");
  return `${prefix} = ${value}`;
}
