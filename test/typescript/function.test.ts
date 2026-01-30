import { expect, describe, it } from "vitest";
import { genBlock, genParam, genFunction } from "../../src";
import { genTestTitle } from "../_utils";

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
