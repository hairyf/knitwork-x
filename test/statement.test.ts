import { expect, describe, it } from "vitest";
import { genThrow, genReturn } from "../src";
import { genTestTitle } from "./_utils";

const genThrowTests: Array<{
  input: Parameters<typeof genThrow>;
  code: string;
}> = [
  {
    input: ["new Error('failed')"],
    code: "throw new Error('failed');",
  },
  {
    input: ["e"],
    code: "throw e;",
  },
  {
    input: ["new TypeError('invalid')"],
    code: "throw new TypeError('invalid');",
  },
  {
    input: ["error", "  "],
    code: "  throw error;",
  },
];

describe("genThrow", () => {
  for (const t of genThrowTests) {
    it(genTestTitle(t.code), () => {
      const code = genThrow(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genReturnTests: Array<{
  input: Parameters<typeof genReturn>;
  code: string;
}> = [
  {
    input: ["x"],
    code: "return x;",
  },
  {
    input: [],
    code: "return;",
  },
  {
    input: ["a + b"],
    code: "return a + b;",
  },
  {
    input: ["result", "  "],
    code: "  return result;",
  },
  {
    input: [undefined, "  "],
    code: "  return;",
  },
];

describe("genReturn", () => {
  for (const t of genReturnTests) {
    it(genTestTitle(t.code), () => {
      const code = genReturn(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
