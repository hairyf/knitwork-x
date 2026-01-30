# gen Method Design Guidelines

This document summarizes design conventions for knitwork’s `gen*` APIs—parameters, return values, naming, and related norms—for reference when adding or changing code-generation helpers.

---

## 1. Naming

### 1.1 Public API

- **Prefix**: Exported code-generation functions use the `gen` prefix, e.g. `genImport`, `genString`, `genInterface`, `genBlock`.
- **Verb + noun**: Names should clearly express what is generated, e.g. `genTypeAlias` (type alias), `genObjectFromRaw` (object literal from raw values).

### 1.2 Internal implementation

- **Underscore prefix**: Helpers used only within a module and not exported use the `_gen` prefix, e.g. `_genStatement`, `_genDynamicImportAttributes`.
- **Non-gen names**: Pure utilities (e.g. escaping, wrapping) may omit `gen`, e.g. `escapeString`, `wrapInDelimiters`.

---

## 2. Parameters

### 2.1 Parameter order (recommended)

1. **Required “subject” parameters** (what to generate): e.g. `specifier`, `name`, `object`, `members`.
2. **Optional “subject” parameters**: e.g. `imports?`, `contents?`, `statements?`.
3. **Options object**: `options: GenXxxOptions = {}`, second-to-last or last.
4. **Indent**: If indent is supported, `indent = ""` as the **last** parameter.

Examples:

```ts
// subject + options + indent
genTypeAlias(name: string, value: string | TypeObject, options?, indent?): string

// subject + options (no indent)
genImport(specifier: string, imports?, options?: ESMCodeGenOptions): string

// subject only (simple cases)
genObjectKey(key: string): string
genParam(p: TypeField): string
```

### 2.2 Options object

- **Type**: Define `GenXxxOptions` or `XxxCodeGenOptions` per domain; extend `CodegenOptions` when needed (e.g. `singleQuotes?`).
- **Optionality**: All option fields are optional; callers default `options` to `{}`.
- **Boolean flags**: Use clear names, e.g. `export`, `const`, `bracket`, `wrapper`, `preserveTypes`.
- **Enum-like**: Use literal union types, e.g. `kind?: "const" | "let" | "var"`.
- **Deprecation**: Mark deprecated options with JSDoc `@deprecated` and the replacement (e.g. `assert` → `attributes`).

### 2.3 Polymorphic input

- **Single / array**: When “one” vs “many” is clear, accept `T | T[]`, e.g. `statements?: string | string[]`, `imports?: ESMImport | ESMImport[]`; normalize to an array inside the implementation.
- **Object vs array**: When the same concept has two shapes (e.g. object literal vs field array), use a union, e.g. `genTypeObject(object: TypeObject | TypeObjectField[])`, `genInterface(name, contents?: TypeObject | TypeField[])`.

### 2.4 Strings and quoting

- **Strings that need quoting/escaping**: Always produce them via `genString(input, options)` so options like `singleQuotes` are respected.
- **Module specifiers / paths**: Pass as `string`; the implementation uses `genString` for the quoted output.

---

## 3. Return value

- **Type**: Always `string`—the generated code snippet (single or multi-line).
- **Purity**: Do not mutate inputs or cause side effects; same input and options should yield stable output.
- **Completeness**: The returned string should be a fragment that can be spliced directly into source (may include newlines and indent), e.g. a full `import` statement, a `{}` block, or a type definition.

---

## 4. Documentation and comments

### 4.1 JSDoc

- **Short description**: One sentence stating what is generated.
- **`@example`**: At least one example in “call + output” form, with output indicated by `// ~> `, e.g.:
  ```js
  * genString("foo");
  * // ~> `"foo"`
  ```
- **`@param`**: Document non-obvious parameters and optional behavior.
- **`@group`**: For docs grouping, e.g. `@group ESM`, `@group Typescript`, `@group serialization`, `@group string`, `@group utils`.

### 4.2 Types and interfaces

- Use named interfaces for structured descriptors (e.g. `TypeField`, `FunctionOpts`, `GenInterfaceOptions`) for reuse and docs.
- Use `type` for simple unions or mappings (e.g. `ESMImport`, `LiteralField`, `EnumMemberValue`).

---

## 5. Implementation habits

### 5.1 Indent and formatting

- If a function supports `indent`, use `indent + "  "` (two spaces) for nested blocks.
- Use helpers like `wrapInDelimiters` for multi-line structures (objects, blocks, enums) so formatting is consistent.

### 5.2 Keys and identifiers

- Object literal keys: Use `genObjectKey(key)` to decide quoting (unquoted for valid identifiers, otherwise `genString`).
- Identifier validity: Use `VALID_IDENTIFIER_RE` from `_utils` when needed.

### 5.3 Passing options through

- Functions that accept `CodegenOptions` (or options extending it) should pass the same options into `genString`, `genEnum`, etc., so global style (e.g. quote type) stays consistent.

### 5.4 Internal reuse

- Prefer reusing existing `gen*` helpers where possible (e.g. `genConstEnum` calls `genEnum`, `genInlineTypeImport` uses `genDynamicImport`) to avoid duplication and inconsistent behavior.

---

## 6. Quick reference

| Aspect        | Guideline |
|---------------|-----------|
| Naming        | Public API: `gen` + verb/noun; internal: `_gen*` or non-gen |
| Param order   | Subject (required → optional) → options → indent |
| Options       | Named interface, extend CodegenOptions, default `{}`, all optional |
| Return value  | Always `string`; pure; fragment suitable for splicing |
| Documentation | Description + `@example` (`// ~> `) + `@param` + `@group` |
| String output | Via `genString`; keys via `genObjectKey` |
| Polymorphism  | `T \| T[]` or object/array union; normalize to array or branch inside |

These guidelines align with the current knitwork source style; following them when adding or refactoring `gen*` methods helps keep the API consistent and maintainable.
