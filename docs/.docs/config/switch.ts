import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const switchPresets: Preset[] = [
  {
    module: 'switch',
    label: 'genSwitch',
    code: `genSwitch('x', [
  genCase('1', 'break;'),
  genDefault('return 0;')
])`,
    output: () => [
      knitwork.genSwitch('x', [
        knitwork.genCase('1', 'break;'),
        knitwork.genDefault('return 0;'),
      ]),
    ],
  },
  {
    module: 'switch',
    label: 'genCase',
    code: `genCase('1', 'break;')
genCase("'a'", [
  'doA();',
  'break;'
])`,
    output: () => [
      knitwork.genCase('1', 'break;'),
      knitwork.genCase('\'a\'', ['doA();', 'break;']),
    ],
  },
  {
    module: 'switch',
    label: 'genDefault',
    code: `genDefault('return 0;')
genDefault([
  'log("default");',
  'break;'
])`,
    output: () => [
      knitwork.genDefault('return 0;'),
      knitwork.genDefault(['log("default");', 'break;']),
    ],
  },
]
