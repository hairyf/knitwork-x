import { _genStatement } from "./_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "./esm";
import { genString } from "./string";
import type { CodegenOptions } from "./types";
import { genObjectKey, wrapInDelimiters } from "./utils";

export interface SpecificGeneric {
  name: string;
  extends?: string;
  default?: string;
}

export interface SpecificField {
  /** parameter name */
  name: string;
  /** parameter type */
  type?: string;
  /** optional parameter */
  optional?: boolean;
  /** default value (code string) */
  default?: string;
}

export interface SpecificFunction {
  /** function name */
  name: string;
  /** function params */
  parameters?: SpecificField[];
  /** function block (each string is one statement) */
  body?: string[];
  /** is export */
  export?: boolean;
  /** function comment */
  comment?: string | string[];
  /** async function */
  async?: boolean;
  /** generator function */
  generator?: boolean;
  /** return type */
  returnType?: string;
  /** generics */
  generics?: SpecificGeneric[];
}

export type TypeObjectWithJSDoc = {
  type: string;
  jsdoc: string | Record<string, unknown>;
};

export type TypeObject = {
  [key: string]: string | TypeObject | TypeObjectWithJSDoc;
};

export interface GenInterfaceOptions {
  extends?: string | string[];
  export?: boolean;
  jsdoc?: string | Record<string, unknown>;
}

/**
 * Type guard to check if a value is TypeObjectWithJSDoc
 */
function isTypeObjectWithJSDoc(value: unknown): value is TypeObjectWithJSDoc {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    "jsdoc" in value
  );
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
 * Create Type Alias
 *
 * @example type [name] = [value]
 * @param name - alias name
 * @param value - type value (right-hand side)
 * @group Typescript
 */
export function genTypeAlias(
  name: string,
  value: string,
  options: { export?: boolean } = {},
): string {
  const prefix = [options.export && "export", "type", name]
    .filter(Boolean)
    .join(" ");
  return `${prefix} = ${value}`;
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

      if (isTypeObjectWithJSDoc(value)) {
        const jsdocComment =
          typeof value.jsdoc === "string"
            ? `${newIndent}/** ${value.jsdoc} */\n${newIndent}`
            : `${newIndent}/**\n${newIndent} * ${value.jsdoc.description}\n${Object.entries(
                value.jsdoc,
              )
                .filter(([key]) => key !== "description")
                .map(([key, val]) => `${newIndent} * @${key} ${val}`)
                .join("\n")}\n${newIndent} */\n${newIndent}`;
        return `${jsdocComment}${genObjectKey(k)}${optional}: ${value.type}`;
      }

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
  let jsdocComment = "";

  if (options.jsdoc && typeof options.jsdoc === "string") {
    jsdocComment = `/** ${options.jsdoc} */\n`;
  } else if (options.jsdoc && typeof options.jsdoc === "object") {
    jsdocComment = `/**\n * ${options.jsdoc.description}\n${Object.entries(
      options.jsdoc,
    )
      .filter(([key]) => key !== "description")
      .map(([key, val]) => ` * @${key} ${val}`)
      .join("\n")}\n */\n`;
  }

  const interfaceParts = [
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

  return `${jsdocComment}${interfaceParts}`;
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
 * Generate typescript function declaration from SpecificFunction.
 *
 * @group Typescript
 */
export function genFunction(
  options: SpecificFunction,
  _codegenOpts: CodegenOptions = {},
  indent = "",
): string {
  const {
    name,
    parameters = [],
    body = [],
    export: isExport,
    comment,
    async: isAsync,
    generator: isGenerator,
    returnType,
    generics = [],
  } = options;

  let jsdocComment = "";
  if (comment !== undefined) {
    const lines = Array.isArray(comment) ? comment : [comment];
    jsdocComment =
      `/**\n` + lines.map((line) => ` * ${line}`).join("\n") + "\n */\n";
  }

  const genericPart =
    generics.length > 0
      ? "<" +
        generics
          .map((g) => {
            let s = g.name;
            if (g.extends) s += ` extends ${g.extends}`;
            if (g.default) s += ` = ${g.default}`;
            return s;
          })
          .join(", ") +
        ">"
      : "";

  const paramsPart =
    "(" +
    parameters
      .map((p) => {
        let s = p.name;
        if (p.optional) s += "?";
        if (p.type) s += `: ${p.type}`;
        if (p.default !== undefined) s += ` = ${p.default}`;
        return s;
      })
      .join(", ") +
    ")";

  const returnPart = returnType ? `: ${returnType}` : "";
  const newIndent = indent + "  ";
  const bodyContent =
    body.length === 0
      ? "{}"
      : wrapInDelimiters(
          body.map((line) => newIndent + line),
          indent,
          "{}",
          false,
        );

  const prefix = [
    isExport && "export",
    isAsync && "async",
    isGenerator ? "function*" : "function",
    name + genericPart + paramsPart + returnPart,
  ]
    .filter(Boolean)
    .join(" ");

  return `${jsdocComment}${prefix} ${bodyContent}`;
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

/** Interfaces shape for declare namespace body (same as genAugmentation). */
export type DeclareNamespaceInterfaces = Record<
  string,
  TypeObject | [TypeObject, Omit<GenInterfaceOptions, "export">]
>;

/**
 * Generate typescript `declare <namespace>` block (e.g. `declare global {}`).
 *
 * @group Typescript
 */
export function genDeclareNamespace(
  namespace: string,
  interfaces?: DeclareNamespaceInterfaces,
): string {
  return `declare ${namespace} ${wrapInDelimiters(
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
