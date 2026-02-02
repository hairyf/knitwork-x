import { describe, expect, it } from 'vitest'
import { genClass, genConstructor, genProperty, genSetter } from '../src'
import { genTestTitle } from './_utils'

const genClassTests: Array<{
  input: Parameters<typeof genClass>
  code: string
}> = [
  { input: ['Foo'], code: 'class Foo {}' },
  {
    input: ['Foo', []],
    code: 'class Foo {}',
  },
  {
    input: ['Bar', [genConstructor([], ['super();'])]],
    code: `class Bar {
  constructor() {
    super();
  }
}`,
  },
  {
    input: ['Baz', [], { extends: 'Base' }],
    code: 'class Baz extends Base {}',
  },
  {
    input: ['Baz', [], { implements: 'I1' }],
    code: 'class Baz implements I1 {}',
  },
  {
    input: ['Baz', [], { implements: ['I1', 'I2'] }],
    code: 'class Baz implements I1, I2 {}',
  },
  {
    input: ['Baz', [], { extends: 'Base', implements: ['I1', 'I2'] }],
    code: 'class Baz extends Base implements I1, I2 {}',
  },
  {
    input: ['Exported', [], { export: true }],
    code: 'export class Exported {}',
  },
  {
    input: [
      'WithMembers',
      [
        genConstructor(
          [{ name: 'x', type: 'string' }],
          ['super();', 'this.x = x;'],
        ),
        genProperty({ name: 'x', type: 'string' }),
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
]

describe('genClass', () => {
  for (const t of genClassTests) {
    it(genTestTitle(t.code), () => {
      const code = genClass(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genConstructorTests: Array<{
  input: Parameters<typeof genConstructor>
  code: string
}> = [
  { input: [], code: 'constructor() {}' },
  {
    input: [[], []],
    code: 'constructor() {}',
  },
  {
    input: [[], ['super();']],
    code: `constructor() {
  super();
}`,
  },
  {
    input: [[{ name: 'x', type: 'string' }], ['super();', 'this.x = x;']],
    code: `constructor(x: string) {
  super();
  this.x = x;
}`,
  },
  {
    input: [
      [
        { name: 'a', type: 'number' },
        { name: 'b', type: 'number' },
      ],
      [],
      { super: 'a, b' },
    ],
    code: `constructor(a: number, b: number) {
  super(a, b);
}`,
  },
  {
    input: [[], ['this.foo = 1;'], {}],
    code: `constructor() {
  this.foo = 1;
}`,
  },
]

describe('genConstructor', () => {
  for (const t of genConstructorTests) {
    it(genTestTitle(t.code), () => {
      const code = genConstructor(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genPropertyClassTests: Array<{
  input: Parameters<typeof genProperty>
  code: string
}> = [
  { input: [{ name: 'x', type: 'number' }], code: 'x: number' },
  { input: [{ name: 'y', value: '0' }], code: 'y = 0' },
  {
    input: [{ name: 'z', type: 'string', value: '\'z\'' }],
    code: 'z: string = \'z\'',
  },
  {
    input: [{ name: 'id', type: 'string', readonly: true, static: true }],
    code: 'static readonly id: string',
  },
  {
    input: [{ name: 'opt', type: 'boolean', optional: true }],
    code: 'opt?: boolean',
  },
  {
    input: [{ name: 'internal', type: 'number', private: true }],
    code: 'private internal: number',
  },
  {
    input: [{ name: 'protected', type: 'string', protected: true }],
    code: 'protected protected: string',
  },
]

describe('genProperty (class property)', () => {
  for (const t of genPropertyClassTests) {
    it(genTestTitle(t.code), () => {
      const code = genProperty(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genSetterTests: Array<{
  input: Parameters<typeof genSetter>
  code: string
}> = [
  {
    input: ['value', 'v', ['this._v = v;']],
    code: `set value(v) {
  this._v = v;
}`,
  },
  {
    input: ['id', 'x', ['this._id = x;'], { paramType: 'string' }],
    code: `set id(x: string) {
  this._id = x;
}`,
  },
  { input: ['empty', 'v', []], code: 'set empty(v) {}' },
]

describe('genSetter', () => {
  for (const t of genSetterTests) {
    it(genTestTitle(t.code), () => {
      const code = genSetter(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
