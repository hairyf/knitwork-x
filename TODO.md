# Codegen functions not yet supported

A todo list of generation helpers that are not yet implemented in knitwork. Use this as a backlog for new `gen*` APIs.

---

## Control flow

- [ ] **genTry** – `try { body }` with optional catch/finally
- [ ] **genCatch** – `catch (e) { body }` (e.g. for use with genTry)
- [ ] **genFinally** – `finally { body }`
- [ ] **genSwitch** – `switch (expr) { cases }`
- [ ] **genCase** – `case value:` (and fall-through)
- [ ] **genDefault** – `default:` in switch
- [ ] **genFor** – `for (init; test; update) { body }` (C-style for)
- [ ] **genForOf** – `for (const x of iterable) { body }`
- [ ] **genForIn** – `for (const x in obj) { body }`
- [ ] **genWhile** – `while (cond) { body }`
- [ ] **genDoWhile** – `do { body } while (cond);`
- [ ] **genTernary** – `cond ? a : b` (optional helper; often inlined)

---

## Classes & OOP

- [ ] **genClass** – `class Name [extends Base] [implements I1, I2] { ... }`
- [ ] **genConstructor** – constructor(params) { super(); ... }
- [ ] **genClassProperty** – `name: Type` or `name = value` (with optional modifiers)
- [ ] **genClassMethod** – method (including get/set) with optional async/generator
- [ ] **genGetter** / **genSetter** – get/set in class or object

---

## Functions (additional)

- [ ] **genArrowFunction** – `(params) => body` or `(params) => { statements }`
- [ ] **genMethod** – shorthand for object method: `name(params) { body }` (no `function` keyword)

---

## TypeScript types (advanced)

- [ ] **genUnion** – `A | B | C` from array of type strings
- [ ] **genIntersection** – `A & B & C` from array of type strings
- [ ] **genMappedType** – `{ [K in keyof T]: U }`
- [ ] **genConditionalType** – `T extends U ? X : Y`
- [ ] **genIndexSignature** – `[key: string]: Type` (e.g. for interfaces)
- [ ] **genCallSignature** – `(params): ReturnType` (e.g. in interface)
- [ ] **genConstructSignature** – `new (params): Instance` (e.g. in interface)
- [ ] **genTemplateLiteralType** – `` `prefix${T}suffix` `` (TS 4.1+)
- [ ] **genKeyOf** – `keyof T` helper
- [ ] **genTypeof** – `typeof expr` (type position) helper

---

## ESM & exports

- [ ] **genDefaultExport** – `export default expr;` or `export default function name () {}`
- [ ] **genExportStar** – `export * from "specifier";` (re-export all)
- [ ] **genExportStarAs** – `export * as ns from "specifier";` (already possible via genExport with `{ name: "*", as }`; consider documenting or aliasing)

---

## Statements & expressions (optional helpers)

- [ ] **genThrow** – `throw expr;`
- [ ] **genReturn** – `return expr;` (trivial but consistent with other gen*)
- [ ] **genTypeAssertion** – `expr as Type`
- [ ] **genSatisfies** – `expr satisfies Type` (TS 4.9+)
- [ ] **genDecorator** – `@decorator` (for class/method/parameter)
- [ ] **genComment** – single-line `//` or block `/* */` (non-JSDoc; JSDoc covered by genJSDocComment)
- [ ] **genTemplateLiteral** – runtime template literal `` `hello ${x}` `` (value, not type)

---

## Namespace & modules (TS)

- [ ] **genNamespace** – `namespace Name { }` (non-declare; TS namespace)
- [ ] **genModule** – `declare module "id" { }` is covered by genAugmentation; optional alias or extended options

---

## Serialization / literals (object.ts)

- [ ] **genMapFromRaw** / **genSetFromRaw** – `new Map([...])` / `new Set([...])` from raw entries/values
- [ ] **genRegExp** – regex literal from pattern + flags (escape and wrap)

---

## Notes

- **genExport** already supports named exports and `export * as ns`; **genDefaultExport** would fill the default-export gap.
- **genBlock**, **genIf** / **genElseIf** / **genElse**, **genFunction**, **genVariable**, **genInterface**, **genEnum**, **genTypeAlias**, **genAugmentation**, **genDeclareNamespace** are already implemented.
- Prioritise based on real usage (e.g. in Nuxt/unjs or other codegen consumers).
