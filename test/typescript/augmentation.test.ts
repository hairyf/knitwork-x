import { expect, describe, it } from "vitest";
import { genAugmentation, genDeclareNamespace, genInterface } from "../../src";
import { genNamespace, genModule } from "../../src/typescript/augmentation";
import { genTestTitle } from "../_utils";

const genAugmentationTests: Array<{
  input: Parameters<typeof genAugmentation>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ["@nuxt/utils", genInterface("MyInterface", {})],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
  {
    input: [
      "@nuxt/utils",
      [genInterface("MyInterface", {}), genInterface("MyOtherInterface", {})],
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
  interface MyOtherInterface {}
}`,
  },
  {
    input: ["@nuxt/utils", genInterface("MyInterface", { "test?": "string" })],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {
    test?: string
  }
}`,
  },
  {
    input: [
      "@nuxt/utils",
      genInterface(
        "MyInterface",
        {},
        { extends: ["OtherInterface", "FurtherInterface"] },
      ),
    ],
    code: `declare module "@nuxt/utils" {
  interface MyInterface extends OtherInterface, FurtherInterface {}
}`,
  },
  {
    input: ["@nuxt/utils", ["interface Foo {}", "type Bar = string"]],
    code: `declare module "@nuxt/utils" {
  interface Foo {}
  type Bar = string
}`,
  },
];

describe("genAugmentation", () => {
  for (const t of genAugmentationTests) {
    it(genTestTitle(t.code), () => {
      const code = genAugmentation(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

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

const genModuleTests: Array<{
  input: Parameters<typeof genModule>;
  code: string;
}> = [
  { input: ["@nuxt/utils"], code: 'declare module "@nuxt/utils" {}' },
  {
    input: ["@nuxt/utils", genInterface("MyInterface", {})],
    code: `declare module "@nuxt/utils" {
  interface MyInterface {}
}`,
  },
];

describe("genModule", () => {
  for (const t of genModuleTests) {
    it(genTestTitle(t.code), () => {
      const code = genModule(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
