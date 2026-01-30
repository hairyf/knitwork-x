import { expect, describe, it } from "vitest";
import {
  genInterface,
  genInlineTypeImport,
  genTypeImport,
  genTypeExport,
  genTypeAlias,
  genTypeObject,
  genVariable,
} from "../../src";
import { genTestTitle } from "../_utils";

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
