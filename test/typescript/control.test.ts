import { expect, describe, it } from "vitest";
import {
  genPrefixedBlock,
  genIf,
  genElseIf,
  genElse,
  genTernary,
  genTry,
  genCatch,
  genFinally,
  genFor,
  genForOf,
  genForIn,
  genWhile,
  genDoWhile,
  genCase,
  genDefault,
  genSwitch,
  genThrow,
  genReturn,
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

const genTernaryTests: Array<{
  input: Parameters<typeof genTernary>;
  code: string;
}> = [
  { input: ["x > 0", "x", "-x"], code: "x > 0 ? x : -x" },
  { input: ["ok", "'yes'", "'no'"], code: "ok ? 'yes' : 'no'" },
  { input: ["hasValue", "value", "null"], code: "hasValue ? value : null" },
];

describe("genTernary", () => {
  for (const t of genTernaryTests) {
    it(genTestTitle(t.code), () => {
      const code = genTernary(...t.input);
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

const genForTests: Array<{
  input: Parameters<typeof genFor>;
  code: string;
}> = [
  {
    input: ["let i = 0", "i < n", "i++", "console.log(i);"],
    code: `for (let i = 0; i < n; i++) {
  console.log(i);
}`,
  },
  {
    input: ["", "true", "", ["doWork();", "if (done) break;"]],
    code: `for (; true; ) {
  doWork();
  if (done) break;
}`,
  },
  {
    input: ["i = 0", "i < 10", "i++", "sum += i;", { bracket: false }],
    code: "for (i = 0; i < 10; i++) sum += i;",
  },
  {
    input: ["let j = 0", "j < 5", "j++", [], {}],
    code: "for (let j = 0; j < 5; j++) {}",
  },
];

describe("genFor", () => {
  for (const t of genForTests) {
    it(genTestTitle(t.code), () => {
      const code = genFor(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genForOfTests: Array<{
  input: Parameters<typeof genForOf>;
  code: string;
}> = [
  {
    input: ["const x", "items", "console.log(x);"],
    code: `for (const x of items) {
  console.log(x);
}`,
  },
  {
    input: ["let [k, v]", "Object.entries(obj)", ["process(k, v);"]],
    code: `for (let [k, v] of Object.entries(obj)) {
  process(k, v);
}`,
  },
  {
    input: ["const item", "list", "yield item;", { bracket: false }],
    code: "for (const item of list) yield item;",
  },
  {
    input: ["const el", "arr", [], {}],
    code: "for (const el of arr) {}",
  },
];

describe("genForOf", () => {
  for (const t of genForOfTests) {
    it(genTestTitle(t.code), () => {
      const code = genForOf(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genForInTests: Array<{
  input: Parameters<typeof genForIn>;
  code: string;
}> = [
  {
    input: ["const key", "obj", "console.log(key, obj[key]);"],
    code: `for (const key in obj) {
  console.log(key, obj[key]);
}`,
  },
  {
    input: ["const k", "o", ["sum += o[k];"]],
    code: `for (const k in o) {
  sum += o[k];
}`,
  },
  {
    input: ["let p", "obj", "visit(p);", { bracket: false }],
    code: "for (let p in obj) visit(p);",
  },
  {
    input: ["const prop", "target", [], {}],
    code: "for (const prop in target) {}",
  },
];

describe("genForIn", () => {
  for (const t of genForInTests) {
    it(genTestTitle(t.code), () => {
      const code = genForIn(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genWhileTests: Array<{
  input: Parameters<typeof genWhile>;
  code: string;
}> = [
  {
    input: ["running", "step();"],
    code: `while (running) {
  step();
}`,
  },
  {
    input: ["i > 0", ["process();", "i--;"]],
    code: `while (i > 0) {
  process();
  i--;
}`,
  },
  {
    input: ["ok", "doIt();", { bracket: false }],
    code: "while (ok) doIt();",
  },
  {
    input: ["cond", [], {}],
    code: "while (cond) {}",
  },
];

describe("genWhile", () => {
  for (const t of genWhileTests) {
    it(genTestTitle(t.code), () => {
      const code = genWhile(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genDoWhileTests: Array<{
  input: Parameters<typeof genDoWhile>;
  code: string;
}> = [
  {
    input: ["step();", "!done"],
    code: `do {
  step();
} while (!done);`,
  },
  {
    input: [["read();", "check();"], "eof"],
    code: `do {
  read();
  check();
} while (eof);`,
  },
  {
    input: ["next();", "hasMore", { bracket: false }],
    code: "do next(); while (hasMore);",
  },
  {
    input: [[], "false", {}],
    code: "do {} while (false);",
  },
];

describe("genDoWhile", () => {
  for (const t of genDoWhileTests) {
    it(genTestTitle(t.code), () => {
      const code = genDoWhile(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

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

const genThrowTests: Array<{
  input: Parameters<typeof genThrow>;
  code: string;
}> = [
  {
    input: ["new Error('failed')"],
    code: "throw new Error('failed');",
  },
  {
    input: ["e"],
    code: "throw e;",
  },
  {
    input: ["new TypeError('invalid')"],
    code: "throw new TypeError('invalid');",
  },
  {
    input: ["error", "  "],
    code: "  throw error;",
  },
];

describe("genThrow", () => {
  for (const t of genThrowTests) {
    it(genTestTitle(t.code), () => {
      const code = genThrow(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genReturnTests: Array<{
  input: Parameters<typeof genReturn>;
  code: string;
}> = [
  {
    input: ["x"],
    code: "return x;",
  },
  {
    input: [],
    code: "return;",
  },
  {
    input: ["a + b"],
    code: "return a + b;",
  },
  {
    input: ["result", "  "],
    code: "  return result;",
  },
  {
    input: [undefined, "  "],
    code: "  return;",
  },
];

describe("genReturn", () => {
  for (const t of genReturnTests) {
    it(genTestTitle(t.code), () => {
      const code = genReturn(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
