import { expect, describe, it } from "vitest";
import { genTry, genCatch, genFinally } from "../src";
import type { GenCatchOptions } from "../src";
import { genTestTitle } from "./_utils";

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
