import { expect, describe, it } from "vitest";
import { genVariableName, genVariable } from "../src";
import { genTestTitle } from "./_utils";

const genVariableNameTests = [
  { key: "valid_import", code: "valid_import" },
  { key: "for", code: "_for" },
  { key: "with space", code: "with_32space" },
  { key: "123 numbers", code: "_123_32numbers" },
];

describe("genVariableName", () => {
  for (const t of genVariableNameTests) {
    it(genTestTitle(t.code), () => {
      const code = genVariableName(t.key);
      expect(code).to.equal(t.code);
    });
  }
});

const genVariableTests = [
  { input: ["a", "2"], code: "const a = 2" },
  { input: ["foo", "'bar'"], code: "const foo = 'bar'" },
  { input: ["a", "2", { export: true }], code: "export const a = 2" },
  { input: ["x", "1", { kind: "let" }], code: "let x = 1" },
  {
    input: ["y", "0", { kind: "var", export: true }],
    code: "export var y = 0",
  },
];

describe("genVariable", () => {
  for (const t of genVariableTests) {
    it(genTestTitle(t.code), () => {
      const code = genVariable(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
