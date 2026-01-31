# 🧶 knitwork-x

<!-- automd:badges color=yellow codecov -->

[![npm version](https://img.shields.io/npm/v/knitwork-x?color=yellow)](https://npmjs.com/package/knitwork-x)
[![npm downloads](https://img.shields.io/npm/dm/knitwork-x?color=yellow)](https://npm.chart.dev/knitwork-x)
[![codecov](https://img.shields.io/codecov/c/gh/hairyf/knitwork-x?color=yellow)](https://codecov.io/gh/hairyf/knitwork-x)

<!-- /automd -->

Utilities to generate JavaScript code.

forked from [knitwork](https://github.com/unjs/knitwork), and provide more comprehensive generation tools for typescript.

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install knitwork-x

# npm
npm install knitwork-x

# yarn
yarn add knitwork-x

# pnpm
pnpm add knitwork-x

# bun
bun install knitwork-x

# deno
deno install npm:knitwork-x
```

<!-- /automd -->

<!-- automd:jsimport cjs cdn -->

**ESM** (Node.js, Bun, Deno)

```js
import {} from "knitwork-x";
```

**CommonJS** (Legacy Node.js)

```js
const {} = require("knitwork-x");
```

**CDN** (Deno and Browsers)

```js
import {} from "https://esm.sh/knitwork-x";
```

<!-- /automd -->

<!-- TOC start (generated with https://github.com/derlin/bitdowntoc) -->

- [ESM](#esm)
  * [`genDefaultExport(value, _options)`](#gendefaultexportvalue-_options)
  * [`genDynamicImport(specifier, options)`](#gendynamicimportspecifier-options)
  * [`genExport(specifier, exports?, options)`](#genexportspecifier-exports-options)
  * [`genImport(specifier, imports?, options)`](#genimportspecifier-imports-options)

- [Serialization](#serialization)
  * [`genArray(array, indent, options)`](#genArrayarray-indent-options)
  * [`genMap(entries, indent, options)`](#genMapentries-indent-options)
  * [`genObject(object, indent, options)`](#genObjectobject-indent-options)
  * [`genSet(values, indent, options)`](#genSetvalues-indent-options)
- [String](#string)
  * [`escapeString(id)`](#escapestringid)
  * [`genString(input, options)`](#genstringinput-options)
  * [`genTemplateLiteral(parts)`](#gentemplateliteralparts)
- [Typescript](#typescript)
  * [`genArrowFunction(options)`](#genarrowfunctionoptions)
  * [`genAugmentation(specifier, statements?)`](#genaugmentationspecifier-statements)
  * [`genBlock(statements?, indent)`](#genblockstatements-indent)
  * [`genCallSignature(options)`](#gencallsignatureoptions)
  * [`genCase(value, statements?, indent)`](#gencasevalue-statements-indent)
  * [`genCatch(statements, options, indent)`](#gencatchstatements-options-indent)
  * [`genClass(name, members, options, indent)`](#genclassname-members-options-indent)
  * [`genProperty(field, indent)`](#genpropertyfield-indent)
  * [`genConditionalType(checkType, extendsType, trueType, falseType)`](#genconditionaltypechecktype-extendstype-truetype-falsetype)
  * [`genConstEnum(name, members, options, indent)`](#genconstenumname-members-options-indent)
  * [`genConstructor(parameters, body, options, indent)`](#genconstructorparameters-body-options-indent)
  * [`genConstructSignature(options)`](#genconstructsignatureoptions)
  * [`genDeclareNamespace(namespace, statements?)`](#gendeclarenamespacenamespace-statements)
  * [`genDecorator(name, args?, indent)`](#gendecoratorname-args-indent)
  * [`genDefault(statements?, indent)`](#gendefaultstatements-indent)
  * [`genDoWhile(statements, cond, options, indent)`](#gendowhilestatements-cond-options-indent)
  * [`genElse(statements, options, indent)`](#genelsestatements-options-indent)
  * [`genElseIf(cond, statements, options, indent)`](#genelseifcond-statements-options-indent)
  * [`genEnum(name, members, options, indent)`](#genenumname-members-options-indent)
  * [`genFinally(statements, options, indent)`](#genfinallystatements-options-indent)
  * [`genFor(init, test, update, statements, options, indent)`](#genforinit-test-update-statements-options-indent)
  * [`genForIn(left, obj, statements, options, indent)`](#genforinleft-obj-statements-options-indent)
  * [`genForOf(left, iterable, statements, options, indent)`](#genforofleft-iterable-statements-options-indent)
  * [`genFunction(options, indent)`](#genfunctionoptions-indent)
  * [`genGetter(name, body, options, indent)`](#gengettername-body-options-indent)
  * [`genIf(cond, statements, options, indent)`](#genifcond-statements-options-indent)
  * [`genIndexSignature(keyType, valueType, keyName)`](#genindexsignaturekeytype-valuetype-keyname)
  * [`genInlineTypeImport(specifier, name, options)`](#geninlinetypeimportspecifier-name-options)
  * [`genInterface(name, contents?, options, indent)`](#geninterfacename-contents-options-indent)
  * [`genIntersection(types)`](#genintersectiontypes)
  * [`genKeyOf(type)`](#genkeyoftype)
  * [`genMappedType(keyName, keyType, valueType)`](#genmappedtypekeyname-keytype-valuetype)
  * [`genMethod(options, indent)`](#genmethodoptions-indent)
  * [`genModule(specifier, statements?)`](#genmodulespecifier-statements)
  * [`genNamespace(name, statements?)`](#gennamespacename-statements)
  * [`genParam(p)`](#genparamp)
  * [`genPrefixedBlock(prefix, statements, options, indent)`](#genprefixedblockprefix-statements-options-indent)
  * [`genReturn(expr?, indent)`](#genreturnexpr-indent)
  * [`genSatisfies(expr, type)`](#gensatisfiesexpr-type)
  * [`genSetter(name, paramName, body, options, indent)`](#gensettername-paramname-body-options-indent)
  * [`genSwitch(expr, cases, options, indent)`](#genswitchexpr-cases-options-indent)
  * [`genTemplateLiteralType(parts)`](#gentemplateliteraltypeparts)
  * [`genTernary(cond, whenTrue, whenFalse)`](#genternarycond-whentrue-whenfalse)
  * [`genThrow(expr, indent)`](#genthrowexpr-indent)
  * [`genTry(statements, options, indent)`](#gentrystatements-options-indent)
  * [`genTypeAlias(name, value, options, indent)`](#gentypealiasname-value-options-indent)
  * [`genTypeAssertion(expr, type)`](#gentypeassertionexpr-type)
  * [`genTypeExport(specifier, imports, options)`](#gentypeexportspecifier-imports-options)
  * [`genTypeObject(object, indent)`](#gentypeobjectobject-indent)
  * [`genTypeof(expr)`](#gentypeofexpr)
  * [`genUnion(types)`](#genuniontypes)
  * [`genVariable(name, value, options)`](#genvariablename-value-options)
  * [`genVariableName(name)`](#genVariableNamename)
  * [`genWhile(cond, statements, options, indent)`](#genwhilecond-statements-options-indent)
- [Utils](#utils)
  * [`genComment(text, options: { block? }, indent)`](#gencommenttext-options--block--indent)
  * [`genJSDocComment(jsdoc, indent)`](#genJSDocCommentjsdoc-indent)
  * [`genKey(key)`](#genKeykey)
  * [`genLiteral(fields, indent, _options)`](#genLiteralfields-indent-_options)
  * [`genRegExp(pattern, flags?)`](#genregexppattern-flags)
  * [`wrapInDelimiters(lines, indent, delimiters, withComma)`](#wrapindelimiterslines-indent-delimiters-withcomma)

<!-- TOC end -->

<!-- automd:jsdocs src=./src/index.ts -->

## ESM

### `genDefaultExport(value, _options)`

Generate an ESM `export default` statement.

**Example:**

```js
genDefaultExport("foo");
// ~> `export default foo;`

genDefaultExport("42", { singleQuotes: true });
// ~> `export default 42;`
```

### `genDynamicImport(specifier, options)`

Generate an ESM dynamic `import()` statement.

**Example:**

```js
genDynamicImport("pkg");
// ~> `import("pkg")`

genDynamicImport("pkg", { wrapper: true });
// ~> `() => import("pkg")`

genDynamicImport("pkg", { interopDefault: true });
// ~> `() => import("pkg").then(m => m.default || m)`

genDynamicImport("pkg", { type: true });
// ~> `typeof import("pkg")`

genDynamicImport("pkg", { type: true, name: "foo" });
// ~> `typeof import("pkg").foo`
```

### `genExport(specifier, exports?, options)`

Generate an ESM `export` statement.

**Example:**

```js
genExport("pkg", "foo");
// ~> `export foo from "pkg";`

genExport("pkg", ["a", "b"]);
// ~> `export { a, b } from "pkg";`

genExport("pkg", "*");
// ~> `export * from "pkg";`

genExport("pkg", { name: "*", as: "bar" });
// ~> `export * as bar from "pkg";`
```

### `genImport(specifier, imports?, options)`

Generate an ESM `import` statement.

**Example:**

```js
genImport("pkg", "foo");
// ~> `import foo from "pkg";`

genImport("pkg", ["foo"]);
// ~> `import { foo } from "pkg";`

genImport("pkg", ["a", "b"]);
// ~> `import { a, b } from "pkg`;

genImport("pkg", [{ name: "default", as: "bar" }]);
// ~> `import { default as bar } from "pkg`;

genImport("pkg", [{ name: "foo", as: "bar" }]);
// ~> `import { foo as bar } from "pkg`;

genImport("pkg", "foo", { attributes: { type: "json" } });
// ~> `import foo from "pkg" with { type: "json" };

genImport("@nuxt/utils", ["test"], { type: true });
// ~> `import type { test } from "@nuxt/utils";`
```

## Serialization

### `genArray(array, indent, options)`

Serialize an array to a string.

Values are not escaped or quoted.

**Example:**

```js
genArray([1, 2, 3])
// ~> `[1, 2, 3]`
```

### `genMap(entries, indent, options)`

Serialize a Map to a string from raw entries.

Values are escaped and quoted if necessary (strings, etc.).

**Example:**

```js
genMap([["foo", "bar"], ["baz", 1]]);
// ~> `new Map([["foo", "bar"], ["baz", 1]])`
```

### `genObject(object, indent, options)`

Serialize an object to a string.

Values are not escaped or quoted.

**Example:**

```js
genObject({ foo: "bar", test: '() => import("pkg")' })
// ~> `{ foo: bar, test: () => import("pkg") }`
```

### `genSet(values, indent, options)`

Serialize a Set to a string from raw values.

Values are escaped and quoted if necessary (strings, etc.).

**Example:**

```js
genSet(["foo", "bar", 1]);
// ~> `new Set(["foo", "bar", 1])`
```

## String

### `escapeString(id)`

Escape a string for use in a javascript string.

**Example:**

```js
escapeString("foo'bar");
// ~> `foo\'bar`

escapeString("foo\nbar");
// ~> `foo\nbar`
```

### `genString(input, options)`

Generate a string with double or single quotes and handle escapes.

**Example:**

```js
genString("foo");
// ~> `"foo"`

genString("foo", { singleQuotes: true });
// ~> `'foo'`

genString("foo\nbar");
// ~> `"foo\nbar"`
```

### `genTemplateLiteral(parts)`

Generate runtime template literal: `` `hello ${x}` `` (value, not type).

**Example:**

```js
genTemplateLiteral(["hello ", "x"]);
// ~> `` `hello ${x}` ``

genTemplateLiteral(["prefix", "expr", "suffix"]);
// ~> `` `prefix${expr}suffix` ``

genTemplateLiteral(["", "value"]);
// ~> `` `${value}` ``

genTemplateLiteral(["text"]);
// ~> `` `text` ``
```

## Typescript

### `genArrowFunction(options)`

Generate arrow function: `(params) => body` or `(params) => { statements }`.

**Example:**

```js
genArrowFunction({ body: "x + 1" });
// ~> `() => x + 1`

genArrowFunction({ parameters: [{ name: "x", type: "number" }], body: "x * 2" });
// ~> `(x: number) => x * 2`

genArrowFunction({ parameters: [{ name: "x" }], body: ["return x + 1;"] });
// ~> `(x) => {\n  return x + 1;\n}`

genArrowFunction({ parameters: [{ name: "x", type: "string" }], body: "x.length", returnType: "number" });
// ~> `(x: string): number => x.length`

genArrowFunction({ async: true, parameters: [{ name: "url", type: "string" }], body: ["return fetch(url);"] });
// ~> `async (url: string) => {\n  return fetch(url);\n}`
```

### `genAugmentation(specifier, statements?)`

Generate typescript `declare module` augmentation.

**Example:**

```js
genAugmentation("@nuxt/utils");
// ~> `declare module "@nuxt/utils" {}`

genAugmentation("@nuxt/utils", "interface MyInterface {}");
// ~> `declare module "@nuxt/utils" { interface MyInterface {} }`

genAugmentation("@nuxt/utils", [
  "interface MyInterface { test?: string }",
  "type MyType = string",
]);
// ~> multi-line declare module with both interface and type
```

### `genBlock(statements?, indent)`

Generate a statement block `{ statements }`.

**Example:**

```js
genBlock();
// ~> `{}`

genBlock([]);
// ~> `{}`

genBlock("return x;");
// ~> `{\n  return x;\n}`

genBlock(["return x;"]);
// ~> `{\n  return x;\n}`

genBlock(["const a = 1;", "return a;"]);
// ~> `{\n  const a = 1;\n  return a;\n}`

genBlock(["return x;"], "  ");
// ~> `{\n    return x;\n  }`
```

### `genCallSignature(options)`

Generate call signature for interfaces.

**Example:**

```js
genCallSignature({ parameters: [{ name: "x", type: "string" }], returnType: "number" });
// ~> `(x: string): number`

genCallSignature({ parameters: [{ name: "a", type: "number" }, { name: "b", type: "number", optional: true }], returnType: "void" });
// ~> `(a: number, b?: number): void`

genCallSignature({ generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T" });
// ~> `<T>(x: T): T`
```

### `genCase(value, statements?, indent)`

Generate `case value:` optionally followed by indented statements (fall-through when omitted).

**Example:**

```js
genCase("1", "break;");
// ~> `case 1:\n  break;`

genCase("'a'", ["doA();", "break;"]);
// ~> `case 'a':\n  doA();\n  break;`

genCase("0");
// ~> `case 0:` (fall-through)
```

### `genCatch(statements, options, indent)`

Generate `catch (binding) { statements }`, `catch { statements }`, or single-statement form.

**Example:**

```js
genCatch(["throw e;"], { binding: "e" });
// ~> `catch (e) { throw e; }`

genCatch(["logError();"]);
// ~> `catch { logError(); }`

genCatch("handle(e);", { binding: "e", bracket: false });
// ~> `catch (e) handle(e);`
```

### `genClass(name, members, options, indent)`

Generate `class Name [extends Base] [implements I1, I2] { ... }`.

**Example:**

```js
genClass("Foo");
// ~> `class Foo {}`

genClass("Bar", [genConstructor([], ["super();"])]);
// ~> `class Bar { constructor() { super(); } }`

genClass("Baz", [], { extends: "Base", implements: ["I1", "I2"] });
// ~> `class Baz extends Base implements I1, I2 {}`

genClass("Exported", [], { export: true });
// ~> `export class Exported {}`
```

### `genProperty(field, indent)`

Generate a single property signature from a TypeField (class/interface property). Returns `[modifiers?][name][optional?]: [type][ = value]?`. When `field.jsdoc` is set, prepends JSDoc comment. Supports static, readonly, public, private, protected and value (initializer).

**Example:**

```js
genProperty({ name: "foo", type: "string" });
// ~> `foo: string`

genProperty({ name: "bar", type: "number", optional: true });
// ~> `bar?: number`

genProperty({ name: "id", type: "string", jsdoc: "Unique id" }, "  ");
// ~> `/** Unique id *\/\n  id: string`

genProperty({ name: "x", value: "0" });
// ~> `x = 0`

genProperty({ name: "id", type: "string", readonly: true, static: true });
// ~> `static readonly id: string`
```

### `genConditionalType(checkType, extendsType, trueType, falseType)`

Generate conditional type.

**Example:**

```js
genConditionalType("T", "U", "X", "Y");
// ~> `T extends U ? X : Y`

genConditionalType("T", "null", "never", "T");
// ~> `T extends null ? never : T`
```

### `genConstEnum(name, members, options, indent)`

Generate typescript const enum (shorthand for `genEnum` with `const: true`).

**Example:**

```js
genConstEnum("Direction", { Up: 1, Down: 2 });
// ~> `const enum Direction { Up = 1, Down = 2 }`

genConstEnum("Mode", { Read: 0, Write: 1 }, { export: true });
// ~> `export const enum Mode { Read = 0, Write = 1 }`
```

### `genConstructor(parameters, body, options, indent)`

Generate constructor(params) { [super(...);] ... }.

**Example:**

```js
genConstructor();
// ~> `constructor() {}`

genConstructor([{ name: "x", type: "string" }], ["super();", "this.x = x;"]);
// ~> `constructor(x: string) { super(); this.x = x; }`

genConstructor([{ name: "a", type: "number" }, { name: "b", type: "number" }], ["super(a, b);"]);
// ~> `constructor(a: number, b: number) { super(a, b); }`
```

### `genConstructSignature(options)`

Generate construct signature for interfaces.

**Example:**

```js
genConstructSignature({ parameters: [{ name: "x", type: "string" }], returnType: "MyClass" });
// ~> `new (x: string): MyClass`

genConstructSignature({ parameters: [{ name: "value", type: "number" }], returnType: "Instance" });
// ~> `new (value: number): Instance`

genConstructSignature({ generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T" });
// ~> `new <T>(x: T): T`
```

### `genDeclareNamespace(namespace, statements?)`

Generate typescript `declare <namespace>` block (e.g. `declare global {}`).

**Example:**

```js
genDeclareNamespace("global");
// ~> `declare global {}`

genDeclareNamespace("global", "interface Window {}");
// ~> `declare global { interface Window {} }`

genDeclareNamespace("global", [
  "interface Window { customProp?: string }",
  "const foo: string",
]);
// ~> `declare global { interface Window {...} const foo: string }`
```

### `genDecorator(name, args?, indent)`

Generate decorator: `@decorator` or `@decorator(args)`.

**Example:**

```js
genDecorator("Component");
// ~> `@Component`

genDecorator("Injectable", "()");
// ~> `@Injectable()`

genDecorator("Route", '("/api")');
// ~> `@Route("/api")`

genDecorator("Validate", "(min: 0, max: 100)");
// ~> `@Validate(min: 0, max: 100)`
```

### `genDefault(statements?, indent)`

Generate `default:` optionally followed by indented statements.

**Example:**

```js
genDefault("return 0;");
// ~> `default:\n  return 0;`

genDefault(["log('default');", "break;"]);
// ~> `default:\n  log('default');\n  break;`

genDefault();
// ~> `default:` (fall-through)
```

### `genDoWhile(statements, cond, options, indent)`

Generate `do { body } while (cond);` or single-statement form.

**Example:**

```js
genDoWhile("step();", "!done");
// ~> `do { step(); } while (!done);`

genDoWhile(["read();", "check();"], "eof");
// ~> `do { read(); check(); } while (eof);`

genDoWhile("next();", "hasMore", { bracket: false });
// ~> `do next(); while (hasMore);`
```

### `genElse(statements, options, indent)`

Generate `else { statements }` or `else statement`.

**Example:**

```js
genElse(["return 0;"]);
// ~> `else { return 0; }`

genElse("fallback();");
// ~> `else { fallback(); }`

genElse("doIt();", { bracket: false });
// ~> `else doIt();`
```

### `genElseIf(cond, statements, options, indent)`

Generate `else if (cond) { statements }` or `else if (cond) statement`.

**Example:**

```js
genElseIf("x < 0", "return -x;");
// ~> `else if (x < 0) { return -x; }`

genElseIf("ok", "doIt();", { bracket: false });
// ~> `else if (ok) doIt();`
```

### `genEnum(name, members, options, indent)`

Generate typescript enum or const enum.

**Example:**

```js
genEnum("Color", { Red: 0, Green: 1, Blue: 2 });
// ~> `enum Color { Red = 0, Green = 1, Blue = 2 }`

genEnum("Status", { Active: "active", Inactive: "inactive" });
// ~> `enum Status { Active = "active", Inactive = "inactive" }`

genEnum("Auto", { A: undefined, B: undefined, C: undefined });
// ~> `enum Auto { A = 0, B = 1, C = 2 }`

genEnum("MyEnum", { Foo: 1 }, { export: true, const: true });
// ~> `export const enum MyEnum { Foo = 1 }`
```

### `genFinally(statements, options, indent)`

Generate `finally { statements }` or `finally statement`.

**Example:**

```js
genFinally("cleanup();");
// ~> `finally { cleanup(); }`

genFinally(["release();", "log('done');"]);
// ~> `finally { release(); log('done'); }`

genFinally("cleanup();", { bracket: false });
// ~> `finally cleanup();`
```

### `genFor(init, test, update, statements, options, indent)`

Generate C-style `for (init; test; update) { body }` or single-statement form.

**Example:**

```js
genFor("let i = 0", "i < n", "i++", "console.log(i);");
// ~> `for (let i = 0; i < n; i++) { console.log(i); }`

genFor("", "true", "", ["doWork();", "if (done) break;"]);
// ~> `for (; true; ) { doWork(); if (done) break; }`

genFor("i = 0", "i < 10", "i++", "sum += i;", { bracket: false });
// ~> `for (i = 0; i < 10; i++) sum += i;`
```

### `genForIn(left, obj, statements, options, indent)`

Generate `for (left in obj) { body }` or single-statement form.

**Example:**

```js
genForIn("const key", "obj", "console.log(key, obj[key]);");
// ~> `for (const key in obj) { console.log(key, obj[key]); }`

genForIn("const k", "o", ["sum += o[k];"]);
// ~> `for (const k in o) { sum += o[k]; }`

genForIn("let p", "obj", "visit(p);", { bracket: false });
// ~> `for (let p in obj) visit(p);`
```

### `genForOf(left, iterable, statements, options, indent)`

Generate `for (left of iterable) { body }` or single-statement form.

**Example:**

```js
genForOf("const x", "items", "console.log(x);");
// ~> `for (const x of items) { console.log(x); }`

genForOf("let [k, v]", "Object.entries(obj)", ["process(k, v);"]);
// ~> `for (let [k, v] of Object.entries(obj)) { process(k, v); }`

genForOf("const item", "list", "yield item;", { bracket: false });
// ~> `for (const item of list) yield item;`
```

### `genFunction(options, indent)`

Generate typescript function declaration from Function.

**Example:**

```js
genFunction({ name: "foo" });
// ~> `function foo() {}`

genFunction({ name: "foo", parameters: [{ name: "x", type: "string" }, { name: "y", type: "number", optional: true }] });
// ~> `function foo(x: string, y?: number) {}`

genFunction({ name: "id", generics: [{ name: "T" }], parameters: [{ name: "x", type: "T" }], returnType: "T", body: ["return x;"] });
// ~> `function id<T>(x: T): T { return x; }`

genFunction({ name: "foo", export: true });
// ~> `export function foo() {}`
```

### `genGetter(name, body, options, indent)`

Generate getter: `get name() { ... }` (for class or object literal).

**Example:**

```js
genGetter("value", ["return this._v;"]);
// ~> `get value() { return this._v; }`

genGetter("id", ["return this._id;"], { returnType: "string" });
// ~> `get id(): string { return this._id; }`
```

### `genIf(cond, statements, options, indent)`

Generate `if (cond) { statements }` or `if (cond) statement`.

**Example:**

```js
genIf("x > 0", "return x;");
// ~> `if (x > 0) { return x; }`

genIf("ok", ["doA();", "doB();"]);
// ~> `if (ok) { doA(); doB(); }`

genIf("x", "console.log(x);", { bracket: false });
// ~> `if (x) console.log(x);`
```

### `genIndexSignature(keyType, valueType, keyName)`

Generate index signature.

**Example:**

```js
genIndexSignature("string", "number");
// ~> `[key: string]: number`

genIndexSignature("number", "string");
// ~> `[key: number]: string`

genIndexSignature("key", "string", "any");
// ~> `[key: string]: any`
```

### `genInlineTypeImport(specifier, name, options)`

Generate an typescript `typeof import()` statement for default import.

**Example:**

```js
genInlineTypeImport("@nuxt/utils");
// ~> `typeof import("@nuxt/utils").default`

genInlineTypeImport("@nuxt/utils", "genString");
// ~> `typeof import("@nuxt/utils").genString`
```

### `genInterface(name, contents?, options, indent)`

Generate typescript interface.

**Example:**

```js
genInterface("FooInterface");
// ~> `interface FooInterface {}`

genInterface("FooInterface", { name: "string", count: "number" });
// ~> `interface FooInterface { name: string, count: number }`

genInterface("FooInterface", undefined, { extends: "Other" });
// ~> `interface FooInterface extends Other {}`

genInterface("FooInterface", {}, { export: true });
// ~> `export interface FooInterface {}`
```

### `genIntersection(types)`

Generate intersection type.

**Example:**

```js
genIntersection(["A", "B"]);
// ~> `A & B`

genIntersection(["A", "B", "C"]);
// ~> `A & B & C`

genIntersection("string");
// ~> `string`
```

### `genKeyOf(type)`

Generate keyof type.

**Example:**

```js
genKeyOf("T");
// ~> `keyof T`

genKeyOf("MyObject");
// ~> `keyof MyObject`
```

### `genMappedType(keyName, keyType, valueType)`

Generate mapped type.

**Example:**

```js
genMappedType("K", "keyof T", "U");
// ~> `{ [K in keyof T]: U }`

genMappedType("P", "keyof T", "T[P]");
// ~> `{ [P in keyof T]: T[P] }`
```

### `genMethod(options, indent)`

Generate method for class or object literal: `name(params) { body }`, or with `kind: "get"`/`"set"` for getter/setter. Supports async, generator, static.

**Example:**

```js
genMethod({ name: "foo" });
// ~> `foo() {}`

genMethod({ name: "bar", parameters: [{ name: "x", type: "string" }], body: ["return x;"], returnType: "string" });
// ~> `bar(x: string): string { return x; }`

genMethod({ name: "value", kind: "get", body: ["return this._v;"], returnType: "number" });
// ~> `get value(): number { return this._v; }`

genMethod({ name: "value", kind: "set", parameters: [{ name: "v", type: "number" }], body: ["this._v = v;"] });
// ~> `set value(v: number) { this._v = v; }`

genMethod({ name: "fetch", async: true, parameters: [{ name: "url", type: "string" }], body: ["return await fetch(url);"] });
// ~> `async fetch(url: string) { return await fetch(url); }`
```

### `genModule(specifier, statements?)`

Generate typescript `declare module` block.

This is an alias for `genAugmentation` for consistency with TypeScript terminology.

**Example:**

```js
genModule("@nuxt/utils");
// ~> `declare module "@nuxt/utils" {}`

genModule("@nuxt/utils", "interface MyInterface {}");
// ~> `declare module "@nuxt/utils" { interface MyInterface {} }`
```

### `genNamespace(name, statements?)`

Generate typescript `namespace` block (non-declare; TS namespace).

**Example:**

```js
genNamespace("MyNamespace");
// ~> `namespace MyNamespace {}`

genNamespace("MyNamespace", "interface MyInterface {}");
// ~> `namespace MyNamespace { interface MyInterface {} }`

genNamespace("MyNamespace", [
  "interface MyInterface { test?: string }",
  "const foo: string",
]);
// ~> `namespace MyNamespace { interface MyInterface {...} const foo: string }`
```

### `genParam(p)`

Generate a single function parameter string from Field.

**Example:**

```js
genParam({ name: "x", type: "string" });
// ~> `x: string`

genParam({ name: "y", type: "number", optional: true });
// ~> `y?: number`

genParam({ name: "z", type: "number", default: "0" });
// ~> `z: number = 0`

genParam({ name: "a" });
// ~> `a`
```

### `genPrefixedBlock(prefix, statements, options, indent)`

Low-level helper: generate `prefix { statements }` or `prefix statement`.

**Example:**

```js
genPrefixedBlock("if (ok)", "return true;");
// ~> `if (ok) { return true; }`

genPrefixedBlock("while (running)", ["step();", "check();"]);
// ~> `while (running) { step(); check(); }`

genPrefixedBlock("for (;;)", "break;", { bracket: false });
// ~> `for (;;) break;`
```

### `genReturn(expr?, indent)`

Generate `return expr;` or `return;`.

**Example:**

```js
genReturn("x");
// ~> `return x;`

genReturn();
// ~> `return;`

genReturn("a + b");
// ~> `return a + b;`
```

### `genSatisfies(expr, type)`

Generate satisfies expression: `expr satisfies Type` (TS 4.9+).

**Example:**

```js
genSatisfies("{ a: 1 }", "{ a: number }");
// ~> `{ a: 1 } satisfies { a: number }`

genSatisfies("config", "ConfigType");
// ~> `config satisfies ConfigType`
```

### `genSetter(name, paramName, body, options, indent)`

Generate setter: `set name(param) { ... }` (for class or object literal).

**Example:**

```js
genSetter("value", "v", ["this._v = v;"]);
// ~> `set value(v) { this._v = v; }`

genSetter("id", "x", ["this._id = x;"], { paramType: "string" });
// ~> `set id(x: string) { this._id = x; }`
```

### `genSwitch(expr, cases, options, indent)`

Generate `switch (expr) { cases }`.

**Example:**

```js
genSwitch("x", [genCase("1", "break;"), genDefault("return 0;")]);
// ~> `switch (x) {\n  case 1:\n    break;\n  default:\n    return 0;\n}`

genSwitch("key", []);
// ~> `switch (key) {}`

genSwitch("n", [genCase("0"), genCase("1", "return 1;")]);
// ~> switch with fall-through case 0
```

### `genTemplateLiteralType(parts)`

Generate template literal type.

**Example:**

```js
genTemplateLiteralType(["prefix", "T", "suffix"]);
// ~> `` `prefix${T}suffix` ``

genTemplateLiteralType(["Hello ", "T", ""]);
// ~> `` `Hello ${T}` ``

genTemplateLiteralType(["", "K", "Key"]);
// ~> `` `${K}Key` ``

genTemplateLiteralType(["prefix", "T1", "middle", "T2", "suffix"]);
// ~> `` `prefix${T1}middle${T2}suffix` ``
```

### `genTernary(cond, whenTrue, whenFalse)`

Generate ternary expression `cond ? whenTrue : whenFalse`.

**Example:**

```js
genTernary("x > 0", "x", "-x");
// ~> `x > 0 ? x : -x`

genTernary("ok", "'yes'", "'no'");
// ~> `ok ? 'yes' : 'no'`
```

### `genThrow(expr, indent)`

Generate `throw expr;`.

**Example:**

```js
genThrow("new Error('failed')");
// ~> `throw new Error('failed');`

genThrow("e");
// ~> `throw e;`
```

### `genTry(statements, options, indent)`

Generate `try { statements }` or `try statement`.

**Example:**

```js
genTry("mightThrow();");
// ~> `try { mightThrow(); }`

genTry(["const x = await f();", "return x;"]);
// ~> `try { const x = await f(); return x; }`

genTry("f();", { bracket: false });
// ~> `try f();`
```

### `genTypeAlias(name, value, options, indent)`

Create Type Alias

**Example:**

```js
genTypeAlias("Foo", "string");
// ~> `type Foo = string`

genTypeAlias("Bar", "{ a: number; b: string }");
// ~> `type Bar = { a: number; b: string }`

genTypeAlias("FooType", { name: "string", count: "number" });
// ~> `type FooType = { name: string, count: number }`

genTypeAlias("Baz", "string", { export: true });
// ~> `export type Baz = string`

genTypeAlias("Id", "T", { generics: [{ name: "T" }] });
// ~> `type Id<T> = T`

genTypeAlias("Nullable", "T | null", { generics: [{ name: "T" }] });
// ~> `type Nullable<T> = T | null`
```

### `genTypeAssertion(expr, type)`

Generate type assertion: `expr as Type`.

**Example:**

```js
genTypeAssertion("value", "string");
// ~> `value as string`

genTypeAssertion("obj", "MyType");
// ~> `obj as MyType`
```

### `genTypeExport(specifier, imports, options)`

Generate a typescript `export type` statement.

**Example:**

```js
genTypeExport("@nuxt/utils", ["test"]);
// ~> `export type { test } from "@nuxt/utils";`

genTypeExport("@nuxt/utils", [{ name: "test", as: "value" }]);
// ~> `export type { test as value } from "@nuxt/utils";`
```

### `genTypeObject(object, indent)`

Generate typescript object type.

**Example:**

```js
genTypeObject({ name: "string", count: "number" });
// ~> `{ name: string, count: number }`

genTypeObject({ "key?": "boolean" });
// ~> `{ key?: boolean }`

genTypeObject({ nested: { value: "string" } });
// ~> `{ nested: { value: string } }`

genTypeObject([{ name: "name", type: "string" }, { name: "count", type: "number", required: true }]);
// ~> `{ name?: string, count: number }`

genTypeObject([{ name: "id", type: "string", jsdoc: "Unique id" }]);
// ~> `{ /** Unique id *\/ id?: string }`
```

### `genTypeof(expr)`

Generate typeof type.

**Example:**

```js
genTypeof("someVar");
// ~> `typeof someVar`

genTypeof("myFunction");
// ~> `typeof myFunction`
```

### `genUnion(types)`

Generate union type.

**Example:**

```js
genUnion(["string", "number"]);
// ~> `string | number`

genUnion(["A", "B", "C"]);
// ~> `A | B | C`

genUnion("string");
// ~> `string`
```

### `genVariable(name, value, options)`

Create variable declaration.

**Example:**

```js
genVariable("a", "2");
// ~> `const a = 2`

genVariable("foo", "'bar'");
// ~> `const foo = 'bar'`

genVariable("x", "1", { kind: "let" });
// ~> `let x = 1`

genVariable("y", "2", { export: true });
// ~> `export const y = 2`
```

### `genVariableName(name)`

Generate a safe javascript variable name.

**Example:**

```js
genVariableName("valid_import");
// ~> `valid_import`

genVariableName("for");
// ~> `_for`

genVariableName("with space");
// ~> `with_32space`
```

### `genWhile(cond, statements, options, indent)`

Generate `while (cond) { body }` or single-statement form.

**Example:**

```js
genWhile("running", "step();");
// ~> `while (running) { step(); }`

genWhile("i > 0", ["process();", "i--;"]);
// ~> `while (i > 0) { process(); i--; }`

genWhile("ok", "doIt();", { bracket: false });
// ~> `while (ok) doIt();`
```

## Utils

### `genLiteral(fields, indent, _options)`

Create object literal from field descriptors.

**Example:**

```js
genLiteral(['type', ['type', 'A'], ['...', 'b']])
// ~> `{ type, type: A, ...b }`
```

### `genComment(text, options: { block? }, indent)`

Generate comment: single-line `//` or block comment (non-JSDoc).

**Example:**

```js
genComment("Single line comment");
// ~> `// Single line comment`

genComment("Multi-line\ncomment", { block: true });
// ~> block comment format

genComment("Block comment", { block: true });
// ~> block comment format

genComment("Indented", "  ");
// ~> `  // Indented`
```

### `genJSDocComment(jsdoc, indent)`

Generate a JSDoc block comment from lines or a JSDoc object (typed interface).

**Example:**

```js
genJSDocComment("Single line");
// ~> block comment with one line

genJSDocComment(["Line one", "@param x - number", "@returns void"]);
// ~> multi-line block with those lines

genJSDocComment({ description: "Fn", param: { x: "number" }, returns: "void" });
// ~> block with description, @param {number} x, @returns {void}

genJSDocComment("Indented", "  ");
// ~> same block, each line prefixed with indent
```

### `genKey(key)`

Generate a safe javascript variable name for an object key.

**Example:**

```js
genKey("foo");
// ~> `foo`

genKey("foo-bar");
// ~> `"foo-bar"`

genKey("with space");
// ~> `"with space"`
```

### `genRegExp(pattern, flags?)`

Generate regex literal from pattern and flags.

**Example:**

```js
genRegExp("foo");
// ~> `/foo/`

genRegExp("foo", "gi");
// ~> `/foo/gi`

genRegExp("foo\\d+");
// ~> `/foo\d+/`
```

### `wrapInDelimiters(lines, indent, delimiters, withComma)`

Wrap an array of strings in delimiters.

<!-- /automd -->

## Contribution

<details>
  <summary>Local development</summary>

- Clone this repository
- Install the latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `bun install`
- Run tests using `bun dev`

</details>

## License

<!-- automd:contributors license=MIT author="pi0,danielroe" -->

Published under the [MIT](https://github.com/hairyf/knitwork-x/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0), [@danielroe](https://github.com/danielroe) and [community](https://github.com/hairyf/knitwork-x/graphs/contributors) 💛
<br><br>
<a href="https://github.com/hairyf/knitwork-x/graphs/contributors">
<img src="https://contrib.rocks/image?repo=hairyf/knitwork-x" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
