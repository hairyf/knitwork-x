import { expect, describe, it } from "vitest";
import { genString, genTemplateLiteral } from "../src";
import { genTestTitle } from "./_utils";

const genStringTests = [
  [`foo`, `"foo"`, `'foo'`],
  [`foo\nbar`, `"foo\\nbar"`, `'foo\\\\nbar'`],
  [`foo'bar`, `"foo'bar"`, `'foo\\'bar'`],
  [`foo"bar`, `"foo\\"bar"`, `'foo\\\\"bar'`],
];

describe("genString", () => {
  for (const [input, output] of genStringTests) {
    it(genTestTitle(input), () => {
      expect(genString(input)).to.equal(output);
    });
  }
});

describe("genString (singleQuotes: true)", () => {
  for (const [input, _, output] of genStringTests) {
    it(genTestTitle(input), () => {
      expect(genString(input, { singleQuotes: true })).to.equal(output);
    });
  }
});

const genTemplateLiteralTests: Array<{
  input: Parameters<typeof genTemplateLiteral>;
  code: string;
}> = [
  {
    input: [["hello ", "x"]],
    code: "`hello ${x}`",
  },
  {
    input: [["prefix", "expr", "suffix"]],
    code: "`prefix${expr}suffix`",
  },
  {
    input: [["", "value"]],
    code: "`${value}`",
  },
  {
    input: [["text"]],
    code: "`text`",
  },
  {
    input: [[]],
    code: "``",
  },
  {
    input: [["Hello ", "name", ", you are ", "age", " years old"]],
    code: "`Hello ${name}, you are ${age} years old`",
  },
  {
    input: [["text with `backtick`"]],
    code: "`text with \\`backtick\\``",
  },
  {
    input: [["text with ${interpolation}"]],
    code: "`text with \\${interpolation}`",
  },
];

describe("genTemplateLiteral", () => {
  for (const t of genTemplateLiteralTests) {
    it(genTestTitle(t.code), () => {
      expect(genTemplateLiteral(...t.input)).to.equal(t.code);
    });
  }
});
