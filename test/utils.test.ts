import { expect, describe, it } from "vitest";
import { genJSDocComment } from "../src";
import { genTestTitle } from "./_utils";

const genJSDocCommentTests: Array<{
  input: Parameters<typeof genJSDocComment>;
  code: string;
}> = [
  {
    input: ["Single line"],
    code: "/**\n * Single line\n */\n",
  },
  {
    input: [["Line one", "@param x - number", "@returns void"]],
    code: "/**\n * Line one\n * @param x - number\n * @returns void\n */\n",
  },
  {
    input: ["Indented", "  "],
    code: "  /**\n   * Indented\n   */\n",
  },
  {
    input: [["A", "B"], "  "],
    code: "  /**\n   * A\n   * B\n   */\n",
  },
];

describe("genJSDocComment", () => {
  for (const t of genJSDocCommentTests) {
    it(genTestTitle(t.code), () => {
      expect(genJSDocComment(...t.input)).to.equal(t.code);
    });
  }
});
