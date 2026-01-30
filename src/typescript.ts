import { _genStatement } from "./_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "./esm";
import { genString } from "./string";
import type { CodegenOptions } from "./types";
import { genObjectKey, wrapInDelimiters } from "./utils";

export type TypeObject = {
  [key: string]: string | TypeObject;
};
export interface GenInterfaceOptions {
  extends?: string | string[];
  export?: boolean;
}

/** Enum member value: number, string, or undefined for auto-increment (numeric enums only). */
export type EnumMemberValue = number | string | undefined;

export interface GenEnumOptions extends CodegenOptions {
  /** Emit `const enum` instead of `enum`. */
  const?: boolean;
  /** Add `export` modifier. */
  export?: boolean;
}

/**
 * Generate a typescript `export type` statement.
 *
 * @group Typescript
 */
export function genTypeExport(
  specifier: string,
  imports: ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("export type", specifier, imports, options);
}

/**
 * Generate an typescript `typeof import()` statement for default import.
 *
 * @group Typescript
 */
export function genInlineTypeImport(
  specifier: string,
  name = "default",
  options: ESMCodeGenOptions = {},
) {
  return `typeof ${genDynamicImport(specifier, {
    ...options,
    wrapper: false,
  })}.${name}`;
}

/**
 * Generate typescript object type.
 *
 * @group Typescript
 */
export function genTypeObject(object: TypeObject, indent = ""): string {
  const newIndent = indent + "  ";
  return wrapInDelimiters(
    Object.entries(object).map(([key, value]) => {
      const [, k = key, optional = ""] =
        key.match(/^(.*[^?])(\?)?$/) /* c8 ignore next */ || [];
      if (typeof value === "string") {
        return `${newIndent}${genObjectKey(k)}${optional}: ${value}`;
      }
      return `${newIndent}${genObjectKey(k)}${optional}: ${genTypeObject(
        value,
        newIndent,
      )}`;
    }),
    indent,
    "{}",
    false,
  );
}

/**
 * Generate typescript interface.
 *
 * @group Typescript
 */
export function genInterface(
  name: string,
  contents?: TypeObject,
  options: GenInterfaceOptions = {},
  indent = "",
): string {
  const result = [
    options.export && "export",
    `interface ${name}`,
    options.extends &&
      `extends ${
        Array.isArray(options.extends)
          ? options.extends.join(", ")
          : options.extends
      }`,
    contents ? genTypeObject(contents, indent) : "{}",
  ]
    .filter(Boolean)
    .join(" ");
  return result;
}

/**
 * Generate typescript enum or const enum.
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
    const k = genObjectKey(key);
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
  const prefix = [
    isExport && "export",
    isConst && "const",
    "enum",
    name,
  ]
    .filter(Boolean)
    .join(" ");
  const body =
    lines.length === 0
      ? "{}"
      : wrapInDelimiters(lines, indent, "{}", true);
  return `${prefix} ${body}`;
}

/**
 * Generate typescript const enum (shorthand for `genEnum` with `const: true`).
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

/**
 * Generate typescript `declare module` augmentation.
 *
 * @group Typescript
 */
export function genAugmentation(
  specifier: string,
  interfaces?: Record<
    string,
    TypeObject | [TypeObject, Omit<GenInterfaceOptions, "export">]
  >,
): string {
  return `declare module ${genString(specifier)} ${wrapInDelimiters(
    Object.entries(interfaces || {}).map(
      ([key, entry]) =>
        "  " +
        (Array.isArray(entry)
          ? genInterface(key, ...entry)
          : genInterface(key, entry, {}, "  ")),
    ),
    undefined,
    undefined,
    false,
  )}`;
}
