/**
 * Generate conditional type.
 *
 * @example
 *
 * ```js
 * genConditionalType("T", "U", "X", "Y");
 * // ~> `T extends U ? X : Y`
 *
 * genConditionalType("T", "null", "never", "T");
 * // ~> `T extends null ? never : T`
 * ```
 *
 * @param checkType - type to check (e.g. "T")
 * @param extendsType - type to extend (e.g. "U")
 * @param trueType - type when condition is true (e.g. "X")
 * @param falseType - type when condition is false (e.g. "Y")
 * @group Typescript
 */
export function genConditionalType(
  checkType: string,
  extendsType: string,
  trueType: string,
  falseType: string,
): string {
  return `${checkType} extends ${extendsType} ? ${trueType} : ${falseType}`;
}
