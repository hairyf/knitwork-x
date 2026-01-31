import { expect, describe, it } from "vitest";
import {
  genInlineTypeImport,
  genImport,
  genTypeExport,
  genTypeAlias,
  genTypeObject,
  genUnion,
  genIntersection,
  genMappedType,
  genIndexSignature,
  genCallSignature,
  genConstructSignature,
  genTemplateLiteralType,
  genKeyOf,
  genTypeof,
  genTypeAssertion,
  genSatisfies,
} from "../src";
import { genTestTitle } from "./_utils";

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
  {
    input: ["Id", "T", { generics: [{ name: "T" }] }],
    code: "type Id<T> = T",
  },
  {
    input: ["Nullable", "T | null", { generics: [{ name: "T" }] }],
    code: "type Nullable<T> = T | null",
  },
  {
    input: [
      "WithExtends",
      "T",
      { generics: [{ name: "T", extends: "object" }] },
    ],
    code: "type WithExtends<T extends object> = T",
  },
  {
    input: [
      "WithDefault",
      "T",
      { generics: [{ name: "T", default: "string" }] },
    ],
    code: "type WithDefault<T = string> = T",
  },
  {
    input: [
      "Pair",
      { first: "A", second: "B" },
      { generics: [{ name: "A" }, { name: "B" }] },
    ],
    code: `type Pair<A, B> = {
  first: A
  second: B
}`,
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
  input: Parameters<typeof genImport>;
  code: string;
}> = [
  {
    input: ["@nuxt/utils", ["test"], { type: true }],
    code: 'import type { test } from "@nuxt/utils";',
  },
  {
    input: ["@nuxt/utils", [{ name: "test", as: "value" }], { type: true }],
    code: 'import type { test as value } from "@nuxt/utils";',
  },
];

describe("genImport with type option", () => {
  for (const t of genTypeImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genImport(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genUnionTests: Array<{
  input: Parameters<typeof genUnion>;
  code: string;
}> = [
  {
    input: [["string", "number"]],
    code: "string | number",
  },
  {
    input: [["A", "B", "C"]],
    code: "A | B | C",
  },
  {
    input: ["string"],
    code: "string",
  },
  {
    input: [[]],
    code: "never",
  },
  {
    input: [["string"]],
    code: "string",
  },
];

describe("genUnion", () => {
  for (const t of genUnionTests) {
    it(genTestTitle(t.code), () => {
      const code = genUnion(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genIntersectionTests: Array<{
  input: Parameters<typeof genIntersection>;
  code: string;
}> = [
  {
    input: [["A", "B"]],
    code: "A & B",
  },
  {
    input: [["A", "B", "C"]],
    code: "A & B & C",
  },
  {
    input: ["string"],
    code: "string",
  },
  {
    input: [[]],
    code: "never",
  },
  {
    input: [["string"]],
    code: "string",
  },
];

describe("genIntersection", () => {
  for (const t of genIntersectionTests) {
    it(genTestTitle(t.code), () => {
      const code = genIntersection(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genMappedTypeTests: Array<{
  input: Parameters<typeof genMappedType>;
  code: string;
}> = [
  {
    input: ["K", "keyof T", "U"],
    code: "{ [K in keyof T]: U }",
  },
  {
    input: ["P", "keyof T", "T[P]"],
    code: "{ [P in keyof T]: T[P] }",
  },
  {
    input: ["K", "string", "number"],
    code: "{ [K in string]: number }",
  },
];

describe("genMappedType", () => {
  for (const t of genMappedTypeTests) {
    it(genTestTitle(t.code), () => {
      const code = genMappedType(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genIndexSignatureTests: Array<{
  input: Parameters<typeof genIndexSignature>;
  code: string;
}> = [
  {
    input: ["string", "number"],
    code: "[key: string]: number",
  },
  {
    input: ["number", "string"],
    code: "[key: number]: string",
  },
  {
    input: ["string", "any", "key"],
    code: "[key: string]: any",
  },
  {
    input: ["string", "number", "index"],
    code: "[index: string]: number",
  },
];

describe("genIndexSignature", () => {
  for (const t of genIndexSignatureTests) {
    it(genTestTitle(t.code), () => {
      const code = genIndexSignature(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genCallSignatureTests: Array<{
  input: Parameters<typeof genCallSignature>;
  code: string;
}> = [
  {
    input: [
      {
        parameters: [{ name: "x", type: "string" }],
        returnType: "number",
      },
    ],
    code: "(x: string): number",
  },
  {
    input: [
      {
        parameters: [
          { name: "a", type: "number" },
          { name: "b", type: "number", optional: true },
        ],
        returnType: "void",
      },
    ],
    code: "(a: number, b?: number): void",
  },
  {
    input: [
      {
        generics: [{ name: "T" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
      },
    ],
    code: "<T>(x: T): T",
  },
  {
    input: [
      {
        generics: [
          { name: "T", extends: "object" },
          { name: "K", extends: "keyof T" },
        ],
        parameters: [
          { name: "obj", type: "T" },
          { name: "key", type: "K" },
        ],
        returnType: "T[K]",
      },
    ],
    code: "<T extends object, K extends keyof T>(obj: T, key: K): T[K]",
  },
  {
    input: [{}],
    code: "()",
  },
  {
    input: [{ parameters: [{ name: "x", type: "string" }] }],
    code: "(x: string)",
  },
  {
    input: [
      {
        generics: [{ name: "T", default: "string" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
      },
    ],
    code: "<T = string>(x: T): T",
  },
];

describe("genCallSignature", () => {
  for (const t of genCallSignatureTests) {
    it(genTestTitle(t.code), () => {
      const code = genCallSignature(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genConstructSignatureTests: Array<{
  input: Parameters<typeof genConstructSignature>;
  code: string;
}> = [
  {
    input: [
      {
        parameters: [{ name: "x", type: "string" }],
        returnType: "MyClass",
      },
    ],
    code: "new (x: string): MyClass",
  },
  {
    input: [
      {
        parameters: [{ name: "value", type: "number" }],
        returnType: "Instance",
      },
    ],
    code: "new (value: number): Instance",
  },
  {
    input: [
      {
        generics: [{ name: "T" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
      },
    ],
    code: "new <T>(x: T): T",
  },
  {
    input: [
      {
        parameters: [
          { name: "a", type: "string" },
          { name: "b", type: "number", optional: true },
        ],
        returnType: "MyClass",
      },
    ],
    code: "new (a: string, b?: number): MyClass",
  },
  {
    input: [{}],
    code: "new ()",
  },
  {
    input: [
      {
        generics: [{ name: "T", extends: "object" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
      },
    ],
    code: "new <T extends object>(x: T): T",
  },
  {
    input: [
      {
        generics: [{ name: "T", default: "unknown" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
      },
    ],
    code: "new <T = unknown>(x: T): T",
  },
];

describe("genConstructSignature", () => {
  for (const t of genConstructSignatureTests) {
    it(genTestTitle(t.code), () => {
      const code = genConstructSignature(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTemplateLiteralTypeTests: Array<{
  input: Parameters<typeof genTemplateLiteralType>;
  code: string;
}> = [
  {
    input: [["prefix", "T", "suffix"]],
    code: "`prefix${T}suffix`",
  },
  {
    input: [["Hello ", "T", ""]],
    code: "`Hello ${T}`",
  },
  {
    input: [["", "K", "Key"]],
    code: "`${K}Key`",
  },
  {
    input: [["prefix", "T1", "middle", "T2", "suffix"]],
    code: "`prefix${T1}middle${T2}suffix`",
  },
  {
    input: [[""]],
    code: "``",
  },
  {
    input: [["text"]],
    code: "`text`",
  },
  {
    input: [[]],
    code: "``",
  },
];

describe("genTemplateLiteralType", () => {
  for (const t of genTemplateLiteralTypeTests) {
    it(genTestTitle(t.code), () => {
      const code = genTemplateLiteralType(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genKeyOfTests: Array<{
  input: Parameters<typeof genKeyOf>;
  code: string;
}> = [
  {
    input: ["T"],
    code: "keyof T",
  },
  {
    input: ["MyObject"],
    code: "keyof MyObject",
  },
  {
    input: ["Record<string, number>"],
    code: "keyof Record<string, number>",
  },
];

describe("genKeyOf", () => {
  for (const t of genKeyOfTests) {
    it(genTestTitle(t.code), () => {
      const code = genKeyOf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeofTests: Array<{
  input: Parameters<typeof genTypeof>;
  code: string;
}> = [
  {
    input: ["someVar"],
    code: "typeof someVar",
  },
  {
    input: ["myFunction"],
    code: "typeof myFunction",
  },
  {
    input: ["import('module').default"],
    code: "typeof import('module').default",
  },
];

describe("genTypeof", () => {
  for (const t of genTypeofTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeof(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genTypeAssertionTests: Array<{
  input: Parameters<typeof genTypeAssertion>;
  code: string;
}> = [
  {
    input: ["value", "string"],
    code: "value as string",
  },
  {
    input: ["obj", "MyType"],
    code: "obj as MyType",
  },
  {
    input: ["data", "Record<string, number>"],
    code: "data as Record<string, number>",
  },
  {
    input: ["result", "Promise<string>"],
    code: "result as Promise<string>",
  },
];

describe("genTypeAssertion", () => {
  for (const t of genTypeAssertionTests) {
    it(genTestTitle(t.code), () => {
      const code = genTypeAssertion(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genSatisfiesTests: Array<{
  input: Parameters<typeof genSatisfies>;
  code: string;
}> = [
  {
    input: ["{ a: 1 }", "{ a: number }"],
    code: "{ a: 1 } satisfies { a: number }",
  },
  {
    input: ["config", "ConfigType"],
    code: "config satisfies ConfigType",
  },
  {
    input: ["{ x: 'test', y: 42 }", "{ x: string; y: number }"],
    code: "{ x: 'test', y: 42 } satisfies { x: string; y: number }",
  },
  {
    input: ["value", "string | number"],
    code: "value satisfies string | number",
  },
];

describe("genSatisfies", () => {
  for (const t of genSatisfiesTests) {
    it(genTestTitle(t.code), () => {
      const code = genSatisfies(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
