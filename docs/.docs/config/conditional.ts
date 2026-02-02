import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const conditionalPresets: Preset[] = [
  {
    module: 'conditional',
    label: 'genConditionalType',
    code: `genConditionalType(
  'T',
  'U',
  'X',
  'Y'
)
genConditionalType(
  'T',
  'null',
  'never',
  'T'
)`,
    output: () => [
      knitwork.genConditionalType('T', 'U', 'X', 'Y'),
      knitwork.genConditionalType('T', 'null', 'never', 'T'),
    ],
  },
]
