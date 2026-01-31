import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const variablePresets: Preset[] = [
  {
    module: 'variable',
    label: 'genVariableName',
    code: `genVariableName('valid_import')
genVariableName('for')`,
    output: () => [
      knitwork.genVariableName('valid_import'),
      knitwork.genVariableName('for'),
    ],
  },
  {
    module: 'variable',
    label: 'genVariable',
    code: `genVariable('a', '2')
genVariable('x', '1', {
  kind: 'let'
})
genVariable('y', '2', {
  export: true
})`,
    output: () => [
      knitwork.genVariable('a', '2'),
      knitwork.genVariable('x', '1', { kind: 'let' }),
      knitwork.genVariable('y', '2', { export: true }),
    ],
  },
]
