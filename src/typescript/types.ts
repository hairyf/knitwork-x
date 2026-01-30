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

export interface GenFinallyOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `finally stmt`. Default true. */
  bracket?: boolean;
}

export interface GenPrefixedBlockOptions extends CodegenOptions {
  /** When false, emit single statement without braces: `prefix stmt`. Default true. */
  bracket?: boolean;
}

export interface GenSwitchOptions extends CodegenOptions {
  /** When false, emit body without braces. Default true. (Rarely used; switch body is typically braced.) */
  bracket?: boolean;
}

export interface GenClassOptions {
  /** Base class to extend. */
  extends?: string;
  /** Interface(s) to implement (single string or array). */
  implements?: string | string[];
  /** Add `export` modifier. */
  export?: boolean;
  /** JSDoc for the class. */
  jsdoc?: JSDoc;
}

export interface GenConstructorOptions {
  /** Super call argument list (e.g. `"a, b"`). Omit for no super call. */
  super?: string;
}

export interface GenClassPropertyOptions {
  /** Property type (for `name: Type`). */
  type?: string;
  /** Initializer (for `name = value`). Mutually exclusive with type-only form; can combine as `name: Type = value`. */
  value?: string;
  /** Emit `static` modifier. */
  static?: boolean;
  /** Emit `readonly` modifier. */
  readonly?: boolean;
  /** Emit `public` modifier (default in TS). */
  public?: boolean;
  /** Emit `private` modifier. */
  private?: boolean;
  /** Emit `protected` modifier. */
  protected?: boolean;
  /** Emit optional `name?`. */
  optional?: boolean;
}

export interface GenClassMethodOptions {
  /** Method parameters. */
  parameters?: TypeField[];
  /** Method body statements. */
  body?: string[];
  /** Emit `static` modifier. */
  static?: boolean;
  /** Emit `async` modifier. */
  async?: boolean;
  /** Emit generator (`*`). */
  generator?: boolean;
  /** Return type. */
  returnType?: string;
  /** Generics. */
  generics?: TypeGeneric[];
  /** Kind: regular method, getter, or setter. */
  kind?: "method" | "get" | "set";
  /** JSDoc for the method. */
  jsdoc?: JSDoc;
}

export interface GenGetterOptions extends CodegenOptions {
  /** Return type. */
  returnType?: string;
  /** JSDoc for the getter. */
  jsdoc?: JSDoc;
}

export interface GenSetterOptions extends CodegenOptions {
  /** Parameter type (e.g. `"string"`). */
  paramType?: string;
  /** JSDoc for the setter. */
  jsdoc?: JSDoc;
}

export interface GenArrowFunctionOptions {
  /** Function parameters. */
  parameters?: TypeField[];
  /** Function body: single expression string (e.g. `"x + 1"`) or array of statements (e.g. `["return x + 1;"]`). */
  body?: string | string[];
  /** Async function. */
  async?: boolean;
  /** Return type. */
  returnType?: string;
  /** Generics. */
  generics?: TypeGeneric[];
}

export interface GenMethodOptions {
  /** Method name. */
  name: string;
  /** Method parameters. */
  parameters?: TypeField[];
  /** Method body statements. */
  body?: string[];
  /** Emit `async` modifier. */
  async?: boolean;
  /** Emit generator (`*`). */
  generator?: boolean;
  /** Return type. */
  returnType?: string;
  /** Generics. */
  generics?: TypeGeneric[];
  /** JSDoc for the method. */
  jsdoc?: JSDoc;
}

export interface GenCallSignatureOptions {
  /** Function parameters. */
  parameters?: TypeField[];
  /** Return type. */
  returnType?: string;
  /** Generics. */
  generics?: TypeGeneric[];
}

export interface GenConstructSignatureOptions {
  /** Constructor parameters. */
  parameters?: TypeField[];
  /** Instance type. */
  returnType?: string;
  /** Generics. */
  generics?: TypeGeneric[];
}
