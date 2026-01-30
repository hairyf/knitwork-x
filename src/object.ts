import type { CodegenOptions } from "./types";
import { genObjectKey, wrapInDelimiters } from "./utils";

export interface GenObjectOptions extends CodegenOptions {
  preserveTypes?: boolean;
}

/**
 * Object literal field descriptor.
 *
 * @example `'a'` → `{ a }` (shorthand property)
 * @example `['a', 'b']` → `{ a: b }` (key-value)
 * @example `['...', 'c']` → `{ ...c }` (spread)
 */
export type LiteralField = string | [string | "...", string];

/**
 * Serialize an object to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genObjectFromRaw({ foo: "bar", test: '() => import("pkg")' })
 * // ~> `{ foo: bar, test: () => import("pkg") }`
 * ```
 *
 * @group serialization
 */
export function genObjectFromRaw(
  object: Record<string, any>,
  indent = "",
  options: GenObjectOptions = {},
): string {
  return genObjectFromRawEntries(Object.entries(object), indent, options);
}

/**
 * Serialize an object to a string.
 *
 * Values are escaped and quoted if necessary.
 *
 * @example
 *
 * ```js
 * genObjectFromValues({ foo: "bar" })
 * // ~> `{ foo: "bar" }`
 * ```
 *
 * @group serialization
 */
export function genObjectFromValues(
  obj: Record<string, any>,
  indent = "",
  options: GenObjectOptions = {},
): string {
  return genObjectFromRaw(obj, indent, { preserveTypes: true, ...options });
}

/**
 * Serialize an array to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genArrayFromRaw([1, 2, 3])
 * // ~> `[1, 2, 3]`
 * ```
 *
 * @group serialization
 */
export function genArrayFromRaw(
  array: any[],
  indent = "",
  options: GenObjectOptions = {},
) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map((index) => `${newIdent}${genRawValue(index, newIdent, options)}`),
    indent,
    "[]",
  );
}

/**
 * Serialize an array of key-value pairs to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genObjectFromRawEntries([["foo", "bar"], ["baz", 1]]);
 * // ~> `{ foo: bar, baz: 1 }`
 * ```
 *
 * @group serialization
 */
export function genObjectFromRawEntries(
  array: [key: string, value: any][],
  indent = "",
  options: GenObjectOptions = {},
) {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    array.map(
      ([key, value]) =>
        `${newIdent}${genObjectKey(key)}: ${genRawValue(value, newIdent, options)}`,
    ),
    indent,
    "{}",
  );
}

/**
 * Create object literal from field descriptors.
 *
 * @example
 *
 * ```js
 * genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])
 * // ~> `{ type, type: A, ...b }`
 * ```
 *
 * @param fields - Array of LiteralField: shorthand (string), key-value ([key, value]), or spread (['...', name])
 * @group serialization
 */
export function genObjectLiteral(
  fields: LiteralField[],
  indent = "",
  _options: GenObjectOptions = {},
): string {
  const newIndent = indent + "  ";
  const lines = fields.map((field) => {
    if (typeof field === "string") {
      return `${newIndent}${genObjectKey(field)}`;
    }
    const [key, value] = field;
    if (key === "...") {
      return `${newIndent}...${value}`;
    }
    return `${newIndent}${genObjectKey(key)}: ${value}`;
  });
  return wrapInDelimiters(lines, indent, "{}");
}

// --- Internals ---

function genRawValue(
  value: unknown,
  indent = "",
  options: GenObjectOptions = {},
): string {
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return genArrayFromRaw(value, indent, options);
  }
  if (value && typeof value === "object") {
    return genObjectFromRaw(value, indent, options);
  }
  if (options.preserveTypes && typeof value !== "function") {
    return JSON.stringify(value);
  }
  return value.toString();
}
