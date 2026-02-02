import { describe, expect, it } from 'vitest'
import {
  genArrowFunction,
  genBlock,
  genFunction,
  genMethod,
  genParam,
} from '../src'
import { genTestTitle } from './_utils'

const genBlockTests: Array<{
  input: Parameters<typeof genBlock>
  code: string
}> = [
  { input: [], code: '{}' },
  { input: [[]], code: '{}' },
  {
    input: [['return x;']],
    code: `{
  return x;
}`,
  },
  {
    input: ['return x;'],
    code: `{
  return x;
}`,
  },
  {
    input: [['const a = 1;', 'return a;']],
    code: `{
  const a = 1;
  return a;
}`,
  },
  {
    input: [['return x;'], '  '],
    code: `{
    return x;
  }`,
  },
  {
    input: [['if (x) {', '  return 1;', '}']],
    code: `{
  if (x) {
    return 1;
  }
}`,
  },
]

describe('genBlock', () => {
  for (const t of genBlockTests) {
    it(genTestTitle(t.code), () => {
      const code = genBlock(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genParamTests: Array<{
  input: Parameters<typeof genParam>
  code: string
}> = [
  { input: [{ name: 'x', type: 'string' }], code: 'x: string' },
  {
    input: [{ name: 'y', type: 'number', optional: true }],
    code: 'y?: number',
  },
  {
    input: [{ name: 'z', type: 'number', default: '0' }],
    code: 'z: number = 0',
  },
  { input: [{ name: 'a' }], code: 'a' },
  {
    input: [{ name: 'opt', type: 'string', optional: true, default: '\'x\'' }],
    code: 'opt?: string = \'x\'',
  },
]

describe('genParam', () => {
  for (const t of genParamTests) {
    it(genTestTitle(t.code), () => {
      const code = genParam(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genFunctionTests: Array<{
  input: Parameters<typeof genFunction>
  code: string
}> = [
  {
    input: [{ name: 'foo' }],
    code: 'function foo() {}',
  },
  {
    input: [
      {
        name: 'foo',
        parameters: [
          { name: 'x', type: 'string' },
          { name: 'y', type: 'number', optional: true },
        ],
      },
    ],
    code: 'function foo(x: string, y?: number) {}',
  },
  {
    input: [
      {
        name: 'foo',
        parameters: [{ name: 'n', type: 'number', default: '0' }],
        body: ['return n + 1;'],
      },
    ],
    code: `function foo(n: number = 0) {
  return n + 1;
}`,
  },
  {
    input: [
      {
        name: 'foo',
        export: true,
        jsdoc: 'Exported foo',
      },
    ],
    code: `/** Exported foo */
export function foo() {}`,
  },
  {
    input: [
      {
        name: 'bar',
        jsdoc: ['Line one', 'Line two'],
        async: true,
        returnType: 'Promise<void>',
      },
    ],
    code: `/**
 * Line one
 * Line two
 */
async function bar(): Promise<void> {}`,
  },
  {
    input: [
      {
        name: 'gen',
        generator: true,
        parameters: [{ name: 'max', type: 'number' }],
        returnType: 'Generator<number>',
        body: ['for (let i = 0; i < max; i++) yield i;'],
      },
    ],
    code: `function* gen(max: number): Generator<number> {
  for (let i = 0; i < max; i++) yield i;
}`,
  },
  {
    input: [
      {
        name: 'id',
        generics: [{ name: 'T' }],
        parameters: [{ name: 'x', type: 'T' }],
        returnType: 'T',
        body: ['return x;'],
      },
    ],
    code: `function id<T>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'pick',
        generics: [
          { name: 'T', extends: 'object' },
          { name: 'K', extends: 'keyof T' },
        ],
        parameters: [
          { name: 'obj', type: 'T' },
          { name: 'key', type: 'K' },
        ],
        returnType: 'T[K]',
        body: ['return obj[key];'],
      },
    ],
    code: `function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
  },
  {
    input: [
      {
        name: 'identity',
        generics: [{ name: 'T', extends: 'unknown' }],
        parameters: [{ name: 'x', type: 'T' }],
        returnType: 'T',
        body: ['return x;'],
      },
    ],
    code: `function identity<T extends unknown>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'create',
        generics: [{ name: 'T', default: 'Record<string, any>' }],
        parameters: [{ name: 'data', type: 'T' }],
        returnType: 'T',
        body: ['return data;'],
      },
    ],
    code: `function create<T = Record<string, any>>(data: T): T {
  return data;
}`,
  },
]

describe('genFunction', () => {
  for (const t of genFunctionTests) {
    it(genTestTitle(t.code), () => {
      const code = genFunction(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genArrowFunctionTests: Array<{
  input: Parameters<typeof genArrowFunction>
  code: string
}> = [
  { input: [{ body: 'x + 1' }], code: '() => x + 1' },
  {
    input: [{ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' }],
    code: '(x: number) => x * 2',
  },
  {
    input: [{ parameters: [{ name: 'x' }], body: ['return x + 1;'] }],
    code: `(x) => {
  return x + 1;
}`,
  },
  {
    input: [
      {
        parameters: [{ name: 'x', type: 'string' }],
        body: 'x.length',
        returnType: 'number',
      },
    ],
    code: '(x: string): number => x.length',
  },
  {
    input: [
      {
        async: true,
        parameters: [{ name: 'url', type: 'string' }],
        body: ['return fetch(url);'],
      },
    ],
    code: `async (url: string) => {
  return fetch(url);
}`,
  },
  {
    input: [
      {
        parameters: [
          { name: 'a', type: 'number' },
          { name: 'b', type: 'number' },
        ],
        body: 'a + b',
        returnType: 'number',
      },
    ],
    code: '(a: number, b: number): number => a + b',
  },
  {
    input: [
      {
        generics: [{ name: 'T' }],
        parameters: [{ name: 'x', type: 'T' }],
        body: 'x',
        returnType: 'T',
      },
    ],
    code: '<T>(x: T): T => x',
  },
  {
    input: [{ parameters: [{ name: 'x', optional: true }], body: 'x ?? 0' }],
    code: '(x?) => x ?? 0',
  },
  {
    input: [{ body: undefined }],
    code: '() => {}',
  },
  {
    input: [
      {
        generics: [{ name: 'T', extends: 'object' }],
        parameters: [{ name: 'x', type: 'T' }],
        body: 'x',
        returnType: 'T',
      },
    ],
    code: '<T extends object>(x: T): T => x',
  },
  {
    input: [
      {
        generics: [{ name: 'T', default: 'unknown' }],
        parameters: [{ name: 'x', type: 'T' }],
        body: 'x',
        returnType: 'T',
      },
    ],
    code: '<T = unknown>(x: T): T => x',
  },
]

describe('genArrowFunction', () => {
  for (const t of genArrowFunctionTests) {
    it(genTestTitle(t.code), () => {
      const code = genArrowFunction(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})

const genMethodTests: Array<{
  input: Parameters<typeof genMethod>
  code: string
}> = [
  { input: [{ name: 'foo' }], code: 'foo() {}' },
  {
    input: [
      {
        name: 'bar',
        parameters: [{ name: 'x', type: 'string' }],
        body: ['return x;'],
      },
    ],
    code: `bar(x: string) {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'add',
        parameters: [
          { name: 'a', type: 'number' },
          { name: 'b', type: 'number' },
        ],
        returnType: 'number',
        body: ['return a + b;'],
      },
    ],
    code: `add(a: number, b: number): number {
  return a + b;
}`,
  },
  {
    input: [
      {
        name: 'fetch',
        async: true,
        parameters: [{ name: 'url', type: 'string' }],
        body: ['return await fetch(url);'],
      },
    ],
    code: `async fetch(url: string) {
  return await fetch(url);
}`,
  },
  {
    input: [
      {
        name: 'gen',
        generator: true,
        parameters: [{ name: 'max', type: 'number' }],
        returnType: 'Generator<number>',
        body: ['for (let i = 0; i < max; i++) yield i;'],
      },
    ],
    code: `gen*(max: number): Generator<number> {
  for (let i = 0; i < max; i++) yield i;
}`,
  },
  {
    input: [
      {
        name: 'id',
        generics: [{ name: 'T' }],
        parameters: [{ name: 'x', type: 'T' }],
        returnType: 'T',
        body: ['return x;'],
      },
    ],
    code: `id<T>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'test',
        jsdoc: 'Test method',
        parameters: [{ name: 'x', type: 'number' }],
        body: ['return x;'],
      },
    ],
    code: `/** Test method */
test(x: number) {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'empty',
      },
      '  ',
    ],
    code: `  empty() {}`,
  },
  {
    input: [
      {
        name: 'identity',
        generics: [{ name: 'T', extends: 'unknown' }],
        parameters: [{ name: 'x', type: 'T' }],
        returnType: 'T',
        body: ['return x;'],
      },
    ],
    code: `identity<T extends unknown>(x: T): T {
  return x;
}`,
  },
  {
    input: [
      {
        name: 'create',
        generics: [{ name: 'T', default: 'Record<string, any>' }],
        parameters: [{ name: 'data', type: 'T' }],
        returnType: 'T',
        body: ['return data;'],
      },
    ],
    code: `create<T = Record<string, any>>(data: T): T {
  return data;
}`,
  },
]

describe('genMethod', () => {
  for (const t of genMethodTests) {
    it(genTestTitle(t.code), () => {
      const code = genMethod(...t.input)
      expect(code).to.equal(t.code)
    })
  }
})
