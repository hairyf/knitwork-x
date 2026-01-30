import { expect, describe, it } from "vitest";
import {
  genInterface,
  genAugmentation,
  genBlock,
  genDeclareNamespace,
  genEnum,
  genConstEnum,
  genFunction,
  genParam,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
  genTypeAlias,
  genTypeObject,
  genVariable,
  genIf,
  genElseIf,
  genElse,
  type GenElseOptions,
} from "../src";
import { genTestTitle } from "./_utils";
const genInterfaceTests: Array<{
  input: Parameters<typeof genInterface>;
  code: string;
}> = [
  { input: ["FooInterface"], code: "interface FooInterface {}" },
  {
    input: ["FooInterface", undefined, { extends: ["Other"] }],
    code: "interface FooInterface extends Other {}",
  },
  {
    input: ["FooInterface", undefined, { extends: "Other" }],
    code: "interface FooInterface extends Other {}",
  },
  {
    input: [
      "FooInterface",
      { name: "boolean", 'other name"': { value: "() => {}" } },
    ],
    code: `interface FooInterface {
  name: boolean
  "other name\\"": {
    value: () => {}
  }
}`,
  },
  {
    input: ["FooInterface", { "na'me?": "boolean" }],
    code: `interface FooInterface {
  "na'me"?: boolean
}`,
  },
  {
    input: ["FooInterface", {}, { jsdoc: "Simple description" }],
    code: `/** Simple description */
interface FooInterface {}`,
  },
  {
    input: [
      "FooInterface",
      {},
      {
        jsdoc: ["Complex description", "@param someParam", "@returns void"],
      },
    ],
    code: `/**
 * Complex description
 * @param someParam
 * @returns void
 */
interface FooInterface {}`,
  },
  {
    input: [
      "FooInterface",
      {
        prop: {
          type: "string",
          jsdoc: "Property description",
        },
      },
    ],
    code: `interface FooInterface {
  /** Property description */
  prop: string
}`,
  },
  {
    input: [
      "FooInterface",
      {
        prop: {
          type: "string",
          jsdoc: {
            description: "Complex prop",
            default: "''",
            deprecated: "use newProp instead",
          },
        },
      },
    ],
    code: `interface FooInterface {
  /**
   * Complex prop
   * @default ''
   * @deprecated use newProp instead
   */
  prop: string
}`,
  },
  {
    input: [
      "FooInterface",
      {
        nested: {
          subProp: {
            type: "boolean",
            jsdoc: "Nested property",
          },
        },
      },
    ],
    code: `interface FooInterface {
  nested: {
    /** Nested property */
    subProp: boolean
  }
}`,
  },
  {
    input: [
      "FooInterface",
      {
        nested: {
          subProp: {
            type: "boolean",
            jsdoc: "Nested property",
          },
        },
      },
      {
        export: true,
      },
    ],
    code: `export interface FooInterface {
  nested: {
    /** Nested property */
    subProp: boolean
  }
}`,
  },
  {
    input: [
      "FooInterface",
      {
        nested: {
          subProp: {
            type: "boolean",
            jsdoc: "Nested property",
          },
        },
      },
      {
        export: true,
        jsdoc: ["Complex description", "@param someParam", "@returns void"],
      },
    ],
    code: `/**
 * Complex description
 * @param someParam
 * @returns void
 */
export interface FooInterface {
  nested: {
    /** Nested property */
    subProp: boolean
  }
}`,
  },
  {
    input: [
      "FooInterface",
      [
        { name: "foo", type: "string" },
        { name: "bar", type: "number", optional: true },
      ],
    ],
    code: `interface FooInterface {
  foo: string
  bar?: number
}`,
  },
  {
    input: [
      "FooInterface",
      [{ name: "id", type: "string", jsdoc: "Unique id" }],
    ],
    code: `interface FooInterface {
  /** Unique id */
  id: string
}`,
  },
];

describe("genInterface", () => {
  for (const t of genInterfaceTests) {
    it(genTestTitle(t.code), () => {
      const code = genInterface(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
const genAugmentationTests: Array<{
  input: Parameters<typeof genAugmentation>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ["@nuxt/utils", genInterface("MyInterface", {})],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
  {
    input: [
      "@nuxt/utils",
      [genInterface("MyInterface", {}), genInterface("MyOtherInterface", {})],
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: ["@nuxt/utils", genInterface("MyInterface", { "test?": "string" })],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
}`,
  },
  {
    input: [
      "@nuxt/utils",
      genInterface(
        "MyInterface",
        {},
        { extends: ["OtherInterface", "FurtherInterface"] },
      ),
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
}`,
  },
  {
    input: ["@nuxt/utils", ["interface Foo {}", "type Bar = string"]],
    code: `declare module "@nuxt/utils" {
  interface Foo {}
  type Bar = string
}`,
  },
];

describe("genAugmentation", () => {
  for (const t of genAugmentationTests) {
    it(genTestTitle(t.code), () => {
      const code = genAugmentation(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genDeclareNamespaceTests: Array<{
  input: Parameters<typeof genDeclareNamespace>;
  code: string;
}> = [
  { input: ["global"], code: "declare global {}" },
  {
    input: ["global", genInterface("Window", {})],
    code: `declare global {
  interface Window {}
}`,
  },
  {
    input: [
      "global",
      [genInterface("Window", {}), genInterface("Document", {})],
    ],
    code: `declare global {
  interface Window {}
  interface Document {}
}`,
  },
  {
    input: ["global", genInterface("Window", { "customProp?": "string" })],
    code: `declare global {
  interface Window {
    customProp?: string
  }
}`,
  },
  {
    input: ["global", genInterface("Window", {}, { extends: ["SomeMixin"] })],
    code: `declare global {
  interface Window extends SomeMixin {}
}`,
  },
  {
    input: ["global", ["const foo: string", "function bar(): void"]],
    code: `declare global {
  const foo: string
  function bar(): void
}`,
  },
];

describe("genDeclareNamespace", () => {
  for (const t of genDeclareNamespaceTests) {
    it(genTestTitle(t.code), () => {
      const code = genDeclareNamespace(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genBlockTests: Array<{
  input: Parameters<typeof genBlock>;
  code: string;
}> = [
  { input: [], code: "{}" },
  { input: [[]], code: "{}" },
  {
    input: [["return x;"]],
    code: `{
  return x;
}`,
  },
  {
    input: ["return x;"],
    code: `{
  return x;
}`,
  },
  {
    input: [["const a = 1;", "return a;"]],
    code: `{
  const a = 1;
  return a;
}`,
  },
  {
    input: [["return x;"], "  "],
    code: `{
    return x;
  }`,
  },
  {
    input: [["if (x) {", "  return 1;", "}"]],
    code: `{
  if (x) {
    return 1;
  }
}`,
  },
];

describe("genBlock", () => {
  for (const t of genBlockTests) {
    it(genTestTitle(t.code), () => {
      const code = genBlock(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genInlineTypeImportTests: Array<{
  input: Parameters<typeof genInlineTypeImport>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'typeof import("@nuxt/utils").default' },
  {
    input: ["@nuxt/utils", "genString"],
    code: 'typeof import("@nuxt/utils").genString',
  },
];

describe("genInlineTypeImport", () => {
  for (const t of genInlineTypeImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genInlineTypeImport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeImportTests: Array<{
  input: Parameters<typeof genTypeImport>;
  code: string;
}> = [
  {
    input: ["@nuxt/utils", ["test"]],
    code: 'import type { test } from "@nuxt/utils";',
  },
  {
    input: ["@nuxt/utils", [{ name: "test", as: "value" }]],
    code: 'import type { test as value } from "@nuxt/utils";',
  },
];

describe("genTypeImport", () => {
  for (const t of genTypeImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeImport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeExportTests: Array<{
  input: Parameters<typeof genTypeExport>;
  code: string;
}> = [
  {
    input: ["@nuxt/utils", ["test"]],
    code: 'export type { test } from "@nuxt/utils";',
  },
  {
    input: ["@nuxt/utils", [{ name: "test", as: "value" }]],
    code: 'export type { test as value } from "@nuxt/utils";',
  },
];

describe("genTypeExport", () => {
  for (const t of genTypeExportTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeExport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeAliasTests: Array<{
  input: Parameters<typeof genTypeAlias>;
  code: string;
}> = [
  {
    input: ["Foo", "string"],
    code: "type Foo = string",
  },
  {
    input: ["Bar", "{ a: number; b: string }"],
    code: "type Bar = { a: number; b: string }",
  },
  {
    input: ["FooType", { name: "string", count: "number" }],
    code: `type FooType = {
  name: string
  count: number
}`,
  },
  {
    input: ["Baz", "string", { export: true }],
    code: "export type Baz = string",
  },
];

describe("genTypeAlias", () => {
  for (const t of genTypeAliasTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeAlias(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeObjectTests: Array<{
  input: Parameters<typeof genTypeObject>;
  code: string;
}> = [
  {
    input: [{ name: "string", count: "number" }],
    code: `{
  name: string
  count: number
}`,
  },
  {
    input: [
      [
        { name: "name", type: "string" },
        { name: "count", type: "number", required: true },
      ],
    ],
    code: `{
  name?: string
  count: number
}`,
  },
  {
    input: [[{ name: "id", type: "string", jsdoc: "Unique id" }]],
    code: `{
  /** Unique id */
  id?: string
}`,
  },
  {
    input: [
      [
        {
          name: "prop",
          type: "boolean",
          required: true,
          jsdoc: ["Line one", "Line two"],
        },
      ],
    ],
    code: `{
  /**
   * Line one
   * Line two
   */
  prop: boolean
}`,
  },
];

describe("genTypeObject", () => {
  for (const t of genTypeObjectTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeObject(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genVariableTests: Array<{
  input: Parameters<typeof genVariable>;
  code: string;
}> = [
  {
    input: ["a", "2"],
    code: "const a = 2",
  },
  {
    input: ["foo", "'bar'"],
    code: "const foo = 'bar'",
  },
  {
    input: ["a", "2", { export: true }],
    code: "export const a = 2",
  },
  {
    input: ["x", "1", { kind: "let" }],
    code: "let x = 1",
  },
  {
    input: ["y", "0", { kind: "var", export: true }],
    code: "export var y = 0",
  },
];

describe("genVariable", () => {
  for (const t of genVariableTests) {
    it(genTestTitle(t.code), () => {
      const code = genVariable(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genEnumTests: Array<{
  input: Parameters<typeof genEnum>;
  code: string;
}> = [
  {
    input: ["Status", { Idle: 0, Running: 1, Done: 2 }],
    code: `enum Status {
  Idle = 0,
  Running = 1,
  Done = 2
}`,
  },
  {
    input: ["Status", { Idle: undefined, Running: undefined, Done: undefined }],
    code: `enum Status {
  Idle,
  Running = 1,
  Done = 2
}`,
  },
  {
    input: ["Kind", { Foo: "foo", Bar: "bar" }],
    code: `enum Kind {
  Foo = "foo",
  Bar = "bar"
}`,
  },
  {
    input: [
      "E",
      { A: 1, B: undefined, C: undefined },
      { const: true, export: true },
    ],
    code: `export const enum E {
  A = 1,
  B = 2,
  C = 3
}`,
  },
  {
    input: ["Empty", {}],
    code: "enum Empty {}",
  },
];

describe("genEnum", () => {
  for (const t of genEnumTests) {
    it(genTestTitle(t.code), () => {
      const code = genEnum(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genConstEnumTests: Array<{
  input: Parameters<typeof genConstEnum>;
  code: string;
}> = [
  {
    input: ["Status", { Idle: 0, Running: 1 }],
    code: `const enum Status {
  Idle = 0,
  Running = 1
}`,
  },
  {
    input: ["E", { A: undefined, B: undefined }, { export: true }],
    code: `export const enum E {
  A,
  B = 1
}`,
  },
];

describe("genConstEnum", () => {
  for (const t of genConstEnumTests) {
    it(genTestTitle(t.code), () => {
      const code = genConstEnum(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genParamTests: Array<{
  input: Parameters<typeof genParam>;
  code: string;
}> = [
  { input: [{ name: "x", type: "string" }], code: "x: string" },
  {
    input: [{ name: "y", type: "number", optional: true }],
    code: "y?: number",
  },
  {
    input: [{ name: "z", type: "number", default: "0" }],
    code: "z: number = 0",
  },
  { input: [{ name: "a" }], code: "a" },
  {
    input: [{ name: "opt", type: "string", optional: true, default: "'x'" }],
    code: "opt?: string = 'x'",
  },
];

describe("genParam", () => {
  for (const t of genParamTests) {
    it(genTestTitle(t.code), () => {
      const code = genParam(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genFunctionTests: Array<{
  input: Parameters<typeof genFunction>;
  code: string;
}> = [
  {
    input: [{ name: "foo" }],
    code: "function foo() {}",
  },
  {
    input: [
      {
        name: "foo",
        parameters: [
          { name: "x", type: "string" },
          { name: "y", type: "number", optional: true },
        ],
      },
    ],
    code: "function foo(x: string, y?: number) {}",
  },
  {
    input: [
      {
        name: "foo",
        parameters: [{ name: "n", type: "number", default: "0" }],
        body: ["return n + 1;"],
      },
    ],
    code: `function foo(n: number = 0) {
  return n + 1;
}`,
  },
  {
    input: [
      {
        name: "foo",
        export: true,
        jsdoc: "Exported foo",
      },
    ],
    code: `/** Exported foo */
export function foo() {}`,
  },
  {
    input: [
      {
        name: "bar",
        jsdoc: ["Line one", "Line two"],
        async: true,
        returnType: "Promise<void>",
      },
    ],
    code: `/**
 * Line one
 * Line two
 */
async function bar(): Promise<void> {}`,
  },
  {
    input: [
      {
        name: "gen",
        generator: true,
        parameters: [{ name: "max", type: "number" }],
        returnType: "Generator<number>",
        body: ["for (let i = 0; i < max; i++) yield i;"],
      },
    ],
    code: `function* gen(max: number): Generator<number> {
  for (let i = 0; i < max; i++) yield i;
}`,
  },
  {
    input: [
      {
        name: "id",
        generics: [{ name: "T" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
        body: ["return x;"],
      },
    ],
    code: `function id<T>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: "pick",
        generics: [
          { name: "T", extends: "object" },
          { name: "K", extends: "keyof T" },
        ],
        parameters: [
          { name: "obj", type: "T" },
          { name: "key", type: "K" },
        ],
        returnType: "T[K]",
        body: ["return obj[key];"],
      },
    ],
    code: `function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
  },
];

describe("genFunction", () => {
  for (const t of genFunctionTests) {
    it(genTestTitle(t.code), () => {
      const code = genFunction(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genIfTests: Array<{
  input: Parameters<typeof genIf>;
  code: string;
}> = [
  {
    input: ["x > 0", "return x;"],
    code: `if (x > 0) {
  return x;
}`,
  },
  {
    input: ["ok", ["doA();", "doB();"]],
    code: `if (ok) {
  doA();
  doB();
}`,
  },
  {
    input: ["x", "console.log(x);", { bracket: false }],
    code: "if (x) console.log(x);",
  },
  {
    input: ["cond", [], {}],
    code: "if (cond) {}",
  },
];

describe("genIf", () => {
  for (const t of genIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genIf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genElseIfTests: Array<{
  input: Parameters<typeof genElseIf>;
  code: string;
}> = [
  {
    input: ["x < 0", "return -x;"],
    code: `else if (x < 0) {
  return -x;
}`,
  },
  {
    input: ["ok", "doIt();", { bracket: false }],
    code: "else if (ok) doIt();",
  },
];

describe("genElseIf", () => {
  for (const t of genElseIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genElseIf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genElseTests: Array<{
  input: [string | string[], GenElseOptions?] | [string | string[]];
  code: string;
}> = [
  {
    input: [["return 0;"]],
    code: `else {
  return 0;
}`,
  },
  {
    input: ["fallback();"],
    code: `else {
  fallback();
}`,
  },
  {
    input: [[], {}],
    code: "else {}",
  },
  {
    input: ["doIt();", { bracket: false }],
    code: "else doIt();",
  },
];

describe("genElse", () => {
  for (const t of genElseTests) {
    it(genTestTitle(t.code), () => {
      const code =
        t.input.length === 1
          ? genElse(t.input[0])
          : genElse(t.input[0], t.input[1]);
      expect(code).to.equal(t.code);
    });
  }
});
