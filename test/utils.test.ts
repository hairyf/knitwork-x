import { expect, describe, it } from "vitest";
import { genJSDocComment, genComment, genRegExp } from "../src";
import { genTestTitle } from "./_utils";

describe("genRegExp", () => {
  it("simple pattern", () => {
    expect(genRegExp("foo")).to.equal("/foo/");
  });

  it("pattern with flags", () => {
    expect(genRegExp("foo", "gi")).to.equal("/foo/gi");
  });

  it("pattern with escaped characters", () => {
    expect(genRegExp("foo\\d+")).to.equal("/foo\\d+/");
  });

  it("pattern with forward slash", () => {
    expect(genRegExp("foo/bar")).to.equal("/foo\\/bar/");
  });

  it("pattern with forward slash and flags", () => {
    expect(genRegExp("foo/bar", "g")).to.equal("/foo\\/bar/g");
  });
});

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
  {
    input: [
      {
        description: "Test",
        since: ["1.0.0", "Added in v1"],
      },
    ],
    code: "/**\n * Test\n * @since 1.0.0\n * @since Added in v1\n */\n",
  },
  {
    input: [
      {
        param: { x: "number" },
      },
    ],
    code: "/** @param {number} x */\n",
  },
  {
    input: [
      {
        description: "Test",
        returns: "void",
      },
    ],
    code: "/**\n * Test\n * @returns {void}\n */\n",
  },
  {
    input: [
      {
        description: "Test",
        param: { x: "number - value" },
      },
    ],
    code: "/**\n * Test\n * @param {number} x - value\n */\n",
  },
  {
    input: [
      {
        description: "Test",
        property: { id: "string" },
      },
    ],
    code: "/**\n * Test\n * @property {string} id\n */\n",
  },
  {
    input: [
      {
        description: "Returns already braced",
        returns: "{void}",
      },
    ],
    code: "/**\n * Returns already braced\n * @returns {void}\n */\n",
  },
  {
    input: [
      {
        param: { x: "{number}" },
      },
    ],
    code: "/** @param {number} x */\n",
  },
  {
    input: [
      {
        description: "Custom tag",
        customTag: "value",
      },
    ],
    code: "/**\n * Custom tag\n * @customTag value\n */\n",
  },
  {
    input: [
      {
        description: "Tags array",
        see: ["url1", "url2"],
      },
    ],
    code: "/**\n * Tags array\n * @see url1\n * @see url2\n */\n",
  },
  {
    input: [
      {
        description: "Ignore undefined tag",
        optionalTag: undefined,
      },
    ],
    code: "/** Ignore undefined tag */\n",
  },
];

describe("genJSDocComment", () => {
  for (const t of genJSDocCommentTests) {
    it(genTestTitle(t.code), () => {
      expect(genJSDocComment(...t.input)).to.equal(t.code);
    });
  }
});

const genCommentTests: Array<{
  input: Parameters<typeof genComment>;
  code: string;
}> = [
  {
    input: ["Single line comment"],
    code: "// Single line comment",
  },
  {
    input: ["Multi-line\ncomment", { block: true }],
    code: "/*\n * Multi-line\n * comment\n */",
  },
  {
    input: ["Block comment", { block: true }],
    code: "/* Block comment */",
  },
  {
    input: ["Indented", {}, "  "],
    code: "  // Indented",
  },
  {
    input: ["Line 1\nLine 2"],
    code: "// Line 1\n// Line 2",
  },
  {
    input: ["Multi\nline\nblock", { block: true }, "  "],
    code: "  /*\n   * Multi\n   * line\n   * block\n   */",
  },
];

describe("genComment", () => {
  for (const t of genCommentTests) {
    it(genTestTitle(t.code), () => {
      expect(genComment(...t.input)).to.equal(t.code);
    });
  }
});
