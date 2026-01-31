/**
 * Generate decorator: `@decorator` or `@decorator(args)`.
 *
 * @example
 *
 * ```js
 * genDecorator("Component");
 * // ~> `@Component`
 *
 * genDecorator("Injectable", "()");
 * // ~> `@Injectable()`
 *
 * genDecorator("Route", '("/api")');
 * // ~> `@Route("/api")`
 *
 * genDecorator("Validate", "(min: 0, max: 100)");
 * // ~> `@Validate(min: 0, max: 100)`
 * ```
 *
 * @param name - decorator name
 * @param args - optional arguments (e.g. "()", '("/path")', "(options)")
 * @param indent - base indent
 * @group Typescript
 */
export function genDecorator(name: string, args?: string, indent = ""): string {
  const decorator = args === undefined ? `@${name}` : `@${name}${args}`;
  return `${indent}${decorator}`;
}
