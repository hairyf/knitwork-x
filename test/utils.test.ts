import { expect, describe, it } from "vitest";
import { genJSDocComment } from "../src";
import { genTestTitle } from "./_utils";

const genJSDocCommentTests: Array<{
  input: Parameters<typeof genJSDocComment>;
  code: string;
}> = [
  {
    input: ["Single line"],
    code: "/** Single line */\n",
  },
  {
    input: [["Line one", "@param x - number", "@returns void"]],
    code: "/**\n * Line one\n * @param x - number\n * @returns void\n */\n",
  },
  {
    input: ["Indented", "  "],
    code: "  /** Indented */\n",
  },
  {
    input: [["A", "B"], "  "],
    code: "  /**\n   * A\n   * B\n   */\n",
  },
  {
    input: [
      {
        description: "Fn",
        param: { x: "number", y: "string" },
        returns: "void",
      },
    ],
    code: "/**\n * Fn\n * @param {number} x\n * @param {string} y\n * @returns {void}\n */\n",
  },
  {
    input: [
      {
        description: ["Line one", "Line two"],
        template: ["T", "K"],
        property: { id: "number", name: "string - label" },
        deprecated: "use other",
      },
    ],
    code: "/**\n * Line one\n * Line two\n * @template T\n * @template K\n * @property {number} id\n * @property {string} name - label\n * @deprecated use other\n */\n",
  },
];

describe("genJSDocComment", () => {
  for (const t of genJSDocCommentTests) {
    it(genTestTitle(t.code), () => {
      expect(genJSDocComment(...t.input)).to.equal(t.code);
    });
  }
});
