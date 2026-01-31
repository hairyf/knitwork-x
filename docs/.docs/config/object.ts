import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const objectPresets: Preset[] = [
  {
    module: 'object',
    label: 'genLiteral',
    code: `genLiteral([
  'type',
  ['type', 'A'],
  ['...', 'b']
])
genLiteral(['a', 'b', 'c'])`,
    output: () => [
      knitwork.genLiteral(['type', ['type', 'A'], ['...', 'b']]),
      knitwork.genLiteral(['a', 'b', 'c']),
    ],
  },
  {
    module: 'object',
    label: 'genObject',
    code: `genObject({ foo: 'bar' })
genObject({
  a: 1,
  b: 'x'
})`,
    output: () => [
      knitwork.genObject({ foo: 'bar' }),
      knitwork.genObject({ a: 1, b: 'x' }),
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
    output: () => [
      knitwork.genArray([1, 2, 3]),
      knitwork.genArray(['a', 'b']),
    ],
  },
  {
    module: 'object',
    label: 'genMap',
    code: `genMap([
  ['foo', 'bar'],
  ['baz', 1]
])`,
    output: () => [knitwork.genMap([['foo', 'bar'], ['baz', 1]])],
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
]
