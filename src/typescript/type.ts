import { _genStatement } from "../_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "../esm";
import { genJSDocComment, genObjectKey, wrapInDelimiters } from "../utils";
import type {
  GenInterfaceOptions,
  GenTypeAliasOptions,
  GenVariableOptions,
  TypeObject,
  TypeObjectField,
  TypeObjectWithJSDoc,
  TypeField,
} from "./types";

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
