import { expect, describe, it } from "vitest";
import {
  genPrefixedBlock,
  genIf,
  genElseIf,
  genElse,
  genTry,
  genCatch,
  genFinally,
  type GenElseOptions,
  type GenCatchOptions,
} from "../../src";
import { genTestTitle } from "../_utils";

const genPrefixedBlockTests: Array<{
  input: Parameters<typeof genPrefixedBlock>;
  code: string;
}> = [
  {
    input: ["if (ok)", "return true;"],
    code: `if (ok) {
  return true;
}`,
  },
  {
    input: ["while (running)", ["step();", "check();"]],
    code: `while (running) {
  step();
  check();
}`,
  },
];
describe("genPrefixedBlock", () => {
  for (const t of genPrefixedBlockTests) {
    it(genTestTitle(t.code), () => {
      const code = genPrefixedBlock(...t.input);
      expect(code).to.equal(t.code);
    });
  }
  it("for (;;) break; (bracket: false)", () => {
    expect(genPrefixedBlock("for (;;)", "break;", { bracket: false })).to.equal(
      "for (;;) break;",
    );
  });
});

const genIfTests: Array<{
  input: Parameters<typeof genIf>;
  code: string;
}> = [
  {
    input: ["x > 0", "return x;"],
    code: `if (x > 0) {
  return x;
}`,
  },
  {
    input: ["ok", ["doA();", "doB();"]],
    code: `if (ok) {
  doA();
  doB();
}`,
  },
  {
    input: ["x", "console.log(x);", { bracket: false }],
    code: "if (x) console.log(x);",
  },
  {
    input: ["cond", [], {}],
    code: "if (cond) {}",
  },
];

describe("genIf", () => {
  for (const t of genIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genIf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genElseIfTests: Array<{
  input: Parameters<typeof genElseIf>;
  code: string;
}> = [
  {
    input: ["x < 0", "return -x;"],
    code: `else if (x < 0) {
  return -x;
}`,
  },
  {
    input: ["ok", "doIt();", { bracket: false }],
    code: "else if (ok) doIt();",
  },
];

describe("genElseIf", () => {
  for (const t of genElseIfTests) {
    it(genTestTitle(t.code), () => {
      const code = genElseIf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genElseTests: Array<{
  input: [string | string[], GenElseOptions?] | [string | string[]];
  code: string;
}> = [
  {
    input: [["return 0;"]],
    code: `else {
  return 0;
}`,
  },
  {
    input: ["fallback();"],
    code: `else {
  fallback();
}`,
  },
  {
    input: [[], {}],
    code: "else {}",
  },
  {
    input: ["doIt();", { bracket: false }],
    code: "else doIt();",
  },
];

describe("genElse", () => {
  for (const t of genElseTests) {
    it(genTestTitle(t.code), () => {
      const code =
        t.input.length === 1
          ? genElse(t.input[0])
          : genElse(t.input[0], t.input[1]);
      expect(code).to.equal(t.code);
    });
  }
});

const genTryTests: Array<{
  input: Parameters<typeof genTry>;
  code: string;
}> = [
  {
    input: ["mightThrow();"],
    code: `try {
  mightThrow();
}`,
  },
  {
    input: [["const x = await f();", "return x;"]],
    code: `try {
  const x = await f();
  return x;
}`,
  },
  {
    input: ["f();", { bracket: false }],
    code: "try f();",
  },
  {
    input: [[], {}],
    code: "try {}",
  },
];

describe("genTry", () => {
  for (const t of genTryTests) {
    it(genTestTitle(t.code), () => {
      const code = genTry(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genCatchTests: Array<{
  input: [string | string[], GenCatchOptions?] | [string | string[]];
  code: string;
}> = [
  {
    input: [["throw e;"], { binding: "e" }],
    code: `catch (e) {
  throw e;
}`,
  },
  {
    input: [["logError();"]],
    code: `catch {
  logError();
}`,
  },
  {
    input: ["handle(e);", { binding: "e", bracket: false }],
    code: "catch (e) handle(e);",
  },
  {
    input: [[], { binding: "err" }],
    code: "catch (err) {}",
  },
];

describe("genCatch", () => {
  for (const t of genCatchTests) {
    it(genTestTitle(t.code), () => {
      const code =
        t.input.length === 1
          ? genCatch(t.input[0])
          : genCatch(t.input[0], t.input[1]);
      expect(code).to.equal(t.code);
    });
  }
});

const genFinallyTests: Array<{
  input: Parameters<typeof genFinally>;
  code: string;
}> = [
  {
    input: ["cleanup();"],
    code: `finally {
  cleanup();
}`,
  },
  {
    input: [["release();", "log('done');"]],
    code: `finally {
  release();
  log('done');
}`,
  },
  {
    input: ["cleanup();", { bracket: false }],
    code: "finally cleanup();",
  },
  {
    input: [[], {}],
    code: "finally {}",
  },
];

describe("genFinally", () => {
  for (const t of genFinallyTests) {
    it(genTestTitle(t.code), () => {
      const code = genFinally(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
