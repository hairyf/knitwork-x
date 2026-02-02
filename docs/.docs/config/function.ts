import type { Preset } from './types'
import * as knitwork from 'knitwork-x'

export const functionPresets: Preset[] = [
  {
    module: 'function',
    label: 'genFunction',
    code: `genFunction({
  name: 'foo',
  parameters: [{ name: 'x', type: 'string' }]
})
genFunction({
  name: 'bar',
  parameters: [],
  body: ['return 0;']
})`,
    output: () => [
      knitwork.genFunction({ name: 'foo', parameters: [{ name: 'x', type: 'string' }] }),
      knitwork.genFunction({ name: 'bar', parameters: [], body: ['return 0;'] }),
    ],
  },
  {
    module: 'function',
    label: 'genArrowFunction',
    code: `genArrowFunction({
  parameters: [{ name: 'x', type: 'number' }],
  body: 'x * 2'
})
genArrowFunction({
  parameters: [
    { name: 'a', type: 'number' },
    { name: 'b', type: 'number' }
  ],
  body: 'a + b'
})`,
    output: () => [
      knitwork.genArrowFunction({ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' }),
      knitwork.genArrowFunction({ parameters: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }], body: 'a + b' }),
    ],
  },
  {
    module: 'function',
    label: 'genBlock',
    code: `genBlock([
  'const a = 1;',
  'return a;'
])
genBlock(['try { f(); } catch (e) {}'])`,
    output: () => [
      knitwork.genBlock(['const a = 1;', 'return a;']),
      knitwork.genBlock(['try { f(); } catch (e) {}']),
    ],
  },
  {
    module: 'function',
    label: 'genParam',
    code: `genParam({ name: 'x', type: 'string', optional: true })
genParam({ name: 'n', type: 'number' })`,
    output: () => [
      knitwork.genParam({ name: 'x', type: 'string', optional: true }),
      knitwork.genParam({ name: 'n', type: 'number' }),
    ],
  },
]
