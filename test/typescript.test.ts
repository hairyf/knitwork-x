import { expect, describe, it } from "vitest";
import {
  genInterface,
  genAugmentation,
  genDeclareNamespace,
  genEnum,
  genConstEnum,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
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
    code: "/** Simple description */\ninterface FooInterface {}",
  },
  {
    input: [
      "FooInterface",
      {},
      {
        jsdoc: {
          description: "Complex description",
          param: "someParam",
          returns: "void",
        },
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
        jsdoc: {
          description: "Complex description",
          param: "someParam",
          returns: "void",
        },
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
    input: ["@nuxt/utils", { MyInterface: {} }],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
  {
    input: ["@nuxt/utils", { MyInterface: {}, MyOtherInterface: {} }],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: [
      "@nuxt/utils",
      {
        MyInterface: {
          "test?": "string",
        },
      },
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
}`,
  },
  {
    input: [
      "@nuxt/utils",
      {
        MyInterface: [{}, { extends: ["OtherInterface", "FurtherInterface"] }],
      },
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
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
    input: ["global", { Window: {} }],
    code: `declare global {
  interface Window {}
}`,
  },
  {
    input: ["global", { Window: {}, Document: {} }],
    code: `declare global {
  interface Window {}
  interface Document {}
}`,
  },
  {
    input: [
      "global",
      {
        Window: {
          "customProp?": "string",
        },
      },
    ],
    code: `declare global {
  interface Window {
    customProp?: string
  }
}`,
  },
  {
    input: [
      "global",
      {
        Window: [{}, { extends: ["SomeMixin"] }],
      },
    ],
    code: `declare global {
  interface Window extends SomeMixin {}
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
