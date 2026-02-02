import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const conditionPresets: Preset[] = [
  {
    module: 'condition',
    label: 'genIf',
    code: `genIf('x > 0', 'return x;')
genIf('ok', [
  'log();',
  'return;'
])`,
    output: () => [
      knitwork.genIf('x > 0', 'return x;'),
      knitwork.genIf('ok', ['log();', 'return;']),
    ],
  },
  {
    module: 'condition',
    label: 'genTernary',
    code: `genTernary('x > 0', 'x', '-x')
genTernary('ok', 'true', 'false')`,
    output: () => [
      knitwork.genTernary('x > 0', 'x', '-x'),
      knitwork.genTernary('ok', 'true', 'false'),
    ],
  },
]
