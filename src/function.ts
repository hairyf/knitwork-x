import type {
  FunctionOpts,
  GenArrowFunctionOptions,
  TypeField,
  TypeGeneric,
} from './types'
import { genJSDocComment, wrapInDelimiters } from './utils'

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
  let s = p.name
  if (p.optional)
    s += '?'
  if (p.type)
    s += `: ${p.type}`
  if (p.default !== undefined)
    s += ` = ${p.default}`
  return s
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
export function genFunction(options: FunctionOpts, indent = ''): string {
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
  } = options

  const jsdocComment = jsdoc === undefined ? '' : genJSDocComment(jsdoc)

  const genericPart
    = generics.length > 0
      ? `<${
        generics
          .map((g) => {
            let s = g.name
            if (g.extends)
              s += ` extends ${g.extends}`
            if (g.default)
              s += ` = ${g.default}`
            return s
          })
          .join(', ')
      }>`
      : ''

  const paramsPart = `(${parameters.map(p => genParam(p)).join(', ')})`

  const returnPart = returnType ? `: ${returnType}` : ''
  const bodyContent = genBlock(body, indent)

  const prefix = [
    isExport && 'export',
    isAsync && 'async',
    isGenerator ? 'function*' : 'function',
    name + genericPart + paramsPart + returnPart,
  ]
    .filter(Boolean)
    .join(' ')

  return `${jsdocComment}${prefix} ${bodyContent}`
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
export function genBlock(statements?: string | string[], indent = ''): string {
  let arr: string[]
  if (statements === undefined) {
    arr = []
  }
  else {
    arr = Array.isArray(statements) ? statements : [statements]
  }
  const newIndent = `${indent}  `
  const lines
    = arr.length === 0
      ? []
      : arr.flatMap(s => s.split('\n').map(line => newIndent + line))
  return lines.length === 0
    ? '{}'
    : wrapInDelimiters(lines, indent, '{}', false)
}

/**
 * Generate arrow function: `(params) => body` or `(params) => { statements }`.
 *
 * @example
 *
 * ```js
 * genArrowFunction({ body: "x + 1" });
 * // ~> `() => x + 1`
 *
 * genArrowFunction({ parameters: [{ name: "x", type: "number" }], body: "x * 2" });
 * // ~> `(x: number) => x * 2`
 *
 * genArrowFunction({ parameters: [{ name: "x" }], body: ["return x + 1;"] });
 * // ~> `(x) => {\n  return x + 1;\n}`
 *
 * genArrowFunction({ parameters: [{ name: "x", type: "string" }], body: "x.length", returnType: "number" });
 * // ~> `(x: string): number => x.length`
 *
 * genArrowFunction({ async: true, parameters: [{ name: "url", type: "string" }], body: ["return fetch(url);"] });
 * // ~> `async (url: string) => {\n  return fetch(url);\n}`
 * ```
 *
 * @group Typescript
 */
export function genArrowFunction(
  options: GenArrowFunctionOptions = {},
): string {
  const {
    parameters = [],
    body,
    async: isAsync,
    returnType,
    generics = [],
  } = options

  const genericPart
    = generics.length > 0
      ? `<${
        generics
          .map((g: TypeGeneric) => {
            let s = g.name
            if (g.extends)
              s += ` extends ${g.extends}`
            if (g.default)
              s += ` = ${g.default}`
            return s
          })
          .join(', ')
      }>`
      : ''

  const paramsPart = `(${parameters.map(p => genParam(p)).join(', ')})`
  const returnPart = returnType ? `: ${returnType}` : ''

  let bodyPart: string
  if (body === undefined) {
    bodyPart = '{}'
  }
  else if (typeof body === 'string') {
    // Single expression: `=> expr`
    bodyPart = body
  }
  else {
    // Array of statements: `=> { statements }`
    bodyPart = genBlock(body)
  }

  const asyncPart = isAsync ? 'async ' : ''
  return `${asyncPart}${genericPart}${paramsPart}${returnPart} => ${bodyPart}`
}
