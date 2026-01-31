import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const modulePresets: Preset[] = [
  {
    module: 'module',
    label: 'genModule',
    code: `genModule('@nuxt/utils')
genModule('@nuxt/utils', 'interface MyInterface {}')`,
    output: () => [
      knitwork.genModule('@nuxt/utils'),
      knitwork.genModule('@nuxt/utils', 'interface MyInterface {}'),
    ],
  },
  {
    module: 'module',
    label: 'genAugmentation',
    code: `genAugmentation('@nuxt/utils')
genAugmentation('@nuxt/utils', 'interface MyInterface {}')`,
    output: () => [
      knitwork.genAugmentation('@nuxt/utils'),
      knitwork.genAugmentation('@nuxt/utils', 'interface MyInterface {}'),
    ],
  },
]
