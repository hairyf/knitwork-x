import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const esmPresets: Preset[] = [
  {
    module: 'esm',
    label: 'genImport',
    code: `genImport('vue', ['ref'])
genImport('vue', [
  'ref',
  'computed',
  'watch'
])
genImport('@nuxt/utils', ['test'], { type: true })
genImport('@nuxt/utils', [
  { name: 'test', as: 'value' }
], { type: true })`,
    output: () => [
      knitwork.genImport('vue', ['ref']),
      knitwork.genImport('vue', ['ref', 'computed', 'watch']),
      knitwork.genImport('@nuxt/utils', ['test'], { type: true }),
      knitwork.genImport('@nuxt/utils', [{ name: 'test', as: 'value' }], { type: true }),
    ],
  },
  {
    module: 'esm',
    label: 'genDynamicImport',
    code: `genDynamicImport('pkg')
genDynamicImport('pkg', {
  wrapper: true
})
genDynamicImport('pkg', { type: true })
genDynamicImport('pkg', { type: true, name: 'foo' })`,
    output: () => [
      knitwork.genDynamicImport('pkg'),
      knitwork.genDynamicImport('pkg', { wrapper: true }),
      knitwork.genDynamicImport('pkg', { type: true }),
      knitwork.genDynamicImport('pkg', { type: true, name: 'foo' }),
    ],
  },
  {
    module: 'esm',
    label: 'genExport',
    code: `genExport('pkg', ['a', 'b'])
genExport('utils', ['fn'])
genExport('pkg', '*')
genExport('pkg', { name: '*', as: 'utils' })`,
    output: () => [
      knitwork.genExport('pkg', ['a', 'b']),
      knitwork.genExport('utils', ['fn']),
      knitwork.genExport('pkg', '*'),
      knitwork.genExport('pkg', { name: '*', as: 'utils' }),
    ],
  },
  {
    module: 'esm',
    label: 'genDefaultExport',
    code: `genDefaultExport('foo')
genDefaultExport('App')`,
    output: () => [
      knitwork.genDefaultExport('foo'),
      knitwork.genDefaultExport('App'),
    ],
  },
]
