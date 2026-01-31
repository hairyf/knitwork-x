import { CodegenOptions } from "./types";
import { genString } from "./string";
import { _genStatement, VALID_IDENTIFIER_RE } from "./_utils";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
export type ESMImport = string | { name: string; as?: string };

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
// https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#sec-exports
export type ESMExport = string | { name: string; as?: string };

export interface ESMCodeGenOptions extends CodegenOptions {
  /** Emit `import type` instead of `import` (TypeScript). */
  type?: boolean;
  // https://github.com/tc39/proposal-import-attributes
  // https://nodejs.org/api/esm.html#import-attributes
  attributes?: { type: string };
  /** @deprecated use attributes */
  assert?: { type: string };
}

export interface DynamicImportOptions extends ESMCodeGenOptions {
  /** Emit `typeof import()` (TypeScript type-only). */
  type?: boolean;
  /** Property name for type import, e.g. `typeof import("pkg").name`. */
  name?: string;
  comment?: string;
  /** Wrap with `() => `. Default: false. */
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
 *
 * genImport("@nuxt/utils", ["test"], { type: true });
 * // ~> `import type { test } from "@nuxt/utils";`
 * ```
 *
 * @group ESM
 */
export function genImport(
  specifier: string,
  imports?: ESMImport | ESMImport[],
  options: ESMCodeGenOptions = {},
) {
  const statementType = options.type ? "import type" : "import";
  return _genStatement(statementType, specifier, imports, options);
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
 * // ~> `import("pkg")`
 *
 * genDynamicImport("pkg", { wrapper: true });
 * // ~> `() => import("pkg")`
 *
 * genDynamicImport("pkg", { interopDefault: true });
 * // ~> `() => import("pkg").then(m => m.default || m)`
 *
 * genDynamicImport("pkg", { type: true });
 * // ~> `typeof import("pkg")`
 *
 * genDynamicImport("pkg", { type: true, name: "foo" });
 * // ~> `typeof import("pkg").foo`
 * ```
 *
 * @group ESM
 */
export function genDynamicImport(
  specifier: string,
  options: DynamicImportOptions = {},
) {
  const commentString = options.comment ? ` /* ${options.comment} */` : "";
  const optionsString = _genDynamicImportAttributes(options);
  const importExpr = `import(${genString(
    specifier,
    options,
  )}${commentString}${optionsString})`;

  if (options.type) {
    let nameString = "";
    if (options.name) {
      nameString = VALID_IDENTIFIER_RE.test(options.name)
        ? `.${options.name}`
        : `[${genString(options.name)}]`;
    }
    return `typeof ${importExpr}${nameString}`;
  }

  const wrapperString = options.wrapper === true ? "() => " : "";
  const interopString = options.interopDefault
    ? ".then(m => m.default || m)"
    : "";
  return `${wrapperString}${importExpr}${interopString}`;
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
