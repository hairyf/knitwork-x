import type {
  GenCatchOptions,
  GenFinallyOptions,
  GenTryOptions,
} from './types'
import { genPrefixedBlock } from './condition'

/**
 * Generate `try { statements }` or `try statement`.
 *
 * @example
 *
 * ```js
 * genTry("mightThrow();");
 * // ~> `try { mightThrow(); }`
 *
 * genTry(["const x = await f();", "return x;"]);
 * // ~> `try { const x = await f(); return x; }`
 *
 * genTry("f();", { bracket: false });
 * // ~> `try f();`
 * ```
 *
 * @group Typescript
 */
export function genTry(
  statements: string | string[],
  options: GenTryOptions = {},
  indent = '',
): string {
  return genPrefixedBlock('try', statements, options, indent)
}

/**
 * Generate `catch (binding) { statements }`, `catch { statements }`, or single-statement form.
 *
 * @example
 *
 * ```js
 * genCatch(["throw e;"], { binding: "e" });
 * // ~> `catch (e) { throw e; }`
 *
 * genCatch(["logError();"]);
 * // ~> `catch { logError(); }`
 *
 * genCatch("handle(e);", { binding: "e", bracket: false });
 * // ~> `catch (e) handle(e);`
 * ```
 *
 * @group Typescript
 */
export function genCatch(
  statements: string | string[],
  options: GenCatchOptions = {},
  indent = '',
): string {
  const prefix
    = typeof options.binding === 'string'
      ? `catch (${options.binding})`
      : 'catch'
  return genPrefixedBlock(prefix, statements, options, indent)
}

/**
 * Generate `finally { statements }` or `finally statement`.
 *
 * @example
 *
 * ```js
 * genFinally("cleanup();");
 * // ~> `finally { cleanup(); }`
 *
 * genFinally(["release();", "log('done');"]);
 * // ~> `finally { release(); log('done'); }`
 *
 * genFinally("cleanup();", { bracket: false });
 * // ~> `finally cleanup();`
 * ```
 *
 * @group Typescript
 */
export function genFinally(
  statements: string | string[],
  options: GenFinallyOptions = {},
  indent = '',
): string {
  return genPrefixedBlock('finally', statements, options, indent)
}
