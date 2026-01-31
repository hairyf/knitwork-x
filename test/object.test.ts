import { expect, describe, it } from "vitest";
import { genObject, genLiteral, genMap, genSet } from "../src";
import { genTestTitle } from "./_utils";

const genObjectTests = [
  {
    obj: {
      a: "null",
      // eslint-disable-next-line unicorn/no-null
      b: null,
      c: undefined,
      1: "undefined",
      2: true,
      3: "true",
      "2xs": true,
      xs2: true,
      "obj 1": '{ literal: () => "test" }',
      "obj 2": { nested: { foo: '"bar"' } },
      arr: ["1", "2", "3"],
    },
    code: [
      "{",
      "  1: undefined,",
      "  2: true,",
      "  3: true,",
      "  a: null,",
      "  b: null,",
      "  c: undefined,",
      '  "2xs": true,',
      "  xs2: true,",
      '  "obj 1": { literal: () => "test" },',
      '  "obj 2": {',
      "    nested: {",
      '      foo: "bar"',
      "    }",
      "  },",
      "  arr: [",
      "    1,",
      "    2,",
      "    3",
      "  ]",
      "}",
    ].join("\n"),
  },
];

describe("genObject", () => {
  for (const t of genObjectTests) {
    it(genTestTitle(t.code), () => {
      const code = genObject(t.obj);
      expect(code).to.equal(t.code);
    });
  }
});

describe("genLiteral", () => {
  it("shorthand: 'a' → { a }", () => {
    expect(genLiteral(["a"])).to.equal("{\n  a\n}");
  });

  it("key-value: ['a', 'b'] → { a: b }", () => {
    expect(genLiteral([["a", "b"]])).to.equal("{\n  a: b\n}");
  });

  it("spread: ['...', 'c'] → { ...c }", () => {
    expect(genLiteral([["...", "c"]])).to.equal("{\n  ...c\n}");
  });

  it("mixed: config, type: 'A', ...b", () => {
    const code = genLiteral(["config", ["type", "'A'"], ["...", "b"]]);
    expect(code).to.equal("{\n  config,\n  type: 'A',\n  ...b\n}");
  });

  it("non-identifier key uses quoted key", () => {
    expect(genLiteral([["obj 1", "x"]])).to.equal('{\n  "obj 1": x\n}');
  });
});

describe("genMap", () => {
  it("empty map", () => {
    expect(genMap([])).to.equal("new Map([])");
  });

  it("simple entries", () => {
    expect(
      genMap([
        ["foo", "bar"],
        ["baz", 1],
      ]),
    ).to.equal('new Map([["foo", "bar"], ["baz", 1]])');
  });

  it("nested objects", () => {
    expect(genMap([["key", { nested: "value" }]])).to.equal(
      'new Map([\n["key", {\n    nested: "value"\n  }]\n])',
    );
  });

  it("with arrays", () => {
    expect(genMap([["arr", [1, 2, 3]]])).to.equal(
      'new Map([\n["arr", [\n    1,\n    2,\n    3\n  ]]\n])',
    );
  });
});

describe("genSet", () => {
  it("empty set", () => {
    expect(genSet([])).to.equal("new Set([])");
  });

  it("simple values", () => {
    expect(genSet(["foo", "bar", 1])).to.equal('new Set(["foo", "bar", 1])');
  });

  it("with objects", () => {
    expect(genSet([{ a: 1 }, { b: 2 }])).to.equal(
      "new Set([\n{\n    a: 1\n  },\n{\n    b: 2\n  }\n])",
    );
  });

  it("with arrays", () => {
    expect(
      genSet([
        [1, 2],
        [3, 4],
      ]),
    ).to.equal("new Set([\n[\n    1,\n    2\n  ],\n[\n    3,\n    4\n  ]\n])");
  });
});
