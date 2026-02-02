import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const decoratorPresets: Preset[] = [
  {
    module: 'decorator',
    label: 'genDecorator',
    code: `genDecorator('Component')
genDecorator('Route', '("/api")')`,
    output: () => [
      knitwork.genDecorator('Component'),
      knitwork.genDecorator('Route', '("/api")'),
    ],
  },
]
