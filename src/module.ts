import { genBlock } from './function'
import { genString } from './string'

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
  return `declare module ${genString(specifier)} ${genBlock(statements)}`
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
  return genAugmentation(specifier, statements)
}
