import { genJSDocComment, wrapInDelimiters } from "../utils";
import { genParam } from "./function";
import { genTypeObject, genProperty } from "./type-alias";
import type {
  GenInterfaceOptions,
  GenCallSignatureOptions,
  GenConstructSignatureOptions,
  TypeObject,
  TypeField,
} from "./types";

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
