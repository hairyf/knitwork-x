import { _genStatement } from "./_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "./esm";
import { genString } from "./string";
import type { CodegenOptions } from "./types";
import type { JSDoc } from "./utils";
import { genJSDocComment, genObjectKey, wrapInDelimiters } from "./utils";

export interface TypeGeneric {
  name: string;
  extends?: string;
  default?: string;
}

export interface TypeField {
  /** parameter name */
  name: string;
  /** parameter type */
  type?: string;
  /** optional parameter */
  optional?: boolean;
  /** JSDoc for this field */
  jsdoc?: JSDoc;
  /** default value (code string) */
  default?: string;
}

export interface FunctionOpts {
  /** function name */
  name: string;
  /** function params */
  parameters?: TypeField[];
  /** function block (each string is one statement) */
  body?: string[];
  /** is export */
  export?: boolean;
  /** function JSDoc */
  jsdoc?: JSDoc;
  /** async function */
  async?: boolean;
  /** generator function */
  generator?: boolean;
  /** return type */
  returnType?: string;
  /** generics */
  generics?: TypeGeneric[];
}

export type TypeObjectWithJSDoc = {
  type: string;
  jsdoc: JSDoc;
};

export type TypeObject = {
  [key: string]: string | TypeObject | TypeObjectWithJSDoc;
};

/** Field descriptor for genTypeObject when called with an array. */
export interface TypeObjectField {
  /** property name */
  name: string;
  /** property type (default: "any") */
  type?: string;
  /** if false or omitted, property is optional (key?) */
  required?: boolean;
  /** JSDoc for this property */
  jsdoc?: JSDoc;
}

export interface GenInterfaceOptions {
  extends?: string | string[];
  export?: boolean;
  jsdoc?: JSDoc;
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
export interface GenTypeAliasOptions {
  /** Add `export` modifier. */
  export?: boolean;
}

/**
 * Create Type Alias
 *
 * @example
 *
 * ```js
 * genTypeAlias("Foo", "string");
 * // ~> `type Foo = string`
 *
 * genTypeAlias("Bar", "{ a: number; b: string }");
 * // ~> `type Bar = { a: number; b: string }`
 *
 * genTypeAlias("FooType", { name: "string", count: "number" });
 * // ~> `type FooType = { name: string, count: number }`
 *
 * genTypeAlias("Baz", "string", { export: true });
 * // ~> `export type Baz = string`
 * ```
 *
 * @param name - alias name
 * @param value - type value (right-hand side), string or object type shape
 * @group Typescript
 */
export function genTypeAlias(
  name: string,
  value: string | TypeObject,
  options: GenTypeAliasOptions = {},
  indent = "",
): string {
  const typeValue =
    typeof value === "string" ? value : genTypeObject(value, indent);
  const prefix = [options.export && "export", "type", name]
    .filter(Boolean)
    .join(" ");
  return `${prefix} = ${typeValue}`;
}

export interface GenVariableOptions {
  /** Add `export` modifier. */
  export?: boolean;
  /** Declaration kind: `const`, `let`, or `var`. Default `const`. */
  kind?: "const" | "let" | "var";
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

/**
 * Generate a typescript `export type` statement.
 *
 * @example
 *
 * ```js
 * genTypeExport("@nuxt/utils", ["test"]);
 * // ~> `export type { test } from "@nuxt/utils";`
 *
 * genTypeExport("@nuxt/utils", [{ name: "test", as: "value" }]);
 * // ~> `export type { test as value } from "@nuxt/utils";`
 * ```
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
 * @example
 *
 * ```js
 * genInlineTypeImport("@nuxt/utils");
 * // ~> `typeof import("@nuxt/utils").default`
 *
 * genInlineTypeImport("@nuxt/utils", "genString");
 * // ~> `typeof import("@nuxt/utils").genString`
 * ```
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
 * @example
 *
 * ```js
 * genTypeObject({ name: "string", count: "number" });
 * // ~> `{ name: string, count: number }`
 *
 * genTypeObject({ "key?": "boolean" });
 * // ~> `{ key?: boolean }`
 *
 * genTypeObject({ nested: { value: "string" } });
 * // ~> `{ nested: { value: string } }`
 *
 * genTypeObject([{ name: "name", type: "string" }, { name: "count", type: "number", required: true }]);
 * // ~> `{ name?: string, count: number }`
 *
 * genTypeObject([{ name: "id", type: "string", jsdoc: "Unique id" }]);
 * // ~> `{ /** Unique id *\/ id?: string }`
 * ```
 *
 * @group Typescript
 */
export function genTypeObject(
  object: TypeObject | TypeObjectField[],
  indent = "",
): string {
  const newIndent = indent + "  ";

  if (Array.isArray(object)) {
    const lines = object.map((item) => {
      const optional = item.required ? "" : "?";
      const type = item.type ?? "any";
      const jsdocComment =
        item.jsdoc === undefined
          ? ""
          : genJSDocComment(item.jsdoc, newIndent) + newIndent;
      const prefix = jsdocComment || newIndent;
      return `${prefix}${genObjectKey(item.name)}${optional}: ${type}`;
    });
    return wrapInDelimiters(lines, indent, "{}", false);
  }

  return wrapInDelimiters(
    Object.entries(object).map(([key, value]) => {
      const [, k = key, optional = ""] =
        key.match(/^(.*[^?])(\?)?$/) /* c8 ignore next */ || [];

      if (isTypeObjectWithJSDoc(value)) {
        const jsdocComment =
          genJSDocComment(value.jsdoc, newIndent) + newIndent;
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
 * Generate a single property signature from a TypeField.
 * Returns `[name][optional?]: [type]`. When `field.jsdoc` is set, prepends JSDoc comment.
 *
 * @example
 *
 * ```js
 * genProperty({ name: "foo", type: "string" });
 * // ~> `foo: string`
 *
 * genProperty({ name: "bar", type: "number", optional: true });
 * // ~> `bar?: number`
 *
 * genProperty({ name: "id", type: "string", jsdoc: "Unique id" }, "  ");
 * // ~> `/** Unique id *\/\n  id: string`
 * ```
 *
 * @group Typescript
 */
export function genProperty(field: TypeField, indent = ""): string {
  const prop = `${genObjectKey(field.name)}${field.optional ? "?" : ""}: ${field.type ?? "any"}`;
  if (field.jsdoc === undefined) {
    return indent ? `${indent}${prop}` : prop;
  }
  const jsdocComment = genJSDocComment(field.jsdoc, indent);
  return indent ? `${jsdocComment}${indent}${prop}` : `${jsdocComment}${prop}`;
}

/**
 * Generate typescript interface.
 *
 * @example
 *
 * ```js
 * genInterface("FooInterface");
 * // ~> `interface FooInterface {}`
 *
 * genInterface("FooInterface", { name: "string", count: "number" });
 * // ~> `interface FooInterface { name: string, count: number }`
 *
 * genInterface("FooInterface", undefined, { extends: "Other" });
 * // ~> `interface FooInterface extends Other {}`
 *
 * genInterface("FooInterface", {}, { export: true });
 * // ~> `export interface FooInterface {}`
 * ```
 *
 * @group Typescript
 */
export function genInterface(
  name: string,
  contents?: TypeObject | TypeField[],
  options: GenInterfaceOptions = {},
  indent = "",
): string {
  const jsdocComment =
    options.jsdoc === undefined ? "" : genJSDocComment(options.jsdoc);

  let body: string;
  if (contents === undefined) {
    body = "{}";
  } else if (Array.isArray(contents)) {
    const newIndent = indent + "  ";
    const lines = contents.map((f) => genProperty(f, newIndent));
    body = wrapInDelimiters(lines, indent, "{}", false);
  } else {
    body = genTypeObject(contents, indent);
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
    body,
  ]
    .filter(Boolean)
    .join(" ");

  return `${jsdocComment}${interfaceParts}`;
}

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

/**
 * Generate a single function parameter string from Field.
 *
 * @example
 *
 * ```js
 * genParam({ name: "x", type: "string" });
 * // ~> `x: string`
 *
 * genParam({ name: "y", type: "number", optional: true });
 * // ~> `y?: number`
 *
 * genParam({ name: "z", type: "number", default: "0" });
 * // ~> `z: number = 0`
 *
 * genParam({ name: "a" });
 * // ~> `a`
 * ```
 *
 * @group Typescript
 */
export function genParam(p: TypeField): string {
  let s = p.name;
  if (p.optional) s += "?";
  if (p.type) s += `: ${p.type}`;
  if (p.default !== undefined) s += ` = ${p.default}`;
  return s;
}

/**
 * Generate typescript function declaration from Function.
 *
 * @example
 *
 * ```js
 * genFunction({ name: "foo" });
 * // ~> `function foo() {}`
 *
 * genFunction({ name: "foo", parameters: [{ name: "x", type: "string" }, { name: "y", type: "number", optional: true }] });
 * // ~> `function foo(x: string, y?: number) {}`
 *
 * genFunction({ name: "id", generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T", body: ["return x;"] });
 * // ~> `function id<T>(x: T): T { return x; }`
 *
 * genFunction({ name: "foo", export: true });
 * // ~> `export function foo() {}`
 * ```
 *
 * @group Typescript
 */
export function genFunction(options: FunctionOpts, indent = ""): string {
  const {
    name,
    parameters = [],
    body = [],
    export: isExport,
    jsdoc,
    async: isAsync,
    generator: isGenerator,
    returnType,
    generics = [],
  } = options;

  const jsdocComment = jsdoc === undefined ? "" : genJSDocComment(jsdoc);

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

  const paramsPart = "(" + parameters.map((p) => genParam(p)).join(", ") + ")";

  const returnPart = returnType ? `: ${returnType}` : "";
  const bodyContent = genBlock(body, indent);

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
 * Generate a statement block `{ statements }`.
 *
 * @example
 *
 * ```js
 * genBlock();
 * // ~> `{}`
 *
 * genBlock([]);
 * // ~> `{}`
 *
 * genBlock("return x;");
 * // ~> `{\n  return x;\n}`
 *
 * genBlock(["return x;"]);
 * // ~> `{\n  return x;\n}`
 *
 * genBlock(["const a = 1;", "return a;"]);
 * // ~> `{\n  const a = 1;\n  return a;\n}`
 *
 * genBlock(["return x;"], "  ");
 * // ~> `{\n    return x;\n  }`
 * ```
 *
 * @group Typescript
 */
export function genBlock(statements?: string | string[], indent = ""): string {
  let arr: string[];
  if (statements === undefined) {
    arr = [];
  } else {
    arr = Array.isArray(statements) ? statements : [statements];
  }
  const newIndent = indent + "  ";
  const lines =
    arr.length === 0
      ? []
      : arr.flatMap((s) => s.split("\n").map((line) => newIndent + line));
  return lines.length === 0
    ? "{}"
    : wrapInDelimiters(lines, indent, "{}", false);
}

/**
 * Generate typescript `declare module` augmentation.
 *
 * @example
 *
 * ```js
 * genAugmentation("@nuxt/utils");
 * // ~> `declare module "@nuxt/utils" {}`
 *
 * genAugmentation("@nuxt/utils", "interface MyInterface {}");
 * // ~> `declare module "@nuxt/utils" { interface MyInterface {} }`
 *
 * genAugmentation("@nuxt/utils", [
 *   "interface MyInterface { test?: string }",
 *   "type MyType = string",
 * ]);
 * // ~> multi-line declare module with both interface and type
 * ```
 *
 * @group Typescript
 */
export function genAugmentation(
  specifier: string,
  statements?: string | string[],
): string {
  return `declare module ${genString(specifier)} ${genBlock(statements)}`;
}

/**
 * Generate typescript `declare <namespace>` block (e.g. `declare global {}`).
 *
 * @example
 *
 * ```js
 * genDeclareNamespace("global");
 * // ~> `declare global {}`
 *
 * genDeclareNamespace("global", "interface Window {}");
 * // ~> `declare global { interface Window {} }`
 *
 * genDeclareNamespace("global", [
 *   "interface Window { customProp?: string }",
 *   "const foo: string",
 * ]);
 * // ~> `declare global { interface Window {...} const foo: string }`
 * ```
 *
 * @group Typescript
 */
export function genDeclareNamespace(
  namespace: string,
  statements?: string | string[],
): string {
  return `declare ${namespace} ${genBlock(statements)}`;
}

export interface GenIfOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `if (cond) stmt`. Default true. */
  bracket?: boolean;
}

export interface GenElseOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `else stmt`. Default true. */
  bracket?: boolean;
}

interface GenPrefixedBlockOptions {
  bracket?: boolean;
}

function _genPrefixedBlock(
  prefix: string,
  statements: string | string[],
  options: GenPrefixedBlockOptions,
  indent: string,
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
  return _genPrefixedBlock(`if (${cond})`, statements, options, indent);
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
  return _genPrefixedBlock(`else if (${cond})`, statements, options, indent);
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
  return _genPrefixedBlock("else", statements, options, indent);
}

export interface GenTryOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `try stmt`. Default true. */
  bracket?: boolean;
}

export interface GenCatchOptions extends CodegenOptions {
  /** Optional catch binding (e.g. `e` for `catch (e) { }`). Omit for `catch { }`. */
  binding?: string;
  /** When false, emit single statement without braces: `catch (e) stmt`. Default true. */
  bracket?: boolean;
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
  return _genPrefixedBlock("try", statements, options, indent);
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
  return _genPrefixedBlock(prefix, statements, options, indent);
}
