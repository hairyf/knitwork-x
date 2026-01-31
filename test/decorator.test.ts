import { expect, describe, it } from "vitest";
import { genDecorator } from "../src";
import { genTestTitle } from "./_utils";

const genDecoratorTests: Array<{
  input: Parameters<typeof genDecorator>;
  code: string;
}> = [
  {
    input: ["Component"],
    code: "@Component",
  },
  {
    input: ["Injectable", "()"],
    code: "@Injectable()",
  },
  {
    input: ["Route", '("/api")'],
    code: '@Route("/api")',
  },
  {
    input: ["Validate", "(min: 0, max: 100)"],
    code: "@Validate(min: 0, max: 100)",
  },
  {
    input: ["Decorator", "()", "  "],
    code: "  @Decorator()",
  },
];

describe("genDecorator", () => {
  for (const t of genDecoratorTests) {
    it(genTestTitle(t.code), () => {
      const code = genDecorator(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
