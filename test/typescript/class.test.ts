import { expect, describe, it } from "vitest";
import {
  genClass,
  genConstructor,
  genClassProperty,
  genClassMethod,
  genGetter,
  genSetter,
  genDecorator,
} from "../../src";
import { genTestTitle } from "../_utils";

const genClassTests: Array<{
  input: Parameters<typeof genClass>;
  code: string;
}> = [
  { input: ["Foo"], code: "class Foo {}" },
  {
    input: ["Foo", []],
    code: "class Foo {}",
  },
  {
    input: ["Bar", [genConstructor([], ["super();"])]],
    code: `class Bar {
  constructor() {
    super();
  }
}`,
  },
  {
    input: ["Baz", [], { extends: "Base" }],
    code: "class Baz extends Base {}",
  },
  {
    input: ["Baz", [], { implements: "I1" }],
    code: "class Baz implements I1 {}",
  },
  {
    input: ["Baz", [], { implements: ["I1", "I2"] }],
    code: "class Baz implements I1, I2 {}",
  },
  {
    input: ["Baz", [], { extends: "Base", implements: ["I1", "I2"] }],
    code: "class Baz extends Base implements I1, I2 {}",
  },
  {
    input: ["Exported", [], { export: true }],
    code: "export class Exported {}",
  },
  {
    input: [
      "WithMembers",
      [
        genConstructor(
          [{ name: "x", type: "string" }],
          ["super();", "this.x = x;"],
        ),
        genClassProperty("x", { type: "string" }),
      ],
    ],
    code: `class WithMembers {
  constructor(x: string) {
    super();
    this.x = x;
  }
  x: string
}`,
  },
];

describe("genClass", () => {
  for (const t of genClassTests) {
    it(genTestTitle(t.code), () => {
      const code = genClass(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genConstructorTests: Array<{
  input: Parameters<typeof genConstructor>;
  code: string;
}> = [
  { input: [], code: "constructor() {}" },
  {
    input: [[], []],
    code: "constructor() {}",
  },
  {
    input: [[], ["super();"]],
    code: `constructor() {
  super();
}`,
  },
  {
    input: [[{ name: "x", type: "string" }], ["super();", "this.x = x;"]],
    code: `constructor(x: string) {
  super();
  this.x = x;
}`,
  },
  {
    input: [
      [
        { name: "a", type: "number" },
        { name: "b", type: "number" },
      ],
      [],
      { super: "a, b" },
    ],
    code: `constructor(a: number, b: number) {
  super(a, b);
}`,
  },
  {
    input: [[], ["this.foo = 1;"], {}],
    code: `constructor() {
  this.foo = 1;
}`,
  },
];

describe("genConstructor", () => {
  for (const t of genConstructorTests) {
    it(genTestTitle(t.code), () => {
      const code = genConstructor(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genClassPropertyTests: Array<{
  input: Parameters<typeof genClassProperty>;
  code: string;
}> = [
  { input: ["x", { type: "number" }], code: "x: number" },
  { input: ["y", { value: "0" }], code: "y = 0" },
  {
    input: ["z", { type: "string", value: "'z'" }],
    code: "z: string = 'z'",
  },
  {
    input: ["id", { type: "string", readonly: true, static: true }],
    code: "static readonly id: string",
  },
  {
    input: ["opt", { type: "boolean", optional: true }],
    code: "opt?: boolean",
  },
  {
    input: ["internal", { type: "number", private: true }],
    code: "private internal: number",
  },
  {
    input: ["protected", { type: "string", protected: true }],
    code: "protected protected: string",
  },
];

describe("genClassProperty", () => {
  for (const t of genClassPropertyTests) {
    it(genTestTitle(t.code), () => {
      const code = genClassProperty(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genClassMethodTests: Array<{
  input: Parameters<typeof genClassMethod>;
  code: string;
}> = [
  { input: [{ name: "foo" }], code: "foo() {}" },
  {
    input: [
      {
        name: "bar",
        parameters: [{ name: "x", type: "string" }],
        body: ["return x;"],
        returnType: "string",
      },
    ],
    code: `bar(x: string): string {
  return x;
}`,
  },
  {
    input: [
      {
        name: "value",
        kind: "get",
        body: ["return this._v;"],
        returnType: "number",
      },
    ],
    code: `get value(): number {
  return this._v;
}`,
  },
  {
    input: [
      {
        name: "value",
        kind: "set",
        parameters: [{ name: "v", type: "number" }],
        body: ["this._v = v;"],
      },
    ],
    code: `set value(v: number) {
  this._v = v;
}`,
  },
  {
    input: [{ name: "staticMethod", static: true, body: ["return 1;"] }],
    code: `static staticMethod() {
  return 1;
}`,
  },
  {
    input: [
      {
        name: "asyncFn",
        async: true,
        body: ["return await Promise.resolve(1);"],
        returnType: "Promise<number>",
      },
    ],
    code: `async asyncFn(): Promise<number> {
  return await Promise.resolve(1);
}`,
  },
  {
    input: [
      {
        name: "identity",
        generics: [{ name: "T", extends: "unknown" }],
        parameters: [{ name: "x", type: "T" }],
        returnType: "T",
        body: ["return x;"],
      },
    ],
    code: `identity<T extends unknown>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: "create",
        generics: [
          { name: "T", extends: "object", default: "Record<string, any>" },
        ],
        parameters: [{ name: "data", type: "Partial<T>" }],
        returnType: "T",
        body: ["return data as T;"],
      },
    ],
    code: `create<T extends object = Record<string, any>>(data: Partial<T>): T {
  return data as T;
}`,
  },
  {
    input: [
      {
        name: "factory",
        generics: [{ name: "T", default: "unknown" }],
        parameters: [],
        returnType: "T",
        body: ["return null as T;"],
      },
    ],
    code: `factory<T = unknown>(): T {
  return null as T;
}`,
  },
];

describe("genClassMethod", () => {
  for (const t of genClassMethodTests) {
    it(genTestTitle(t.code), () => {
      const code = genClassMethod(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genGetterTests: Array<{
  input: Parameters<typeof genGetter>;
  code: string;
}> = [
  {
    input: ["value", ["return this._v;"]],
    code: `get value() {
  return this._v;
}`,
  },
  {
    input: ["id", ["return this._id;"], { returnType: "string" }],
    code: `get id(): string {
  return this._id;
}`,
  },
  { input: ["empty", []], code: "get empty() {}" },
];

describe("genGetter", () => {
  for (const t of genGetterTests) {
    it(genTestTitle(t.code), () => {
      const code = genGetter(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genSetterTests: Array<{
  input: Parameters<typeof genSetter>;
  code: string;
}> = [
  {
    input: ["value", "v", ["this._v = v;"]],
    code: `set value(v) {
  this._v = v;
}`,
  },
  {
    input: ["id", "x", ["this._id = x;"], { paramType: "string" }],
    code: `set id(x: string) {
  this._id = x;
}`,
  },
  { input: ["empty", "v", []], code: "set empty(v) {}" },
];

describe("genSetter", () => {
  for (const t of genSetterTests) {
    it(genTestTitle(t.code), () => {
      const code = genSetter(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});

const genDecoratorTests: Array<{
  input: Parameters<typeof genDecorator>;
  code: string;
}> = [
  {
    input: ["Component"],
    code: "@Component",
  },
  {
    input: ["Injectable", "()"],
    code: "@Injectable()",
  },
  {
    input: ["Route", '("/api")'],
    code: '@Route("/api")',
  },
  {
    input: ["Validate", "(min: 0, max: 100)"],
    code: "@Validate(min: 0, max: 100)",
  },
  {
    input: ["Decorator", "()", "  "],
    code: "  @Decorator()",
  },
];

describe("genDecorator", () => {
  for (const t of genDecoratorTests) {
    it(genTestTitle(t.code), () => {
      const code = genDecorator(...t.input);
      expect(code).to.equal(t.code);
    });
  }
});
