/**
 * Generate `throw expr;`.
 *
 * @example
 *
 * ```js
 * genThrow("new Error('failed')");
 * // ~> `throw new Error('failed');`
 *
 * genThrow("e");
 * // ~> `throw e;`
 * ```
 *
 * @group Typescript
 */
export function genThrow(expr: string, indent = ''): string {
  return `${indent}throw ${expr};`
}

/**
 * Generate `return expr;` or `return;`.
 *
 * @example
 *
 * ```js
 * genReturn("x");
 * // ~> `return x;`
 *
 * genReturn();
 * // ~> `return;`
 *
 * genReturn("a + b");
 * // ~> `return a + b;`
 * ```
 *
 * @group Typescript
 */
export function genReturn(expr?: string, indent = ''): string {
  return expr === undefined ? `${indent}return;` : `${indent}return ${expr};`
}
