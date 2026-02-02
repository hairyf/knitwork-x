import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const objectPresets: Preset[] = [
  {
    module: 'object',
    label: 'genObject',
    code: `genObject({ foo: 'bar' })
genObject({
  a: 1,
  b: 'x'
})
genObject([
  { name: 'foo', value: 'bar' },
  { 
    name: 'count',
    value: '0',
    jsdoc: 'Counter value'
  }
])`,
    output: () => [
      knitwork.genObject({ foo: 'bar' }),
      knitwork.genObject({ a: 1, b: 'x' }),
      knitwork.genObject([
        { name: 'foo', value: 'bar' },
        { name: 'count', value: '0', jsdoc: 'Counter value' },
      ]),
    ],
  },
  {
    module: 'object',
    label: 'genArray',
    code: `genArray([1, 2, 3])
genArray([
  'a',
  'b'
])`,
    output: () => [knitwork.genArray([1, 2, 3]), knitwork.genArray(['a', 'b'])],
  },
  {
    module: 'object',
    label: 'genMap',
    code: `genMap([
  ['foo', 'bar'],
  ['baz', 1]
])`,
    output: () => [
      knitwork.genMap([
        ['foo', 'bar'],
        ['baz', 1],
      ]),
    ],
  },
  {
    module: 'object',
    label: 'genSet',
    code: `genSet([
  'foo',
  'bar',
  1
])`,
    output: () => [knitwork.genSet(['foo', 'bar', 1])],
  },
  {
    module: 'object',
    label: 'genMethod',
    code: `genMethod({ name: 'foo' })
genMethod({
  name: 'bar',
  parameters: [{ name: 'x', type: 'string' }],
  body: ['return x;']
})`,
    output: () => [
      knitwork.genMethod({ name: 'foo' }),
      knitwork.genMethod({
        name: 'bar',
        parameters: [{ name: 'x', type: 'string' }],
        body: ['return x;'],
      }),
    ],
  },
  {
    module: 'object',
    label: 'genGetter',
    code: `genGetter('value', ['return this._v;'])
genGetter('id', ['return this._id;'], {
  returnType: 'string'
})`,
    output: () => [
      knitwork.genGetter('value', ['return this._v;']),
      knitwork.genGetter('id', ['return this._id;'], { returnType: 'string' }),
    ],
  },
  {
    module: 'object',
    label: 'genSetter',
    code: `genSetter('value', 'v', ['this._v = v;'])
genSetter('id', 'x', ['this._id = x;'], {
  paramType: 'string'
})`,
    output: () => [
      knitwork.genSetter('value', 'v', ['this._v = v;']),
      knitwork.genSetter('id', 'x', ['this._id = x;'], { paramType: 'string' }),
    ],
  },
]
