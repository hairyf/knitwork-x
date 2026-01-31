import type { CodegenOptions } from "./types";
import { genKey, wrapInDelimiters } from "./utils";

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
 * genObject({ foo: "bar", test: '() => import("pkg")' })
 * // ~> `{ foo: bar, test: () => import("pkg") }`
 * ```
 *
 * @group serialization
 */
export function genObject(
  object: Record<string, any>,
  indent = "",
  options: GenObjectOptions = {},
): string {
  const newIdent = indent + "  ";
  return wrapInDelimiters(
    Object.entries(object).map(
      ([key, value]) =>
        `${newIdent}${genKey(key)}: ${genRawValue(value, newIdent, options)}`,
    ),
    indent,
    "{}",
  );
}

/**
 * Serialize an array to a string.
 *
 * Values are not escaped or quoted.
 *
 * @example
 *
 * ```js
 * genArray([1, 2, 3])
 * // ~> `[1, 2, 3]`
 * ```
 *
 * @group serialization
 */
export function genArray(
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
 * Create object literal from field descriptors.
 *
 * @example
 *
 * ```js
 * genLiteral(['type', ['type', 'A'], ['...', 'b']])
 * // ~> `{ type, type: A, ...b }`
 * ```
 *
 * @param fields - Array of LiteralField: shorthand (string), key-value ([key, value]), or spread (['...', name])
 * @group serialization
 */
export function genLiteral(
  fields: LiteralField[],
  indent = "",
  _options: GenObjectOptions = {},
): string {
  const newIndent = indent + "  ";
  const lines = fields.map((field) => {
    if (typeof field === "string") {
      return `${newIndent}${genKey(field)}`;
    }
    const [key, value] = field;
    if (key === "...") {
      return `${newIndent}...${value}`;
    }
    return `${newIndent}${genKey(key)}: ${value}`;
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
 * genMap([["foo", "bar"], ["baz", 1]]);
 * // ~> `new Map([["foo", "bar"], ["baz", 1]])`
 * ```
 *
 * @group serialization
 */
export function genMap(
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
 * genSet(["foo", "bar", 1]);
 * // ~> `new Set(["foo", "bar", 1])`
 * ```
 *
 * @group serialization
 */
export function genSet(
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
    return genArray(value, indent, options);
  }
  if (value && typeof value === "object") {
    return genObject(value, indent, options);
  }
  if (options.preserveTypes && typeof value !== "function") {
    return JSON.stringify(value);
  }
  return value.toString();
}
