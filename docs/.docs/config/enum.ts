import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const enumPresets: Preset[] = [
  {
    module: 'enum',
    label: 'genEnum',
    code: `genEnum('Color', {
  Red: 0,
  Green: 1,
  Blue: 2
})
genEnum('Status', {
  Active: 'active',
  Inactive: 'inactive'
})`,
    output: () => [
      knitwork.genEnum('Color', { Red: 0, Green: 1, Blue: 2 }),
      knitwork.genEnum('Status', { Active: 'active', Inactive: 'inactive' }),
    ],
  },
]
