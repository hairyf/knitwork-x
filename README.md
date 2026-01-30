# 🧶 knitwork

<!-- automd:badges color=yellow codecov -->

[![npm version](https://img.shields.io/npm/v/knitwork?color=yellow)](https://npmjs.com/package/knitwork)
[![npm downloads](https://img.shields.io/npm/dm/knitwork?color=yellow)](https://npm.chart.dev/knitwork)
[![codecov](https://img.shields.io/codecov/c/gh/unjs/knitwork?color=yellow)](https://codecov.io/gh/unjs/knitwork)

<!-- /automd -->

Utilities to generate JavaScript code.

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install knitwork

# npm
npm install knitwork

# yarn
yarn add knitwork

# pnpm
pnpm add knitwork

# bun
bun install knitwork

# deno
deno install npm:knitwork
```

<!-- /automd -->

<!-- automd:jsimport cjs cdn -->

**ESM** (Node.js, Bun, Deno)

```js
import {} from "knitwork";
```

**CommonJS** (Legacy Node.js)

```js
const {} = require("knitwork");
```

**CDN** (Deno and Browsers)

```js
import {} from "https://esm.sh/knitwork";
```

<!-- /automd -->

<!-- automd:jsdocs src=./src/index.ts -->

## ESM

### `genDynamicImport(specifier, options)`

Generate an ESM dynamic `import()` statement.

**Example:**

```js
genDynamicImport("pkg");
// ~> `() => import("pkg")`

genDynamicImport("pkg", { wrapper: false });
// ~> `import("pkg")`

genDynamicImport("pkg", { interopDefault: true });
// ~> `() => import("pkg").then(m => m.default || m)`
```

### `genDynamicTypeImport(specifier, name, options)`

Generate an ESM type `import()` statement.

**Example:**

```js
genDynamicTypeImport("pkg");
// ~> `typeof import("pkg")`

genDynamicTypeImport("pkg", "foo");
// ~> `typeof import("pkg").foo`

genDynamicTypeImport("pkg", "foo-bar");
// ~> `typeof import("pkg")["foo-bar"]`
```

### `genExport(specifier, exports?, options)`

Generate an ESM `export` statement.

**Example:**

```js
genExport("pkg", "foo");
// ~> `export foo from "pkg";`

genExport("pkg", ["a", "b"]);
// ~> `export { a, b } from "pkg";`

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
```

### `genTypeImport(specifier, imports, options)`

Generate an ESM `import type` statement.

**Example:**

```js
genTypeImport("@nuxt/utils", ["test"]);
// ~> `import type { test } from "@nuxt/utils";`

genTypeImport("@nuxt/utils", [{ name: "test", as: "value" }]);
// ~> `import type { test as value } from "@nuxt/utils";`
```

## Serialization

### `genArrayFromRaw(array, indent, options)`

Serialize an array to a string.

Values are not escaped or quoted.

**Example:**

```js
genArrayFromRaw([1, 2, 3])
// ~> `[1, 2, 3]`
```

### `genObjectFromRaw(object, indent, options)`

Serialize an object to a string.

Values are not escaped or quoted.

**Example:**

```js
genObjectFromRaw({ foo: "bar", test: '() => import("pkg")' })
// ~> `{ foo: bar, test: () => import("pkg") }`
```

### `genObjectFromRawEntries(array, indent, options)`

Serialize an array of key-value pairs to a string.

Values are not escaped or quoted.

**Example:**

```js
genObjectFromRawEntries([["foo", "bar"], ["baz", 1]]);
// ~> `{ foo: bar, baz: 1 }`
```

### `genObjectFromValues(obj, indent, options)`

Serialize an object to a string.

Values are escaped and quoted if necessary.

**Example:**

```js
genObjectFromValues({ foo: "bar" })
// ~> `{ foo: "bar" }`
```

### `genObjectLiteral(fields, indent, _options)`

Create object literal from field descriptors.

**Example:**

```js
genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])
// ~> `{ type, type: A, ...b }`
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

### `genSafeVariableName(name)`

Generate a safe javascript variable name.

**Example:**

```js
genSafeVariableName("valid_import");
// ~> `valid_import`

genSafeVariableName("for");
// ~> `_for`

genSafeVariableName("with space");
// ~> `with_32space`
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

## Typescript

### `genAugmentation(specifier, statements?)`

Generate typescript `declare module` augmentation.

**Example:**

```js
genAugmentation("@nuxt/utils");
// ~> `declare module "@nuxt/utils" {}`

genAugmentation("@nuxt/utils", genInterface("MyInterface", {}));
// ~> `declare module "@nuxt/utils" { interface MyInterface {} }`

genAugmentation("@nuxt/utils", [
  genInterface("MyInterface", { "test?": "string" }),
  "type MyType = string",
]);
// ~> declare module with multiple statements (interface + type)
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

### `genDeclareNamespace(namespace, statements?)`

Generate typescript `declare <namespace>` block (e.g. `declare global {}`).

**Example:**

```js
genDeclareNamespace("global");
// ~> `declare global {}`

genDeclareNamespace("global", genInterface("Window", {}));
// ~> `declare global { interface Window {} }`

genDeclareNamespace("global", [
  genInterface("Window", { "customProp?": "string" }),
  genVariable("foo", "string"),
]);
// ~> declare global with multiple statements (interface + const)
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

### `genFunction(options, _codegenOpts, indent)`

Generate typescript function declaration from SpecificFunction.

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

### `genTypeAlias(name, value, options, indent)`

Create Type Alias. `value` can be a string or an object type shape (same as `genInterface`).

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

Generate typescript object type. Accepts either a `TypeObject` (record) or `TypeObjectField[]` (array of field descriptors).

**TypeObjectField:** `{ name: string; type?: string; required?: boolean; jsdoc?: string | string[] }`

**Example:**

```js
genTypeObject({ name: "string", count: "number" });
// ~> `{ name: string, count: number }`

genTypeObject({ "key?": "boolean" });
// ~> `{ key?: boolean }`

genTypeObject({ nested: { value: "string" } });
// ~> `{ nested: { value: string } }`

genTypeObject([
  { name: "name", type: "string" },
  { name: "count", type: "number", required: true },
]);
// ~> `{ name?: string, count: number }`

genTypeObject([{ name: "id", type: "string", jsdoc: "Unique id" }]);
// ~> `{ /** Unique id */ id?: string }`
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

## Utils

### `genObjectKey(key)`

Generate a safe javascript variable name for an object key.

**Example:**

```js
genObjectKey("foo");
// ~> `foo`

genObjectKey("foo-bar");
// ~> `"foo-bar"`

genObjectKey("with space");
// ~> `"with space"`
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

Published under the [MIT](https://github.com/unjs/knitwork/blob/main/LICENSE) license.
Made by [@pi0](https://github.com/pi0), [@danielroe](https://github.com/danielroe) and [community](https://github.com/unjs/knitwork/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/knitwork/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/knitwork" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
