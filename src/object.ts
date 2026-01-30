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

/**
 * Serialize a Map to a string from raw entries.
 *
 * Values are escaped and quoted if necessary (strings, etc.).
 *
 * @example
 *
 * ```js
 * genMapFromRaw([["foo", "bar"], ["baz", 1]]);
 * // ~> `new Map([["foo", "bar"], ["baz", 1]])`
 * ```
 *
 * @group serialization
 */
export function genMapFromRaw(
  entries: [key: any, value: any][],
  indent = "",
  options: GenObjectOptions = {},
): string {
  const opts = { preserveTypes: true, ...options };
  if (entries.length === 0) {
    return "new Map([])";
  }
  // For simple cases, use single-line format
  const entriesString = entries.map(
    ([key, value]) =>
      `[${genRawValue(key, "", opts)}, ${genRawValue(value, "", opts)}]`,
  );
  // Check if all entries are simple (single line each)
  const allSimple = entriesString.every((s) => !s.includes("\n"));
  if (allSimple) {
    return `new Map([${entriesString.join(", ")}])`;
  }
  // Multi-line format for complex entries
  const newIndent = indent + "  ";
  const multiLineEntries = entries.map(
    ([key, value]) =>
      `[${genRawValue(key, newIndent, opts)}, ${genRawValue(value, newIndent, opts)}]`,
  );
  const entriesArray = wrapInDelimiters(multiLineEntries, indent, "[]");
  return `new Map(${entriesArray})`;
}

/**
 * Serialize a Set to a string from raw values.
 *
 * Values are escaped and quoted if necessary (strings, etc.).
 *
 * @example
 *
 * ```js
 * genSetFromRaw(["foo", "bar", 1]);
 * // ~> `new Set(["foo", "bar", 1])`
 * ```
 *
 * @group serialization
 */
export function genSetFromRaw(
  values: any[],
  indent = "",
  options: GenObjectOptions = {},
): string {
  const opts = { preserveTypes: true, ...options };
  if (values.length === 0) {
    return "new Set([])";
  }
  // For simple cases, use single-line format
  const valuesString = values.map((value) => genRawValue(value, "", opts));
  // Check if all values are simple (single line each)
  const allSimple = valuesString.every((s) => !s.includes("\n"));
  if (allSimple) {
    return `new Set([${valuesString.join(", ")}])`;
  }
  // Multi-line format for complex values
  const newIndent = indent + "  ";
  const multiLineValues = values.map((value) =>
    genRawValue(value, newIndent, opts),
  );
  const valuesArray = wrapInDelimiters(multiLineValues, indent, "[]");
  return `new Set(${valuesArray})`;
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
