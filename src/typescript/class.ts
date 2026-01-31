import { genJSDocComment, wrapInDelimiters } from "../utils";
import { genBlock, genParam } from "./function";
import type {
  TypeField,
  TypeGeneric,
  GenClassOptions,
  GenConstructorOptions,
  GenClassPropertyOptions,
  GenClassMethodOptions,
  GenGetterOptions,
  GenSetterOptions,
} from "./types";

/**
 * Generate `class Name [extends Base] [implements I1, I2] { ... }`.
 *
 * @example
 *
 * ```js
 * genClass("Foo");
 * // ~> `class Foo {}`
 *
 * genClass("Bar", [genConstructor([], ["super();"])]);
 * // ~> `class Bar { constructor() { super(); } }`
 *
 * genClass("Baz", [], { extends: "Base", implements: ["I1", "I2"] });
 * // ~> `class Baz extends Base implements I1, I2 {}`
 *
 * genClass("Exported", [], { export: true });
 * // ~> `export class Exported {}`
 * ```
 *
 * @param name - class name
 * @param members - optional array of pre-rendered member snippets (constructor, properties, methods)
 * @param options - extends, implements, export, jsdoc
 * @param indent - base indent
 * @group Typescript
 */
export function genClass(
  name: string,
  members: string[] = [],
  options: GenClassOptions = {},
  indent = "",
): string {
  const jsdocComment =
    options.jsdoc === undefined ? "" : genJSDocComment(options.jsdoc);

  const extendsPart = options.extends ? ` extends ${options.extends}` : "";
  const implementsPart =
    options.implements === undefined
      ? ""
      : ` implements ${
          Array.isArray(options.implements)
            ? options.implements.join(", ")
            : options.implements
        }`;

  const head = [
    options.export && "export",
    "class",
    `${name}${extendsPart}${implementsPart}`,
  ]
    .filter(Boolean)
    .join(" ");

  if (members.length > 0) {
    const newIndent = indent + "  ";
    const lines = members.flatMap((m) =>
      m.split("\n").map((line) => newIndent + line),
    );
    const body = wrapInDelimiters(lines, indent, "{}", false);
    return `${jsdocComment}${indent}${head} ${body}`;
  }

  return `${jsdocComment}${indent}${head} {}`;
}

/**
 * Generate constructor(params) { [super(...);] ... }.
 *
 * @example
 *
 * ```js
 * genConstructor();
 * // ~> `constructor() {}`
 *
 * genConstructor([{ name: "x", type: "string" }], ["super();", "this.x = x;"]);
 * // ~> `constructor(x: string) { super(); this.x = x; }`
 *
 * genConstructor([{ name: "a", type: "number" }, { name: "b", type: "number" }], ["super(a, b);"]);
 * // ~> `constructor(a: number, b: number) { super(a, b); }`
 * ```
 *
 * @param parameters - constructor parameters
 * @param body - constructor body statements
 * @param options - super call args (e.g. "a, b"); omit for no super
 * @param indent - base indent
 * @group Typescript
 */
export function genConstructor(
  parameters: TypeField[] = [],
  body: string[] = [],
  options: GenConstructorOptions = {},
  indent = "",
): string {
  const paramsPart = "(" + parameters.map((p) => genParam(p)).join(", ") + ")";
  const prefix = `constructor${paramsPart}`;
  const statements =
    options.super === undefined ? body : [`super(${options.super});`, ...body];
  const block = genBlock(
    statements.length > 0 ? statements : undefined,
    indent,
  );
  return indent ? `${indent}${prefix} ${block}` : `${prefix} ${block}`;
}

/**
 * Generate class property: `name: Type` or `name = value` (with optional modifiers).
 *
 * @example
 *
 * ```js
 * genClassProperty("x", { type: "number" });
 * // ~> `x: number`
 *
 * genClassProperty("y", { value: "0" });
 * // ~> `y = 0`
 *
 * genClassProperty("z", { type: "string", value: "'z'" });
 * // ~> `z: string = 'z'`
 *
 * genClassProperty("id", { type: "string", readonly: true, static: true });
 * // ~> `static readonly id: string`
 * ```
 *
 * @param name - property name
 * @param options - type, value, static, readonly, public, private, protected, optional
 * @param indent - base indent
 * @group Typescript
 */
export function genClassProperty(
  name: string,
  options: GenClassPropertyOptions = {},
  indent = "",
): string {
  const {
    type,
    value,
    static: isStatic,
    readonly,
    public: isPublic,
    private: isPrivate,
    protected: isProtected,
    optional,
  } = options;

  const mods = [
    isStatic && "static",
    readonly && "readonly",
    isPublic && "public",
    isPrivate && "private",
    isProtected && "protected",
  ].filter(Boolean);

  const modPart = mods.length > 0 ? mods.join(" ") + " " : "";
  const opt = optional ? "?" : "";
  let decl: string;
  if (value === undefined) {
    decl = type ? `${name}${opt}: ${type}` : name + opt;
  } else {
    decl = type
      ? `${name}${opt}: ${type} = ${value}`
      : `${name}${opt} = ${value}`;
  }
  return `${indent}${modPart}${decl}`;
}

/**
 * Generate class method (including get/set) with optional async/generator.
 *
 * @example
 *
 * ```js
 * genClassMethod({ name: "foo" });
 * // ~> `foo() {}`
 *
 * genClassMethod({ name: "bar", parameters: [{ name: "x", type: "string" }], body: ["return x;"], returnType: "string" });
 * // ~> `bar(x: string): string { return x; }`
 *
 * genClassMethod({ name: "value", kind: "get", body: ["return this._v;"], returnType: "number" });
 * // ~> `get value(): number { return this._v; }`
 *
 * genClassMethod({ name: "value", kind: "set", parameters: [{ name: "v", type: "number" }], body: ["this._v = v;"] });
 * // ~> `set value(v: number) { this._v = v; }`
 * ```
 *
 * @param options - name, parameters, body, kind (method/get/set), static, async, generator, returnType, generics, jsdoc
 * @param indent - base indent
 * @group Typescript
 */
export function genClassMethod(
  options: GenClassMethodOptions & { name: string },
  indent = "",
): string {
  const {
    name,
    parameters = [],
    body = [],
    kind = "method",
    static: isStatic,
    async: isAsync,
    generator: isGenerator,
    returnType,
    generics = [],
    jsdoc,
  } = options;

  const jsdocComment = jsdoc === undefined ? "" : genJSDocComment(jsdoc);

  const genericPart =
    generics.length > 0
      ? "<" +
        generics
          .map((g: TypeGeneric) => {
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
  const bodyContent = genBlock(body.length > 0 ? body : undefined, indent);

  let prefix: string;
  if (kind === "get") {
    prefix = [isStatic && "static", "get", name + "()" + returnPart]
      .filter(Boolean)
      .join(" ");
  } else if (kind === "set") {
    prefix = [isStatic && "static", "set", name + paramsPart]
      .filter(Boolean)
      .join(" ");
  } else {
    const namePart =
      name + genericPart + (isGenerator ? "*" : "") + paramsPart + returnPart;
    prefix = [isStatic && "static", isAsync && "async", namePart]
      .filter(Boolean)
      .join(" ");
  }

  return `${jsdocComment}${indent}${prefix} ${bodyContent}`;
}

/**
 * Generate getter: `get name() { ... }` (for class or object literal).
 *
 * @example
 *
 * ```js
 * genGetter("value", ["return this._v;"]);
 * // ~> `get value() { return this._v; }`
 *
 * genGetter("id", ["return this._id;"], { returnType: "string" });
 * // ~> `get id(): string { return this._id; }`
 * ```
 *
 * @param name - getter name
 * @param body - getter body statements
 * @param options - returnType, jsdoc
 * @param indent - base indent
 * @group Typescript
 */
export function genGetter(
  name: string,
  body: string[] = [],
  options: GenGetterOptions = {},
  indent = "",
): string {
  const returnPart = options.returnType ? `: ${options.returnType}` : "";
  const jsdocComment =
    options.jsdoc === undefined ? "" : genJSDocComment(options.jsdoc);
  const block = genBlock(body.length > 0 ? body : undefined, indent);
  return `${jsdocComment}${indent}get ${name}()${returnPart} ${block}`;
}

/**
 * Generate setter: `set name(param) { ... }` (for class or object literal).
 *
 * @example
 *
 * ```js
 * genSetter("value", "v", ["this._v = v;"]);
 * // ~> `set value(v) { this._v = v; }`
 *
 * genSetter("id", "x", ["this._id = x;"], { paramType: "string" });
 * // ~> `set id(x: string) { this._id = x; }`
 * ```
 *
 * @param name - setter name
 * @param paramName - parameter name for the setter
 * @param body - setter body statements
 * @param options - paramType, jsdoc
 * @param indent - base indent
 * @group Typescript
 */
export function genSetter(
  name: string,
  paramName: string,
  body: string[] = [],
  options: GenSetterOptions = {},
  indent = "",
): string {
  const paramPart = options.paramType
    ? `${paramName}: ${options.paramType}`
    : paramName;
  const jsdocComment =
    options.jsdoc === undefined ? "" : genJSDocComment(options.jsdoc);
  const block = genBlock(body.length > 0 ? body : undefined, indent);
  return `${jsdocComment}${indent}set ${name}(${paramPart}) ${block}`;
}

