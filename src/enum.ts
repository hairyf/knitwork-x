import { genString } from "./string";
import { genKey, wrapInDelimiters } from "./utils";
import type { EnumMemberValue, GenEnumOptions } from "./types";

/**
 * Generate typescript enum or const enum.
 *
 * @example
 *
 * ```js
 * genEnum("Color", { Red: 0, Green: 1, Blue: 2 });
 * // ~> `enum Color { Red = 0, Green = 1, Blue = 2 }`
 *
 * genEnum("Status", { Active: "active", Inactive: "inactive" });
 * // ~> `enum Status { Active = "active", Inactive = "inactive" }`
 *
 * genEnum("Auto", { A: undefined, B: undefined, C: undefined });
 * // ~> `enum Auto { A = 0, B = 1, C = 2 }`
 *
 * genEnum("MyEnum", { Foo: 1 }, { export: true, const: true });
 * // ~> `export const enum MyEnum { Foo = 1 }`
 * ```
 *
 * @group Typescript
 */
export function genEnum(
  name: string,
  members: Record<string, EnumMemberValue>,
  options: GenEnumOptions = {},
  indent = "",
): string {
  const { const: isConst, export: isExport, ...codegenOpts } = options;
  let lastNumeric: number | undefined;
  const newIndent = indent + "  ";
  const lines = Object.entries(members).map(([key, value]) => {
    const k = genKey(key);
    if (typeof value === "number") {
      lastNumeric = value;
      return `${newIndent}${k} = ${value}`;
    }
    if (typeof value === "string") {
      lastNumeric = undefined;
      return `${newIndent}${k} = ${genString(value, codegenOpts)}`;
    }
    // value === undefined: auto-increment for numeric enum
    if (lastNumeric !== undefined) {
      lastNumeric += 1;
      return `${newIndent}${k} = ${lastNumeric}`;
    }
    lastNumeric = 0;
    return `${newIndent}${k}`;
  });
  const prefix = [isExport && "export", isConst && "const", "enum", name]
    .filter(Boolean)
    .join(" ");
  const body =
    lines.length === 0 ? "{}" : wrapInDelimiters(lines, indent, "{}", true);
  return `${prefix} ${body}`;
}

/**
 * Generate typescript const enum (shorthand for `genEnum` with `const: true`).
 *
 * @example
 *
 * ```js
 * genConstEnum("Direction", { Up: 1, Down: 2 });
 * // ~> `const enum Direction { Up = 1, Down = 2 }`
 *
 * genConstEnum("Mode", { Read: 0, Write: 1 }, { export: true });
 * // ~> `export const enum Mode { Read = 0, Write = 1 }`
 * ```
 *
 * @group Typescript
 */
export function genConstEnum(
  name: string,
  members: Record<string, EnumMemberValue>,
  options: Omit<GenEnumOptions, "const"> = {},
  indent = "",
): string {
  return genEnum(name, members, { ...options, const: true }, indent);
}
