import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const stringPresets: Preset[] = [
  {
    module: 'string',
    label: 'genString',
    code: `genString('foo')
genString('foo', {
  singleQuotes: true
})`,
    output: () => [
      knitwork.genString('foo'),
      knitwork.genString('foo', { singleQuotes: true }),
    ],
  },
  {
    module: 'string',
    label: 'escapeString',
    code: `escapeString("foo'bar")
escapeString("foo\\nbar")`,
    output: () => [
      knitwork.escapeString('foo\'bar'),
      knitwork.escapeString('foo\nbar'),
    ],
  },
  {
    module: 'string',
    label: 'genTemplateLiteral',
    code: `genTemplateLiteral(['hello ', 'x'])`,
    output: () => [knitwork.genTemplateLiteral(['hello ', 'x'])],
  },
]
