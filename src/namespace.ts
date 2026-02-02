import { genBlock } from './function'

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
  return `declare ${namespace} ${genBlock(statements)}`
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
  return `namespace ${name} ${genBlock(statements)}`
}
