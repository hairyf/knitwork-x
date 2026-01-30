import { CodegenOptions } from "./types";
import { genString } from "./string";
import { _genStatement, VALID_IDENTIFIER_RE } from "./_utils";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
export type ESMImport = string | { name: string; as?: string };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports
export type ESMExport = string | { name: string; as?: string };

export interface ESMCodeGenOptions extends CodegenOptions {
  // https://github.com/tc39/proposal-import-attributes
  // https://nodejs.org/api/esm.html#import-attributes
  attributes?: { type: string };
  /** @deprecated use attributes */
  assert?: { type: string };
}

export interface DynamicImportOptions extends ESMCodeGenOptions {
  comment?: string;
  wrapper?: boolean;
  interopDefault?: boolean;
}

/**
 * Generate an ESM `import` statement.
 *
 * @example
 *
 * ```js
 * genImport("pkg", "foo");
 * // ~> `import foo from "pkg";`
 *
 * genImport("pkg", ["foo"]);
 * // ~> `import { foo } from "pkg";`
 *
 * genImport("pkg", ["a", "b"]);
 * // ~> `import { a, b } from "pkg`;
 *
 * genImport("pkg", [{ name: "default", as: "bar" }]);
 * // ~> `import { default as bar } from "pkg`;
 *
 * genImport("pkg", [{ name: "foo", as: "bar" }]);
 * // ~> `import { foo as bar } from "pkg`;
 *
 * genImport("pkg", "foo", { attributes: { type: "json" } });
 * // ~> `import foo from "pkg" with { type: "json" };
 * ```
 *
 * @group ESM
 */
export function genImport(
  specifier: string,
  imports?: ESMImport | ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("import", specifier, imports, options);
}

/**
 * Generate an ESM `import type` statement.
 *
 * @example
 *
 * ```js
 * genTypeImport("@nuxt/utils", ["test"]);
 * // ~> `import type { test } from "@nuxt/utils";`
 *
 * genTypeImport("@nuxt/utils", [{ name: "test", as: "value" }]);
 * // ~> `import type { test as value } from "@nuxt/utils";`
 * ```
 *
 * @group ESM
 */
export function genTypeImport(
  specifier: string,
  imports: ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("import type", specifier, imports, options);
}

/**
 * Generate an ESM `export` statement.
 *
 * @example
 *
 * ```js
 * genExport("pkg", "foo");
 * // ~> `export foo from "pkg";`
 *
 * genExport("pkg", ["a", "b"]);
 * // ~> `export { a, b } from "pkg";`
 *
 * genExport("pkg", { name: "*", as: "bar" });
 * // ~> `export * as bar from "pkg";`
 * ```
 *
 * @group ESM
 */
export function genExport(
  specifier: string,
  exports?: ESMExport | ESMExport[],
  options: ESMCodeGenOptions = {},
) {
  return _genStatement("export", specifier, exports, options);
}

/**
 * Generate an ESM dynamic `import()` statement.
 *
 * @example
 *
 * ```js
 * genDynamicImport("pkg");
 * // ~> `() => import("pkg")`
 *
 * genDynamicImport("pkg", { wrapper: false });
 * // ~> `import("pkg")`
 *
 * genDynamicImport("pkg", { interopDefault: true });
 * // ~> `() => import("pkg").then(m => m.default || m)`
 * ```
 *
 * @group ESM
 */
export function genDynamicImport(
  specifier: string,
  options: DynamicImportOptions = {},
) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const wrapperString = options.wrapper === false ? "" : "() => ";
  const interopString = options.interopDefault
    ? ".then(m => m.default || m)"
    : "";
  const optionsString = _genDynamicImportAttributes(options);
  return `${wrapperString}import(${genString(
    specifier,
    options,
  )}${commentString}${optionsString})${interopString}`;
}

/**
 * Generate an ESM type `import()` statement.
 *
 * @example
 *
 * ```js
 * genDynamicTypeImport("pkg");
 * // ~> `typeof import("pkg")`
 *
 * genDynamicTypeImport("pkg", "foo");
 * // ~> `typeof import("pkg").foo`
 *
 * genDynamicTypeImport("pkg", "foo-bar");
 * // ~> `typeof import("pkg")["foo-bar"]`
 * ```
 *
 * @group ESM
 */
export function genDynamicTypeImport(
  specifier: string,
  name: string | undefined,
  options: Omit<DynamicImportOptions, "wrapper" | "interopDefault"> = {},
) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const optionsString = _genDynamicImportAttributes(options);
  let nameString = "";
  if (name) {
    nameString = VALID_IDENTIFIER_RE.test(name)
      ? `.${name}`
      : `[${genString(name)}]`;
  }
  return `typeof import(${genString(
    specifier,
    options,
  )}${commentString}${optionsString})${nameString}`;
}

/**
 * Generate an ESM `export default` statement.
 *
 * @example
 *
 * ```js
 * genDefaultExport("foo");
 * // ~> `export default foo;`
 *
 * genDefaultExport("42", { singleQuotes: true });
 * // ~> `export default 42;`
 * ```
 *
 * @group ESM
 */
export function genDefaultExport(value: string, _options: CodegenOptions = {}) {
  return `export default ${value};`;
}

/**
 * Generate an ESM `export *` statement (re-export all).
 *
 * @example
 *
 * ```js
 * genExportStar("pkg");
 * // ~> `export * from "pkg";`
 *
 * genExportStar("./utils", { singleQuotes: true });
 * // ~> `export * from './utils';`
 *
 * genExportStar("pkg", { attributes: { type: "json" } });
 * // ~> `export * from "pkg" with { type: "json" };`
 * ```
 *
 * @group ESM
 */
export function genExportStar(
  specifier: string,
  options: ESMCodeGenOptions = {},
) {
  const specifierString = genString(specifier, options);
  return `export * from ${specifierString}${_genExportImportAttributes(options)};`;
}

/**
 * Generate an ESM `export * as` statement (re-export all as namespace).
 *
 * @example
 *
 * ```js
 * genExportStarAs("pkg", "utils");
 * // ~> `export * as utils from "pkg";`
 *
 * genExportStarAs("./helpers", "Helpers", { singleQuotes: true });
 * // ~> `export * as Helpers from './helpers';`
 *
 * genExportStarAs("pkg", "ns", { attributes: { type: "json" } });
 * // ~> `export * as ns from "pkg" with { type: "json" };`
 * ```
 *
 * @group ESM
 */
export function genExportStarAs(
  specifier: string,
  namespace: string,
  options: ESMCodeGenOptions = {},
) {
  const specifierString = genString(specifier, options);
  return `export * as ${namespace} from ${specifierString}${_genExportImportAttributes(options)};`;
}

// --- internal ---

function _genExportImportAttributes(options: ESMCodeGenOptions = {}) {
  if (typeof options.attributes?.type === "string") {
    return ` with { type: ${genString(options.attributes.type)} }`;
  }

  // TODO: Remove deprecated `assert` in the next major release
  if (typeof options.assert?.type === "string") {
    return ` assert { type: ${genString(options.assert.type)} }`;
  }

  return "";
}

function _genDynamicImportAttributes(options: DynamicImportOptions = {}) {
  // TODO: Remove deprecated `assert` in the next major release
  if (typeof options.assert?.type === "string") {
    return `, { assert: { type: ${genString(options.assert.type)} } }`;
  }

  if (typeof options.attributes?.type === "string") {
    return `, { with: { type: ${genString(options.attributes.type)} } }`;
  }

  return "";
}
