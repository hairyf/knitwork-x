import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const typeAliasPresets: Preset[] = [
  {
    module: 'type-alias',
    label: 'genTypeAlias',
    code: `genTypeAlias('Foo', 'string')
genTypeAlias('Bar', {
  name: 'string',
  count: 'number'
})`,
    output: () => [
      knitwork.genTypeAlias('Foo', 'string'),
      knitwork.genTypeAlias('Bar', { name: 'string', count: 'number' }),
    ],
  },
  {
    module: 'type-alias',
    label: 'genUnion',
    code: `genUnion(['string', 'number'])
genUnion(['A', 'B', 'C'])`,
    output: () => [
      knitwork.genUnion(['string', 'number']),
      knitwork.genUnion(['A', 'B', 'C']),
    ],
  },
  {
    module: 'type-alias',
    label: 'genIntersection',
    code: `genIntersection(['A', 'B'])
genIntersection(['A', 'B', 'C'])`,
    output: () => [
      knitwork.genIntersection(['A', 'B']),
      knitwork.genIntersection(['A', 'B', 'C']),
    ],
  },
  {
    module: 'type-alias',
    label: 'genTypeObject',
    code: `genTypeObject({
  name: 'string',
  count: 'number'
})
genTypeObject({ 'key?': 'boolean' })`,
    output: () => [
      knitwork.genTypeObject({ name: 'string', count: 'number' }),
      knitwork.genTypeObject({ 'key?': 'boolean' }),
    ],
  },
  {
    module: 'type-alias',
    label: 'genKeyOf',
    code: `genKeyOf('T')
genKeyOf('MyObject')`,
    output: () => [
      knitwork.genKeyOf('T'),
      knitwork.genKeyOf('MyObject'),
    ],
  },
  {
    module: 'type-alias',
    label: 'genTypeof',
    code: `genTypeof('someVar')
genTypeof('myFunction')`,
    output: () => [
      knitwork.genTypeof('someVar'),
      knitwork.genTypeof('myFunction'),
    ],
  },
  {
    module: 'type-alias',
    label: 'genTypeAssertion',
    code: `genTypeAssertion('value', 'string')
genTypeAssertion('obj', 'MyType')`,
    output: () => [
      knitwork.genTypeAssertion('value', 'string'),
      knitwork.genTypeAssertion('obj', 'MyType'),
    ],
  },
  {
    module: 'type-alias',
    label: 'genSatisfies',
    code: `genSatisfies('{ a: 1 }', '{ a: number }')
genSatisfies('config', 'ConfigType')`,
    output: () => [
      knitwork.genSatisfies('{ a: 1 }', '{ a: number }'),
      knitwork.genSatisfies('config', 'ConfigType'),
    ],
  },
  {
    module: 'type-alias',
    label: 'genMappedType',
    code: `genMappedType('K', 'keyof T', 'U')
genMappedType('P', 'keyof T', 'T[P]')`,
    output: () => [
      knitwork.genMappedType('K', 'keyof T', 'U'),
      knitwork.genMappedType('P', 'keyof T', 'T[P]'),
    ],
  },
  {
    module: 'type-alias',
    label: 'genTemplateLiteralType',
    code: `genTemplateLiteralType([
  'prefix',
  'T',
  'suffix'
])
genTemplateLiteralType(['Hello ', 'T', ''])`,
    output: () => [
      knitwork.genTemplateLiteralType(['prefix', 'T', 'suffix']),
      knitwork.genTemplateLiteralType(['Hello ', 'T', '']),
    ],
  },
]
