import type { CodegenOptions, Field, GenGetterOptions, GenMethodOptions, GenSetterOptions, TypeGeneric } from './types'

import { genBlock, genParam } from './function'
import { genJSDocComment, genKey, wrapInDelimiters } from './utils'

export interface GenObjectOptions extends CodegenOptions {
  preserveTypes?: boolean
}

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
 *
 * genObject([{ name: "foo", value: "bar" }, { name: "test", value: '() => import("pkg")' }])
 * // ~> `{ foo: bar, test: () => import("pkg") }`
 *
 * genObject([{ name: "count", value: "0", jsdoc: "Counter value" }])
 * // ~> `{ /** Counter value *\/ count: 0 }`
 * ```
 *
 * @group serialization
 */
export function genObject(
  object: Record<string, any> | Field[],
  indent = '',
  options: GenObjectOptions = {},
): string {
  const newIdent = `${indent}  `

  if (Array.isArray(object)) {
    const lines = object.map((item) => {
      const jsdocComment
        = item.jsdoc === undefined
          ? ''
          : genJSDocComment(item.jsdoc, newIdent) + newIdent
      const prefix = jsdocComment || newIdent
      return `${prefix}${genKey(item.name)}: ${item.value}`
    })
    return wrapInDelimiters(lines, indent, '{}')
  }

  return wrapInDelimiters(
    Object.entries(object).map(
      ([key, value]) =>
        `${newIdent}${genKey(key)}: ${genRawValue(value, newIdent, options)}`,
    ),
    indent,
    '{}',
  )
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
  indent = '',
  options: GenObjectOptions = {},
) {
  const newIdent = `${indent}  `
  return wrapInDelimiters(
    array.map(index => `${newIdent}${genRawValue(index, newIdent, options)}`),
    indent,
    '[]',
  )
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
  indent = '',
  options: GenObjectOptions = {},
): string {
  const opts = { preserveTypes: true, ...options }
  if (entries.length === 0) {
    return 'new Map([])'
  }
  // For simple cases, use single-line format
  const entriesString = entries.map(
    ([key, value]) =>
      `[${genRawValue(key, '', opts)}, ${genRawValue(value, '', opts)}]`,
  )
  // Check if all entries are simple (single line each)
  const allSimple = entriesString.every(s => !s.includes('\n'))
  if (allSimple) {
    return `new Map([${entriesString.join(', ')}])`
  }
  // Multi-line format for complex entries
  const newIndent = `${indent}  `
  const multiLineEntries = entries.map(
    ([key, value]) =>
      `[${genRawValue(key, newIndent, opts)}, ${genRawValue(value, newIndent, opts)}]`,
  )
  const entriesArray = wrapInDelimiters(multiLineEntries, indent, '[]')
  return `new Map(${entriesArray})`
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
  indent = '',
  options: GenObjectOptions = {},
): string {
  const opts = { preserveTypes: true, ...options }
  if (values.length === 0) {
    return 'new Set([])'
  }
  // For simple cases, use single-line format
  const valuesString = values.map(value => genRawValue(value, '', opts))
  // Check if all values are simple (single line each)
  const allSimple = valuesString.every(s => !s.includes('\n'))
  if (allSimple) {
    return `new Set([${valuesString.join(', ')}])`
  }
  // Multi-line format for complex values
  const newIndent = `${indent}  `
  const multiLineValues = values.map(value =>
    genRawValue(value, newIndent, opts),
  )
  const valuesArray = wrapInDelimiters(multiLineValues, indent, '[]')
  return `new Set(${valuesArray})`
}

/**
 * Generate method (including get/set) with optional async/generator/static.
 * For class or object literal: `name(params) { body }`, `get name() { }`, `set name(v) { }`.
 *
 * @example
 *
 * ```js
 * genMethod({ name: "foo" });
 * // ~> `foo() {}`
 *
 * genMethod({ name: "bar", parameters: [{ name: "x", type: "string" }], body: ["return x;"], returnType: "string" });
 * // ~> `bar(x: string): string { return x; }`
 *
 * genMethod({ name: "value", kind: "get", body: ["return this._v;"], returnType: "number" });
 * // ~> `get value(): number { return this._v; }`
 *
 * genMethod({ name: "value", kind: "set", parameters: [{ name: "v", type: "number" }], body: ["this._v = v;"] });
 * // ~> `set value(v: number) { this._v = v; }`
 * ```
 *
 * @param options - name, parameters, body, kind (method/get/set), static, async, generator, returnType, generics, jsdoc
 * @param indent - base indent
 * @group Typescript
 */
export function genMethod(options: GenMethodOptions, indent = ''): string {
  const {
    name,
    parameters = [],
    body = [],
    kind = 'method',
    static: isStatic,
    async: isAsync,
    generator: isGenerator,
    returnType,
    generics = [],
    jsdoc,
  } = options

  const jsdocComment = jsdoc === undefined ? '' : genJSDocComment(jsdoc)

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
  const bodyContent = genBlock(body.length > 0 ? body : undefined, indent)

  let prefix: string
  if (kind === 'get') {
    prefix = [isStatic && 'static', 'get', `${name}()${returnPart}`]
      .filter(Boolean)
      .join(' ')
  }
  else if (kind === 'set') {
    prefix = [isStatic && 'static', 'set', name + paramsPart]
      .filter(Boolean)
      .join(' ')
  }
  else {
    const namePart
      = name + genericPart + (isGenerator ? '*' : '') + paramsPart + returnPart
    prefix = [isStatic && 'static', isAsync && 'async', namePart]
      .filter(Boolean)
      .join(' ')
  }

  return `${jsdocComment}${indent}${prefix} ${bodyContent}`
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
  indent = '',
): string {
  const returnPart = options.returnType ? `: ${options.returnType}` : ''
  const jsdocComment
    = options.jsdoc === undefined ? '' : genJSDocComment(options.jsdoc)
  const block = genBlock(body.length > 0 ? body : undefined, indent)
  return `${jsdocComment}${indent}get ${name}()${returnPart} ${block}`
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
  indent = '',
): string {
  const paramPart = options.paramType
    ? `${paramName}: ${options.paramType}`
    : paramName
  const jsdocComment
    = options.jsdoc === undefined ? '' : genJSDocComment(options.jsdoc)
  const block = genBlock(body.length > 0 ? body : undefined, indent)
  return `${jsdocComment}${indent}set ${name}(${paramPart}) ${block}`
}

// --- Internals ---

function genRawValue(
  value: unknown,
  indent = '',
  options: GenObjectOptions = {},
): string {
  if (value === undefined) {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return genArray(value, indent, options)
  }
  if (value && typeof value === 'object') {
    return genObject(value, indent, options)
  }
  if (options.preserveTypes && typeof value !== 'function') {
    return JSON.stringify(value)
  }
  return value.toString()
}
