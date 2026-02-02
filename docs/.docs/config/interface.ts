import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const interfacePresets: Preset[] = [
  {
    module: 'interface',
    label: 'genInterface',
    code: `genInterface('User', [
  { name: 'id', type: 'number' },
  { name: 'name', type: 'string' }
])`,
    output: () => [
      knitwork.genInterface('User', [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
      ]),
    ],
  },
  {
    module: 'interface',
    label: 'genCallSignature',
    code: `genCallSignature({
  parameters: [{ name: 'x', type: 'string' }],
  returnType: 'number'
})
genCallSignature({
  parameters: [],
  returnType: 'void'
})`,
    output: () => [
      knitwork.genCallSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'number' }),
      knitwork.genCallSignature({ parameters: [], returnType: 'void' }),
    ],
  },
  {
    module: 'interface',
    label: 'genConstructSignature',
    code: `genConstructSignature({
  parameters: [{ name: 'x', type: 'string' }],
  returnType: 'MyClass'
})
genConstructSignature({
  parameters: [{ name: 'value', type: 'number' }],
  returnType: 'Instance'
})`,
    output: () => [
      knitwork.genConstructSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'MyClass' }),
      knitwork.genConstructSignature({ parameters: [{ name: 'value', type: 'number' }], returnType: 'Instance' }),
    ],
  },
  {
    module: 'interface',
    label: 'genIndexSignature',
    code: `genIndexSignature('string', 'number')
genIndexSignature('number', 'string')`,
    output: () => [
      knitwork.genIndexSignature('string', 'number'),
      knitwork.genIndexSignature('number', 'string'),
    ],
  },
]
