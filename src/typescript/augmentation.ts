import { genString } from "../string";
import { genBlock } from "./function";

/**
 * Generate typescript `declare module` augmentation.
 *
 * @example
 *
 * ```js
 * genAugmentation("@nuxt/utils");
 * // ~> `declare module "@nuxt/utils" {}`
 *
 * genAugmentation("@nuxt/utils", "interface MyInterface {}");
 * // ~> `declare module "@nuxt/utils" { interface MyInterface {} }`
 *
 * genAugmentation("@nuxt/utils", [
 *   "interface MyInterface { test?: string }",
 *   "type MyType = string",
 * ]);
 * // ~> multi-line declare module with both interface and type
 * ```
 *
 * @group Typescript
 */
export function genAugmentation(
  specifier: string,
  statements?: string | string[],
): string {
  return `declare module ${genString(specifier)} ${genBlock(statements)}`;
}

/**
 * Generate typescript `declare <namespace>` block (e.g. `declare global {}`).
 *
 * @example
 *
 * ```js
 * genDeclareNamespace("global");
 * // ~> `declare global {}`
 *
 * genDeclareNamespace("global", "interface Window {}");
 * // ~> `declare global { interface Window {} }`
 *
 * genDeclareNamespace("global", [
 *   "interface Window { customProp?: string }",
 *   "const foo: string",
 * ]);
 * // ~> `declare global { interface Window {...} const foo: string }`
 * ```
 *
 * @group Typescript
 */
export function genDeclareNamespace(
  namespace: string,
  statements?: string | string[],
): string {
  return `declare ${namespace} ${genBlock(statements)}`;
}

/**
 * Generate typescript `namespace` block (non-declare; TS namespace).
 *
 * @example
 *
 * ```js
 * genNamespace("MyNamespace");
 * // ~> `namespace MyNamespace {}`
 *
 * genNamespace("MyNamespace", "interface MyInterface {}");
 * // ~> `namespace MyNamespace { interface MyInterface {} }`
 *
 * genNamespace("MyNamespace", [
 *   "interface MyInterface { test?: string }",
 *   "const foo: string",
 * ]);
 * // ~> `namespace MyNamespace { interface MyInterface {...} const foo: string }`
 * ```
 *
 * @group Typescript
 */
export function genNamespace(
  name: string,
  statements?: string | string[],
): string {
  return `namespace ${name} ${genBlock(statements)}`;
}

/**
 * Generate typescript `declare module` block.
 *
 * This is an alias for `genAugmentation` for consistency with TypeScript terminology.
 *
 * @example
 *
 * ```js
 * genModule("@nuxt/utils");
 * // ~> `declare module "@nuxt/utils" {}`
 *
 * genModule("@nuxt/utils", "interface MyInterface {}");
 * // ~> `declare module "@nuxt/utils" { interface MyInterface {} }`
 * ```
 *
 * @group Typescript
 */
export function genModule(
  specifier: string,
  statements?: string | string[],
): string {
  return genAugmentation(specifier, statements);
}
