import { expect, describe, it } from "vitest";
import {
  genObjectFromRaw,
  genObjectFromRawEntries,
  genObjectFromValues,
  genObjectLiteral,
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
