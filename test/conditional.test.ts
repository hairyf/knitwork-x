import { expect, describe, it } from "vitest";
import { genConditionalType } from "../src";
import { genTestTitle } from "./_utils";

const genConditionalTypeTests: Array<{
  input: Parameters<typeof genConditionalType>;
  code: string;
}> = [
  {
    input: ["T", "U", "X", "Y"],
    code: "T extends U ? X : Y",
  },
  {
    input: ["T", "null", "never", "T"],
    code: "T extends null ? never : T",
  },
  {
    input: ["T", "string", "string", "number"],
    code: "T extends string ? string : number",
  },
];

describe("genConditionalType", () => {
  for (const t of genConditionalTypeTests) {
    it(genTestTitle(t.code), () => {
      const code = genConditionalType(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
