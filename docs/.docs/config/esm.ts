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
])`,
    output: () => [
      knitwork.genImport('vue', ['ref']),
      knitwork.genImport('vue', ['ref', 'computed', 'watch']),
    ],
  },
  {
    module: 'esm',
    label: 'genImport (type)',
    code: `genImport('@nuxt/utils', ['test'], { type: true })
genImport('@nuxt/utils', [
  { name: 'test', as: 'value' }
], { type: true })`,
    output: () => [
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
})`,
    output: () => [
      knitwork.genDynamicImport('pkg'),
      knitwork.genDynamicImport('pkg', { wrapper: true }),
    ],
  },
  {
    module: 'esm',
    label: 'genDynamicImport (type)',
    code: `genDynamicImport('pkg', { type: true })
genDynamicImport('pkg', { type: true, name: 'foo' })`,
    output: () => [
      knitwork.genDynamicImport('pkg', { type: true }),
      knitwork.genDynamicImport('pkg', { type: true, name: 'foo' }),
    ],
  },
  {
    module: 'esm',
    label: 'genExport',
    code: `genExport('pkg', ['a', 'b'])
genExport('utils', ['fn'])`,
    output: () => [
      knitwork.genExport('pkg', ['a', 'b']),
      knitwork.genExport('utils', ['fn']),
    ],
  },
  {
    module: 'esm',
    label: 'genExportStar',
    code: `genExportStar('pkg')
genExportStar('./utils', {
  singleQuotes: true
})`,
    output: () => [
      knitwork.genExportStar('pkg'),
      knitwork.genExportStar('./utils', { singleQuotes: true }),
    ],
  },
  {
    module: 'esm',
    label: 'genExportStarAs',
    code: `genExportStarAs('pkg', 'utils')
genExportStarAs('./helpers', 'Helpers', {
  singleQuotes: true
})`,
    output: () => [
      knitwork.genExportStarAs('pkg', 'utils'),
      knitwork.genExportStarAs('./helpers', 'Helpers', { singleQuotes: true }),
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
