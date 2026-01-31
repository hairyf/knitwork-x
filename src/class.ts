import { genJSDocComment, genKey, wrapInDelimiters } from "./utils";
import { genBlock, genParam } from "./function";
import type {
  TypeField,
  GenClassOptions,
  GenConstructorOptions,
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
 * Generate a single property signature from a TypeField.
 * Returns `[modifiers?][name][optional?]: [type][ = value]?`. When `field.jsdoc` is set, prepends JSDoc comment.
 * Supports static, readonly, public, private, protected (class property) and value (initializer).
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
 *
 * genProperty({ name: "x", value: "0" });
 * // ~> `x = 0`
 *
 * genProperty({ name: "id", type: "string", readonly: true, static: true });
 * // ~> `static readonly id: string`
 * ```
 *
 * @param field - property field (name, type, optional, value, modifiers, jsdoc)
 * @param indent - base indent
 * @group Typescript
 */
export function genProperty(field: TypeField, indent = ""): string {
  const mods = [
    field.static && "static",
    field.readonly && "readonly",
    field.public && "public",
    field.private && "private",
    field.protected && "protected",
  ].filter(Boolean);
  const modPart = mods.length > 0 ? mods.join(" ") + " " : "";
  const key = genKey(field.name);
  const opt = field.optional ? "?" : "";
  let decl: string;
  if (field.value === undefined) {
    decl = field.type ? `${key}${opt}: ${field.type}` : key + opt;
  } else {
    decl = field.type
      ? `${key}${opt}: ${field.type} = ${field.value}`
      : `${key}${opt} = ${field.value}`;
  }
  const propLine = modPart + decl;
  if (field.jsdoc === undefined) {
    return indent ? `${indent}${propLine}` : propLine;
  }
  const jsdocComment = genJSDocComment(field.jsdoc, indent);
  return indent
    ? `${jsdocComment}${indent}${propLine}`
    : `${jsdocComment}${propLine}`;
}
