import { expect, describe, it } from "vitest";
import {
  genObjectFromRaw,
  genObjectFromRawEntries,
  genObjectFromValues,
  genObjectLiteral,
  genMapFromRaw,
  genSetFromRaw,
} from "../src";
import { genTestTitle } from "./_utils";

const genObjectFromRawTests = [
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

describe("genObjectFromRaw", () => {
  for (const t of genObjectFromRawTests) {
    it(genTestTitle(t.code), () => {
      const code = genObjectFromRaw(t.obj);
      expect(code).to.equal(t.code);
    });
  }
});

describe("genObjectFromRawEntries", () => {
  for (const t of genObjectFromRawTests) {
    it(genTestTitle(t.code), () => {
      const code = genObjectFromRawEntries(Object.entries(t.obj));
      expect(code).to.equal(t.code);
    });
  }
});

const genObjectFromValuesTests = [
  {
    obj: {
      a: "null",
      // eslint-disable-next-line unicorn/no-null
      b: null,
      c: undefined,
      1: "undefined",
      2: true,
      3: "true",
      "obj 1": '{ literal: () => "test" }',
      "obj 2": { nested: { foo: "bar" } },
      arr: ["1", "2", 3],
    },
    code: [
      "{",
      '  1: "undefined",',
      "  2: true,",
      '  3: "true",',
      '  a: "null",',
      "  b: null,",
      "  c: undefined,",
      '  "obj 1": "{ literal: () => \\"test\\" }",',
      '  "obj 2": {',
      "    nested: {",
      '      foo: "bar"',
      "    }",
      "  },",
      "  arr: [",
      '    "1",',
      '    "2",',
      "    3",
      "  ]",
      "}",
    ].join("\n"),
  },
];

describe("genObjectFromValues", () => {
  for (const t of genObjectFromValuesTests) {
    it(genTestTitle(t.code), () => {
      const code = genObjectFromValues(t.obj);
      expect(code).to.equal(t.code);
    });
  }
});

describe("genObjectLiteral", () => {
  it("shorthand: 'a' → { a }", () => {
    expect(genObjectLiteral(["a"])).to.equal("{\n  a\n}");
  });

  it("key-value: ['a', 'b'] → { a: b }", () => {
    expect(genObjectLiteral([["a", "b"]])).to.equal("{\n  a: b\n}");
  });

  it("spread: ['...', 'c'] → { ...c }", () => {
    expect(genObjectLiteral([["...", "c"]])).to.equal("{\n  ...c\n}");
  });

  it("mixed: config, type: 'A', ...b", () => {
    const code = genObjectLiteral(["config", ["type", "'A'"], ["...", "b"]]);
    expect(code).to.equal("{\n  config,\n  type: 'A',\n  ...b\n}");
  });

  it("non-identifier key uses quoted key", () => {
    expect(genObjectLiteral([["obj 1", "x"]])).to.equal('{\n  "obj 1": x\n}');
  });
});

describe("genMapFromRaw", () => {
  it("empty map", () => {
    expect(genMapFromRaw([])).to.equal("new Map([])");
  });

  it("simple entries", () => {
    expect(
      genMapFromRaw([
        ["foo", "bar"],
        ["baz", 1],
      ]),
    ).to.equal('new Map([["foo", "bar"], ["baz", 1]])');
  });

  it("nested objects", () => {
    expect(genMapFromRaw([["key", { nested: "value" }]])).to.equal(
      'new Map([\n["key", {\n    nested: "value"\n  }]\n])',
    );
  });

  it("with arrays", () => {
    expect(genMapFromRaw([["arr", [1, 2, 3]]])).to.equal(
      'new Map([\n["arr", [\n    1,\n    2,\n    3\n  ]]\n])',
    );
  });
});

describe("genSetFromRaw", () => {
  it("empty set", () => {
    expect(genSetFromRaw([])).to.equal("new Set([])");
  });

  it("simple values", () => {
    expect(genSetFromRaw(["foo", "bar", 1])).to.equal(
      'new Set(["foo", "bar", 1])',
    );
  });

  it("with objects", () => {
    expect(genSetFromRaw([{ a: 1 }, { b: 2 }])).to.equal(
      "new Set([\n{\n    a: 1\n  },\n{\n    b: 2\n  }\n])",
    );
  });

  it("with arrays", () => {
    expect(
      genSetFromRaw([
        [1, 2],
        [3, 4],
      ]),
    ).to.equal("new Set([\n[\n    1,\n    2\n  ],\n[\n    3,\n    4\n  ]\n])");
  });
});
