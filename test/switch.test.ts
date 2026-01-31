import { expect, describe, it } from "vitest";
import { genCase, genDefault, genSwitch } from "../src";
import { genTestTitle } from "./_utils";

const genCaseTests: Array<{
  input: Parameters<typeof genCase>;
  code: string;
}> = [
  {
    input: ["1", "break;"],
    code: `case 1:
  break;`,
  },
  {
    input: ["'a'", ["doA();", "break;"]],
    code: `case 'a':
  doA();
  break;`,
  },
  {
    input: ["0"],
    code: "case 0:",
  },
  {
    input: ["Color.Red", "return 'red';"],
    code: `case Color.Red:
  return 'red';`,
  },
  {
    input: ["2", []],
    code: "case 2:",
  },
];

describe("genCase", () => {
  for (const t of genCaseTests) {
    it(genTestTitle(t.code), () => {
      const code = genCase(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genDefaultTests: Array<{
  input: Parameters<typeof genDefault>;
  code: string;
}> = [
  {
    input: ["return 0;"],
    code: `default:
  return 0;`,
  },
  {
    input: [["log('default');", "break;"]],
    code: `default:
  log('default');
  break;`,
  },
  {
    input: [],
    code: "default:",
  },
  {
    input: [[]],
    code: "default:",
  },
];

describe("genDefault", () => {
  for (const t of genDefaultTests) {
    it(genTestTitle(t.code), () => {
      const code = genDefault(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genSwitchTests: Array<{
  input: Parameters<typeof genSwitch>;
  code: string;
}> = [
  {
    input: ["x", [genCase("1", "break;"), genDefault("return 0;")]],
    code: `switch (x) {
  case 1:
    break;
  default:
    return 0;
}`,
  },
  {
    input: ["key", []],
    code: "switch (key) {}",
  },
  {
    input: ["n", [genCase("0"), genCase("1", "return 1;")]],
    code: `switch (n) {
  case 0:
  case 1:
    return 1;
}`,
  },
  {
    input: ["x", [], { bracket: true }],
    code: "switch (x) {}",
  },
];

describe("genSwitch", () => {
  for (const t of genSwitchTests) {
    it(genTestTitle(t.code), () => {
      const code = genSwitch(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
