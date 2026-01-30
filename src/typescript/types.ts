import type { CodegenOptions } from "../types";
import type { JSDoc } from "../utils";

export interface TypeGeneric {
  name: string;
  extends?: string;
  default?: string;
}

export interface TypeField {
  /** parameter name */
  name: string;
  /** parameter type */
  type?: string;
  /** optional parameter */
  optional?: boolean;
  /** JSDoc for this field */
  jsdoc?: JSDoc;
  /** default value (code string) */
  default?: string;
}

export interface FunctionOpts {
  /** function name */
  name: string;
  /** function params */
  parameters?: TypeField[];
  /** function block (each string is one statement) */
  body?: string[];
  /** is export */
  export?: boolean;
  /** function JSDoc */
  jsdoc?: JSDoc;
  /** async function */
  async?: boolean;
  /** generator function */
  generator?: boolean;
  /** return type */
  returnType?: string;
  /** generics */
  generics?: TypeGeneric[];
}

export type TypeObjectWithJSDoc = {
  type: string;
  jsdoc: JSDoc;
};

export type TypeObject = {
  [key: string]: string | TypeObject | TypeObjectWithJSDoc;
};

/** Field descriptor for genTypeObject when called with an array. */
export interface TypeObjectField {
  /** property name */
  name: string;
  /** property type (default: "any") */
  type?: string;
  /** if false or omitted, property is optional (key?) */
  required?: boolean;
  /** JSDoc for this property */
  jsdoc?: JSDoc;
}

export interface GenInterfaceOptions {
  extends?: string | string[];
  export?: boolean;
  jsdoc?: JSDoc;
}

/** Enum member value: number, string, or undefined for auto-increment (numeric enums only). */
export type EnumMemberValue = number | string | undefined;

export interface GenEnumOptions extends CodegenOptions {
  /** Emit `const enum` instead of `enum`. */
  const?: boolean;
  /** Add `export` modifier. */
  export?: boolean;
}

export interface GenTypeAliasOptions {
  /** Add `export` modifier. */
  export?: boolean;
}

export interface GenVariableOptions {
  /** Add `export` modifier. */
  export?: boolean;
  /** Declaration kind: `const`, `let`, or `var`. Default `const`. */
  kind?: "const" | "let" | "var";
}

export interface GenIfOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `if (cond) stmt`. Default true. */
  bracket?: boolean;
}

export interface GenElseOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `else stmt`. Default true. */
  bracket?: boolean;
}

export interface GenTryOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `try stmt`. Default true. */
  bracket?: boolean;
}

export interface GenCatchOptions extends CodegenOptions {
  /** Optional catch binding (e.g. `e` for `catch (e) { }`). Omit for `catch { }`. */
  binding?: string;
  /** When false, emit single statement without braces: `catch (e) stmt`. Default true. */
  bracket?: boolean;
}
