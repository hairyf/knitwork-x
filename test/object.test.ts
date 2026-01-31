import { expect, describe, it } from "vitest";
import {
  genObject,
  genLiteral,
  genMap,
  genSet,
  genGetter,
  genMethod,
} from "../src";
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

  describe("Field array format", () => {
    it("simple fields", () => {
      const code = genObject([
        { name: "foo", value: "bar" },
        { name: "test", value: '() => import("pkg")' },
      ]);
      expect(code).to.equal(
        ["{", "  foo: bar,", '  test: () => import("pkg")', "}"].join("\n"),
      );
    });

    it("field with JSDoc", () => {
      const code = genObject([
        { name: "count", value: "0", jsdoc: "Counter value" },
        { name: "name", value: '"test"' },
      ]);
      expect(code).to.equal(
        [
          "{",
          "  /** Counter value */",
          "  count: 0,",
          '  name: "test"',
          "}",
        ].join("\n"),
      );
    });

    it("field with multiline JSDoc", () => {
      const code = genObject([
        {
          name: "config",
          value: "{ enabled: true }",
          jsdoc: ["Configuration object", "@default { enabled: true }"],
        },
      ]);
      expect(code).to.equal(
        [
          "{",
          "  /**",
          "   * Configuration object",
          "   * @default { enabled: true }",
          "   */",
          "  config: { enabled: true }",
          "}",
        ].join("\n"),
      );
    });

    it("fields with special characters in names", () => {
      const code = genObject([
        { name: "obj 1", value: "x" },
        { name: "2xs", value: "true" },
      ]);
      expect(code).to.equal(
        ["{", '  "obj 1": x,', '  "2xs": true', "}"].join("\n"),
      );
    });
  });
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

describe("genGetter", () => {
  it("get value() { return this._v; }", () => {
    expect(genGetter("value", ["return this._v;"])).to.equal(
      "get value() {\n  return this._v;\n}",
    );
  });
  it("get id(): string { return this._id; }", () => {
    expect(
      genGetter("id", ["return this._id;"], { returnType: "string" }),
    ).to.equal("get id(): string {\n  return this._id;\n}");
  });
  it("getter with JSDoc", () => {
    expect(
      genGetter("x", ["return this._x;"], { jsdoc: "Getter for x" }),
    ).to.equal("/** Getter for x */\nget x() {\n  return this._x;\n}");
  });
  it("getter with empty body", () => {
    expect(genGetter("empty", [])).to.equal("get empty() {}");
  });
});

describe("genMethod (kind: get/set)", () => {
  it("get value(): number { return this._v; }", () => {
    expect(
      genMethod({
        name: "value",
        kind: "get",
        body: ["return this._v;"],
        returnType: "number",
      }),
    ).to.equal("get value(): number {\n  return this._v;\n}");
  });
  it("set value(v: number) { this._v = v; }", () => {
    expect(
      genMethod({
        name: "value",
        kind: "set",
        parameters: [{ name: "v", type: "number" }],
        body: ["this._v = v;"],
      }),
    ).to.equal("set value(v: number) {\n  this._v = v;\n}");
  });
  it("static get id() with static getter", () => {
    expect(
      genMethod({
        name: "id",
        kind: "get",
        static: true,
        body: ["return this._id;"],
        returnType: "string",
      }),
    ).to.equal("static get id(): string {\n  return this._id;\n}");
  });
  it("static set value(v) with static setter", () => {
    expect(
      genMethod({
        name: "value",
        kind: "set",
        static: true,
        parameters: [{ name: "v", type: "number" }],
        body: ["this._v = v;"],
      }),
    ).to.equal("static set value(v: number) {\n  this._v = v;\n}");
  });
});
