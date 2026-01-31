import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const statementPresets: Preset[] = [
  {
    module: 'statement',
    label: 'genReturn',
    code: `genReturn('x')
genReturn()`,
    output: () => [
      knitwork.genReturn('x'),
      knitwork.genReturn(),
    ],
  },
  {
    module: 'statement',
    label: 'genThrow',
    code: `genThrow("new Error('failed')")
genThrow('e')`,
    output: () => [
      knitwork.genThrow("new Error('failed')"),
      knitwork.genThrow('e'),
    ],
  },
]
