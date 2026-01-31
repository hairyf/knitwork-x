import { expect, describe, it } from "vitest";
import { genDeclareNamespace, genNamespace, genInterface } from "../src";
import { genTestTitle } from "./_utils";

const genDeclareNamespaceTests: Array<{
  input: Parameters<typeof genDeclareNamespace>;
  code: string;
}> = [
  { input: ["global"], code: "declare global {}" },
  {
    input: ["global", genInterface("Window", {})],
    code: `declare global {
  interface Window {}
}`,
  },
  {
    input: [
      "global",
      [genInterface("Window", {}), genInterface("Document", {})],
    ],
    code: `declare global {
  interface Window {}
  interface Document {}
}`,
  },
  {
    input: ["global", genInterface("Window", { "customProp?": "string" })],
    code: `declare global {
  interface Window {
    customProp?: string
  }
}`,
  },
  {
    input: ["global", genInterface("Window", {}, { extends: ["SomeMixin"] })],
    code: `declare global {
  interface Window extends SomeMixin {}
}`,
  },
  {
    input: ["global", ["const foo: string", "function bar(): void"]],
    code: `declare global {
  const foo: string
  function bar(): void
}`,
  },
];

describe("genDeclareNamespace", () => {
  for (const t of genDeclareNamespaceTests) {
    it(genTestTitle(t.code), () => {
      const code = genDeclareNamespace(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genNamespaceTests: Array<{
  input: Parameters<typeof genNamespace>;
  code: string;
}> = [
  { input: ["MyNamespace"], code: "namespace MyNamespace {}" },
  {
    input: ["MyNamespace", genInterface("MyInterface", {})],
    code: `namespace MyNamespace {
  interface MyInterface {}
}`,
  },
  {
    input: [
      "MyNamespace",
      [genInterface("MyInterface", {}), genInterface("MyOtherInterface", {})],
    ],
    code: `namespace MyNamespace {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: ["MyNamespace", genInterface("MyInterface", { "test?": "string" })],
    code: `namespace MyNamespace {
  interface MyInterface {
    test?: string
  }
}`,
  },
  {
    input: ["MyNamespace", ["const foo: string", "function bar(): void"]],
    code: `namespace MyNamespace {
  const foo: string
  function bar(): void
}`,
  },
];

describe("genNamespace", () => {
  for (const t of genNamespaceTests) {
    it(genTestTitle(t.code), () => {
      const code = genNamespace(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
