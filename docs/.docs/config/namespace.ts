import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const namespacePresets: Preset[] = [
  {
    module: 'namespace',
    label: 'genNamespace',
    code: `genNamespace('MyNamespace')
genNamespace('Utils')`,
    output: () => [
      knitwork.genNamespace('MyNamespace'),
      knitwork.genNamespace('Utils'),
    ],
  },
  {
    module: 'namespace',
    label: 'genDeclareNamespace',
    code: `genDeclareNamespace('global', 'interface Window {}')
genDeclareNamespace('NodeJS', [\n  'interface Process {}',\n  'const version: string'\n])`,
    output: () => [
      knitwork.genDeclareNamespace('global', 'interface Window {}'),
      knitwork.genDeclareNamespace('NodeJS', ['interface Process {}', 'const version: string']),
    ],
  },
]
