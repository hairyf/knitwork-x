import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const tryPresets: Preset[] = [
  {
    module: 'try',
    label: 'genTry',
    code: `genTry('mightThrow();')
genTry(['const x = await f();', 'return x;'])`,
    output: () => [
      knitwork.genTry('mightThrow();'),
      knitwork.genTry(['const x = await f();', 'return x;']),
    ],
  },
  {
    module: 'try',
    label: 'genCatch',
    code: `genCatch(['throw e;'], {
  binding: 'e'
})
genCatch(['logError();'])`,
    output: () => [
      knitwork.genCatch(['throw e;'], { binding: 'e' }),
      knitwork.genCatch(['logError();']),
    ],
  },
  {
    module: 'try',
    label: 'genFinally',
    code: `genFinally('cleanup();')
genFinally([
  'release();',
  "log('done');"
])`,
    output: () => [
      knitwork.genFinally('cleanup();'),
      knitwork.genFinally(['release();', "log('done');"]),
    ],
  },
]
