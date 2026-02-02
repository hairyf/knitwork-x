import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const loopPresets: Preset[] = [
  {
    module: 'loop',
    label: 'genFor',
    code: `genFor(
  'let i = 0',
  'i < n',
  'i++',
  'console.log(i);'
)
genFor(
  'let j = 0',
  'j < 10',
  'j++',
  'sum += j;'
)`,
    output: () => [
      knitwork.genFor('let i = 0', 'i < n', 'i++', 'console.log(i);'),
      knitwork.genFor('let j = 0', 'j < 10', 'j++', 'sum += j;'),
    ],
  },
  {
    module: 'loop',
    label: 'genForOf',
    code: `genForOf('const x', 'items', 'console.log(x);')
genForOf('const item', 'list', 'process(item);')`,
    output: () => [
      knitwork.genForOf('const x', 'items', 'console.log(x);'),
      knitwork.genForOf('const item', 'list', 'process(item);'),
    ],
  },
  {
    module: 'loop',
    label: 'genForIn',
    code: `genForIn('const key', 'obj', 'console.log(key, obj[key]);')
genForIn('const k', 'o', [
  'sum += o[k];'
])`,
    output: () => [
      knitwork.genForIn('const key', 'obj', 'console.log(key, obj[key]);'),
      knitwork.genForIn('const k', 'o', ['sum += o[k];']),
    ],
  },
  {
    module: 'loop',
    label: 'genWhile',
    code: `genWhile('running', 'step();')
genWhile('hasMore', [
  'fetch();',
  'hasMore = false;'
])`,
    output: () => [
      knitwork.genWhile('running', 'step();'),
      knitwork.genWhile('hasMore', ['fetch();', 'hasMore = false;']),
    ],
  },
  {
    module: 'loop',
    label: 'genDoWhile',
    code: `genDoWhile('step();', '!done')
genDoWhile(
  ['read();', 'check();'],
  'eof'
)`,
    output: () => [
      knitwork.genDoWhile('step();', '!done'),
      knitwork.genDoWhile(['read();', 'check();'], 'eof'),
    ],
  },
]
