import { VALID_IDENTIFIER_RE } from "./_utils";
import { genString } from "./string";

export type JSDoc = string | string[] | JSDocObject;

/**
 * JSDoc object shape: description + typed tags, all types referenced for reuse.
 * - `param` / `property`: name -> "{Type}" or "{Type} - description"
 * - `returns`: type string
 * - `template`: generic names
 * - other keys: @tag value
 */
export interface JSDocObject {
  /** Description lines (no @). */
  description?: string | string[];
  /** @param {Type} name - description. */
  param?: Record<string, string>;
  /** @returns {Type}. */
  returns?: string;
  /** @template T for each. */
  template?: string[];
  /** @property {Type} name - description. */
  property?: Record<string, string>;
  [tag: string]: string | string[] | Record<string, string> | undefined;
}

function formatTypedTag(
  tag: "param" | "property",
  name: string,
  value: string,
): string {
  const sep = " - ";
  const typePart = value.includes(sep) ? value.split(sep)[0].trim() : value;
  const descPart = value.includes(sep)
    ? value.slice(value.indexOf(sep) + sep.length).trim()
    : "";
  const typeBraced = typePart.startsWith("{") ? typePart : `{${typePart}}`;
  return descPart
    ? `@${tag} ${typeBraced} ${name} - ${descPart}`
    : `@${tag} ${typeBraced} ${name}`;
}

/**
 * Generate a JSDoc block comment from lines or a JSDoc object (typed interface).
 *
 * @example
 *
 * ```js
 * genJSDocComment("Single line");
 * // ~> block comment with one line
 *
 * genJSDocComment(["Line one", "@param x - number", "@returns void"]);
 * // ~> multi-line block with those lines
 *
 * genJSDocComment({ description: "Fn", param: { x: "number" }, returns: "void" });
 * // ~> block with description, @param {number} x, @returns {void}
 *
 * genJSDocComment("Indented", "  ");
 * // ~> same block, each line prefixed with indent
 * ```
 *
 * @group utils
 */
export function genJSDocComment(jsdoc: JSDoc, indent = ""): string {
  const lines: string[] = [];

  if (typeof jsdoc === "string") {
    lines.push(jsdoc);
  } else if (Array.isArray(jsdoc)) {
    lines.push(...jsdoc);
  } else {
    const desc = jsdoc.description;
    if (desc !== undefined) {
      lines.push(...(Array.isArray(desc) ? desc : [desc]));
    }
    if (jsdoc.param !== undefined) {
      for (const [name, value] of Object.entries(jsdoc.param)) {
        lines.push(formatTypedTag("param", name, value));
      }
    }
    if (jsdoc.returns !== undefined) {
      const t = jsdoc.returns;
      lines.push(t.startsWith("{") ? `@returns ${t}` : `@returns {${t}}`);
    }
    if (jsdoc.template !== undefined) {
      for (const t of jsdoc.template) {
        lines.push(`@template ${t}`);
      }
    }
    if (jsdoc.property !== undefined) {
      for (const [name, value] of Object.entries(jsdoc.property)) {
        lines.push(formatTypedTag("property", name, value));
      }
    }
    const known = new Set([
      "description",
      "param",
      "returns",
      "template",
      "property",
    ]);
    for (const [tag, val] of Object.entries(jsdoc)) {
      if (known.has(tag) || val === undefined) continue;
      if (typeof val === "string") {
        lines.push(`@${tag} ${val}`);
      } else if (Array.isArray(val)) {
        for (const v of val) lines.push(`@${tag} ${v}`);
      }
    }
  }

  if (lines.length === 1) {
    return indent + "/** " + lines[0] + " */\n";
  }
  return (
    indent +
    "/**\n" +
    lines.map((line) => indent + " * " + line).join("\n") +
    "\n" +
    indent +
    " */\n"
  );
}

/**
 * Wrap an array of strings in delimiters.
 *
 * @group utils
 */
export function wrapInDelimiters(
  lines: string[],
  indent = "",
  delimiters = "{}",
  withComma = true,
) {
  if (lines.length === 0) {
    return delimiters;
  }
  const [start, end] = delimiters;
  return (
    `${start}\n` + lines.join(withComma ? ",\n" : "\n") + `\n${indent}${end}`
  );
}

/**
 * Generate regex literal from pattern and flags.
 *
 * @example
 *
 * ```js
 * genRegExp("foo");
 * // ~> `/foo/`
 *
 * genRegExp("foo", "gi");
 * // ~> `/foo/gi`
 *
 * genRegExp("foo\\d+");
 * // ~> `/foo\d+/`
 * ```
 *
 * @group utils
 */
export function genRegExp(pattern: string, flags?: string): string {
  // Escape forward slashes in the pattern
  const escapedPattern = pattern.replace(/\//g, "\\/");
  return flags ? `/${escapedPattern}/${flags}` : `/${escapedPattern}/`;
}

/**
 * Generate a safe javascript variable name for an object key.
 *
 * @example
 *
 * ```js
 * genKey("foo");
 * // ~> `foo`
 *
 * genKey("foo-bar");
 * // ~> `"foo-bar"`
 *
 * genKey("with space");
 * // ~> `"with space"`
 * ```
 *
 * @group utils
 */
export function genKey(key: string) {
  return VALID_IDENTIFIER_RE.test(key) ? key : genString(key);
}

/**
 * Generate comment: single-line `//` or block comment (non-JSDoc).
 *
 * @example
 *
 * ```js
 * genComment("Single line comment");
 * // ~> `// Single line comment`
 *
 * genComment("Multi-line\ncomment", { block: true });
 * // ~> block comment format
 *
 * genComment("Block comment", { block: true });
 * // ~> block comment format
 *
 * genComment("Indented", "  ");
 * // ~> `  // Indented`
 * ```
 *
 * @param text - comment text (can be multi-line)
 * @param options - block: use block comment instead of `//`
 * @param indent - base indent
 * @group utils
 */
export function genComment(
  text: string,
  options: { block?: boolean } = {},
  indent = "",
): string {
  const { block = false } = options;
  if (block) {
    // Block comment: /* ... */
    const lines = text.split("\n");
    if (lines.length === 1) {
      return `${indent}/* ${lines[0]} */`;
    }
    return (
      `${indent}/*\n` +
      lines.map((line) => `${indent} * ${line}`).join("\n") +
      `\n${indent} */`
    );
  }
  // Single-line comment: // ...
  return text
    .split("\n")
    .map((line) => `${indent}// ${line}`)
    .join("\n");
}
