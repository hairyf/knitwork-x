import { expect, describe, it } from "vitest";
import {
  genImport,
  genExport,
  genDynamicImport,
  genDefaultExport,
} from "../src";
import { genTestTitle } from "./_utils";

const genImportTests = [
  {
    names: undefined,
    code: 'import "pkg";',
  },
  { names: "foo", code: 'import foo from "pkg";' },
  { names: ["foo"], code: 'import { foo } from "pkg";' },
  {
    names: "foo",
    code: `import foo from 'pkg';`,
    options: { singleQuotes: true },
  },
  {
    names: [{ name: "foo", as: "foo" }],
    code: 'import { foo } from "pkg";',
  },
  {
    names: [{ name: "foo", as: "bar" }],
    code: 'import { foo as bar } from "pkg";',
  },
  { names: { name: "*", as: "bar" }, code: 'import * as bar from "pkg";' },
  {
    names: [{ name: "default", as: "Test" }],
    code: 'import { default as Test } from "pkg";',
  },
  {
    names: ["foo"],
    code: 'import { foo } from "pkg" assert { type: "json" };',
    options: { assert: { type: "json" } },
  },
  {
    names: ["foo"],
    code: 'import { foo } from "pkg" with { type: "json" };',
    options: { attributes: { type: "json" } },
  },
  {
    names: ["test"],
    code: 'import type { test } from "@nuxt/utils";',
    specifier: "@nuxt/utils",
    options: { type: true },
  },
  {
    names: [{ name: "test", as: "value" }],
    code: 'import type { test as value } from "@nuxt/utils";',
    specifier: "@nuxt/utils",
    options: { type: true },
  },
];

describe("genImport", () => {
  for (const t of genImportTests) {
    it(genTestTitle(t.code), () => {
      const specifier = "specifier" in t && t.specifier ? t.specifier : "pkg";
      const code = genImport(specifier, t.names, t.options);
      expect(code).to.equal(t.code);
    });
  }
});

const genExportTests = [
  { names: undefined, code: 'export "pkg";' },
  { names: "foo", code: 'export foo from "pkg";' },
  { names: ["foo"], code: 'export { foo } from "pkg";' },
  {
    names: [{ name: "foo", as: "bar" }],
    code: 'export { foo as bar } from "pkg";',
  },
  { names: "*", code: 'export * from "pkg";' },
  { names: { name: "*", as: "bar" }, code: 'export * as bar from "pkg";' },
  { names: ["default"], code: 'export { default } from "pkg";' },
  {
    names: ["foo"],
    code: 'export { foo } from "pkg" assert { type: "json" };',
    options: { assert: { type: "json" } },
  },
  {
    names: "*",
    specifier: "./utils",
    options: { singleQuotes: true },
    code: "export * from './utils';",
  },
  {
    names: "*",
    specifier: "pkg",
    options: { attributes: { type: "json" } },
    code: 'export * from "pkg" with { type: "json" };',
  },
  {
    names: "*",
    specifier: "pkg",
    options: { assert: { type: "json" } },
    code: 'export * from "pkg" assert { type: "json" };',
  },
  {
    names: { name: "*", as: "utils" },
    code: 'export * as utils from "pkg";',
  },
  {
    names: { name: "*", as: "Helpers" },
    specifier: "./helpers",
    options: { singleQuotes: true },
    code: "export * as Helpers from './helpers';",
  },
  {
    names: { name: "*", as: "ns" },
    specifier: "pkg",
    options: { attributes: { type: "json" } },
    code: 'export * as ns from "pkg" with { type: "json" };',
  },
  {
    names: { name: "*", as: "ns" },
    specifier: "pkg",
    options: { assert: { type: "json" } },
    code: 'export * as ns from "pkg" assert { type: "json" };',
  },
];

describe("genExport", () => {
  for (const t of genExportTests) {
    it(genTestTitle(t.code), () => {
      const specifier = "specifier" in t && t.specifier ? t.specifier : "pkg";
      const code = genExport(specifier, t.names, t.options);
      expect(code).to.equal(t.code);
    });
  }
});

const genDynamicImportTests = [
  { code: 'import("pkg")' },
  { opts: { wrapper: true }, code: '() => import("pkg")' },
  {
    opts: { wrapper: true, interopDefault: true },
    code: '() => import("pkg").then(m => m.default || m)',
  },
  {
    opts: { wrapper: true, comment: 'webpackChunkName: "chunks/dynamic"' },
    code: '() => import("pkg" /* webpackChunkName: "chunks/dynamic" */)',
  },
  {
    opts: { wrapper: true, assert: { type: "json" } },
    code: '() => import("pkg", { assert: { type: "json" } })',
  },
  {
    opts: { wrapper: true, attributes: { type: "json" } },
    code: '() => import("pkg", { with: { type: "json" } })',
  },
  { opts: { type: true }, code: 'typeof import("pkg")' },
  {
    opts: { type: true, name: "foo" },
    code: 'typeof import("pkg").foo',
  },
  {
    opts: { type: true, name: "foo-bar" },
    code: 'typeof import("pkg")["foo-bar"]',
  },
  {
    opts: {
      type: true,
      name: "foo",
      comment: 'webpackChunkName: "chunks/dynamic"',
    },
    code: 'typeof import("pkg" /* webpackChunkName: "chunks/dynamic" */).foo',
  },
  {
    opts: { type: true, name: "foo", attributes: { type: "json" } },
    code: 'typeof import("pkg", { with: { type: "json" } }).foo',
  },
];

describe("genDynamicImport", () => {
  for (const t of genDynamicImportTests) {
    it(genTestTitle(t.code), () => {
      const code = genDynamicImport("pkg", t.opts);
      expect(code).to.equal(t.code);
    });
  }
});

const genDefaultExportTests = [
  { value: "foo", code: "export default foo;" },
  { value: "42", code: "export default 42;" },
  {
    value: "foo",
    options: { singleQuotes: true },
    code: "export default foo;",
  },
];

describe("genDefaultExport", () => {
  for (const t of genDefaultExportTests) {
    it(genTestTitle(t.code), () => {
      const code = genDefaultExport(t.value, t.options);
      expect(code).to.equal(t.code);
    });
  }
});
