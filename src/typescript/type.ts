import { _genStatement } from "../_utils";
import { ESMCodeGenOptions, ESMImport, genDynamicImport } from "../esm";
import { genJSDocComment, genObjectKey, wrapInDelimiters } from "../utils";
import { genParam } from "./function";
import type {
  GenInterfaceOptions,
  GenTypeAliasOptions,
  GenVariableOptions,
  TypeObject,
  TypeObjectField,
  TypeObjectWithJSDoc,
  TypeField,
  GenCallSignatureOptions,
  GenConstructSignatureOptions,
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

/**
 * Generate union type.
 *
 * @example
 *
 * ```js
 * genUnion(["string", "number"]);
 * // ~> `string | number`
 *
 * genUnion(["A", "B", "C"]);
 * // ~> `A | B | C`
 *
 * genUnion("string");
 * // ~> `string`
 * ```
 *
 * @param types - array of type strings or single type string
 * @group Typescript
 */
export function genUnion(types: string | string[]): string {
  const typeArray = Array.isArray(types) ? types : [types];
  if (typeArray.length === 0) {
    return "never";
  }
  if (typeArray.length === 1) {
    return typeArray[0]!;
  }
  return typeArray.join(" | ");
}

/**
 * Generate intersection type.
 *
 * @example
 *
 * ```js
 * genIntersection(["A", "B"]);
 * // ~> `A & B`
 *
 * genIntersection(["A", "B", "C"]);
 * // ~> `A & B & C`
 *
 * genIntersection("string");
 * // ~> `string`
 * ```
 *
 * @param types - array of type strings or single type string
 * @group Typescript
 */
export function genIntersection(types: string | string[]): string {
  const typeArray = Array.isArray(types) ? types : [types];
  if (typeArray.length === 0) {
    return "never";
  }
  if (typeArray.length === 1) {
    return typeArray[0]!;
  }
  return typeArray.join(" & ");
}

/**
 * Generate mapped type.
 *
 * @example
 *
 * ```js
 * genMappedType("K", "keyof T", "U");
 * // ~> `{ [K in keyof T]: U }`
 *
 * genMappedType("P", "keyof T", "T[P]");
 * // ~> `{ [P in keyof T]: T[P] }`
 * ```
 *
 * @param keyName - key variable name (e.g. "K", "P")
 * @param keyType - key type constraint (e.g. "keyof T", "string")
 * @param valueType - value type expression
 * @group Typescript
 */
export function genMappedType(
  keyName: string,
  keyType: string,
  valueType: string,
): string {
  return `{ [${keyName} in ${keyType}]: ${valueType} }`;
}

/**
 * Generate conditional type.
 *
 * @example
 *
 * ```js
 * genConditionalType("T", "U", "X", "Y");
 * // ~> `T extends U ? X : Y`
 *
 * genConditionalType("T", "null", "never", "T");
 * // ~> `T extends null ? never : T`
 * ```
 *
 * @param checkType - type to check (e.g. "T")
 * @param extendsType - type to extend (e.g. "U")
 * @param trueType - type when condition is true (e.g. "X")
 * @param falseType - type when condition is false (e.g. "Y")
 * @group Typescript
 */
export function genConditionalType(
  checkType: string,
  extendsType: string,
  trueType: string,
  falseType: string,
): string {
  return `${checkType} extends ${extendsType} ? ${trueType} : ${falseType}`;
}

/**
 * Generate index signature.
 *
 * @example
 *
 * ```js
 * genIndexSignature("string", "number");
 * // ~> `[key: string]: number`
 *
 * genIndexSignature("number", "string");
 * // ~> `[key: number]: string`
 *
 * genIndexSignature("key", "string", "any");
 * // ~> `[key: string]: any`
 * ```
 *
 * @param keyName - index key name (default: "key")
 * @param keyType - index key type (e.g. "string", "number")
 * @param valueType - value type
 * @group Typescript
 */
export function genIndexSignature(
  keyType: string,
  valueType: string,
  keyName = "key",
): string {
  return `[${keyName}: ${keyType}]: ${valueType}`;
}

/**
 * Generate call signature for interfaces.
 *
 * @example
 *
 * ```js
 * genCallSignature({ parameters: [{ name: "x", type: "string" }], returnType: "number" });
 * // ~> `(x: string): number`
 *
 * genCallSignature({ parameters: [{ name: "a", type: "number" }, { name: "b", type: "number", optional: true }], returnType: "void" });
 * // ~> `(a: number, b?: number): void`
 *
 * genCallSignature({ generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T" });
 * // ~> `<T>(x: T): T`
 * ```
 *
 * @group Typescript
 */
export function genCallSignature(
  options: GenCallSignatureOptions = {},
): string {
  const { parameters = [], returnType, generics = [] } = options;

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

  return `${genericPart}${paramsPart}${returnPart}`;
}

/**
 * Generate construct signature for interfaces.
 *
 * @example
 *
 * ```js
 * genConstructSignature({ parameters: [{ name: "x", type: "string" }], returnType: "MyClass" });
 * // ~> `new (x: string): MyClass`
 *
 * genConstructSignature({ parameters: [{ name: "value", type: "number" }], returnType: "Instance" });
 * // ~> `new (value: number): Instance`
 *
 * genConstructSignature({ generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T" });
 * // ~> `new <T>(x: T): T`
 * ```
 *
 * @group Typescript
 */
export function genConstructSignature(
  options: GenConstructSignatureOptions = {},
): string {
  const { parameters = [], returnType, generics = [] } = options;

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

  return `new ${genericPart}${paramsPart}${returnPart}`;
}

/**
 * Generate template literal type.
 *
 * @example
 *
 * ```js
 * genTemplateLiteralType(["prefix", "T", "suffix"]);
 * // ~> `` `prefix${T}suffix` ``
 *
 * genTemplateLiteralType(["Hello ", "T", ""]);
 * // ~> `` `Hello ${T}` ``
 *
 * genTemplateLiteralType(["", "K", "Key"]);
 * // ~> `` `${K}Key` ``
 *
 * genTemplateLiteralType(["prefix", "T1", "middle", "T2", "suffix"]);
 * // ~> `` `prefix${T1}middle${T2}suffix` ``
 * ```
 *
 * @param parts - array of parts: even indices are string literals, odd indices are type expressions
 * @group Typescript
 */
export function genTemplateLiteralType(parts: string[]): string {
  if (parts.length === 0) {
    return "``";
  }
  let result = "`";
  for (const [i, part] of parts.entries()) {
    result += i % 2 === 0 ? part : `\${${part}}`;
  }
  result += "`";
  return result;
}

/**
 * Generate keyof type.
 *
 * @example
 *
 * ```js
 * genKeyOf("T");
 * // ~> `keyof T`
 *
 * genKeyOf("MyObject");
 * // ~> `keyof MyObject`
 * ```
 *
 * @param type - type name
 * @group Typescript
 */
export function genKeyOf(type: string): string {
  return `keyof ${type}`;
}

/**
 * Generate typeof type.
 *
 * @example
 *
 * ```js
 * genTypeof("someVar");
 * // ~> `typeof someVar`
 *
 * genTypeof("myFunction");
 * // ~> `typeof myFunction`
 * ```
 *
 * @param expr - expression (variable name or expression)
 * @group Typescript
 */
export function genTypeof(expr: string): string {
  return `typeof ${expr}`;
}

/**
 * Generate type assertion: `expr as Type`.
 *
 * @example
 *
 * ```js
 * genTypeAssertion("value", "string");
 * // ~> `value as string`
 *
 * genTypeAssertion("obj", "MyType");
 * // ~> `obj as MyType`
 * ```
 *
 * @param expr - expression to assert
 * @param type - target type
 * @group Typescript
 */
export function genTypeAssertion(expr: string, type: string): string {
  return `${expr} as ${type}`;
}

/**
 * Generate satisfies expression: `expr satisfies Type` (TS 4.9+).
 *
 * @example
 *
 * ```js
 * genSatisfies("{ a: 1 }", "{ a: number }");
 * // ~> `{ a: 1 } satisfies { a: number }`
 *
 * genSatisfies("config", "ConfigType");
 * // ~> `config satisfies ConfigType`
 * ```
 *
 * @param expr - expression to check
 * @param type - type to satisfy
 * @group Typescript
 */
export function genSatisfies(expr: string, type: string): string {
  return `${expr} satisfies ${type}`;
}
