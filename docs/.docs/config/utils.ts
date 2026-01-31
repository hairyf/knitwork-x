import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const utilsPresets: Preset[] = [
  {
    module: 'utils',
    label: 'genRegExp',
    code: `genRegExp('foo')
genRegExp('foo', 'gi')`,
    output: () => [
      knitwork.genRegExp('foo'),
      knitwork.genRegExp('foo', 'gi'),
    ],
  },
  {
    module: 'utils',
    label: 'genJSDocComment',
    code: `genJSDocComment('Single line')
genJSDocComment('@param x - number')`,
    output: () => [
      knitwork.genJSDocComment('Single line'),
      knitwork.genJSDocComment('@param x - number'),
    ],
  },
  {
    module: 'utils',
    label: 'genKey',
    code: `genKey('foo-bar')
genKey('default')`,
    output: () => [
      knitwork.genKey('foo-bar'),
      knitwork.genKey('default'),
    ],
  },
  {
    module: 'utils',
    label: 'genComment',
    code: `genComment('Single line comment')
genComment('TODO: fix')`,
    output: () => [
      knitwork.genComment('Single line comment'),
      knitwork.genComment('TODO: fix'),
    ],
  },
]
