import { expect, describe, it } from "vitest";
import { genEnum, genConstEnum } from "../src";
import { genTestTitle } from "./_utils";

const genEnumTests: Array<{
  input: Parameters<typeof genEnum>;
  code: string;
}> = [
  {
    input: ["Status", { Idle: 0, Running: 1, Done: 2 }],
    code: `enum Status {
  Idle = 0,
  Running = 1,
  Done = 2
}`,
  },
  {
    input: ["Status", { Idle: undefined, Running: undefined, Done: undefined }],
    code: `enum Status {
  Idle,
  Running = 1,
  Done = 2
}`,
  },
  {
    input: ["Kind", { Foo: "foo", Bar: "bar" }],
    code: `enum Kind {
  Foo = "foo",
  Bar = "bar"
}`,
  },
  {
    input: [
      "E",
      { A: 1, B: undefined, C: undefined },
      { const: true, export: true },
    ],
    code: `export const enum E {
  A = 1,
  B = 2,
  C = 3
}`,
  },
  {
    input: ["Empty", {}],
    code: "enum Empty {}",
  },
];

describe("genEnum", () => {
  for (const t of genEnumTests) {
    it(genTestTitle(t.code), () => {
      const code = genEnum(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genConstEnumTests: Array<{
  input: Parameters<typeof genConstEnum>;
  code: string;
}> = [
  {
    input: ["Status", { Idle: 0, Running: 1 }],
    code: `const enum Status {
  Idle = 0,
  Running = 1
}`,
  },
  {
    input: ["E", { A: undefined, B: undefined }, { export: true }],
    code: `export const enum E {
  A,
  B = 1
}`,
  },
];

describe("genConstEnum", () => {
  for (const t of genConstEnumTests) {
    it(genTestTitle(t.code), () => {
      const code = genConstEnum(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
