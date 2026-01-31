import type { GenVariableOptions } from "./types";

// Credit: https://mathiasbynens.be/notes/reserved-keywords
const reservedNames = new Set([
  "Infinity",
  "NaN",
  "arguments",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

/**
 * Generate a safe javascript variable name.
 *
 * @example
 *
 * ```js
 * genVariableName("valid_import");
 * // ~> `valid_import`
 *
 * genVariableName("for");
 * // ~> `_for`
 *
 * genVariableName("with space");
 * // ~> `with_32space`
 * ```
 *
 * @group Typescript
 */
export function genVariableName(name: string) {
  if (reservedNames.has(name)) {
    return `_${name}`;
  }
  /* eslint-disable unicorn/prefer-code-point */
  return name
    .replace(/^\d/, (r) => `_${r}`)
    .replace(/\W/g, (r) => "_" + r.charCodeAt(0));
  /* eslint-enable unicorn/prefer-code-point */
}

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
