export type { Preset } from './types'
import { stringPresets } from './string'
import { variablePresets } from './variable'
import { esmPresets } from './esm'
import { classPresets } from './class'
import { interfacePresets } from './interface'
import { enumPresets } from './enum'
import { functionPresets } from './function'
import { typeAliasPresets } from './type-alias'
import { conditionalPresets } from './conditional'
import { decoratorPresets } from './decorator'
import { modulePresets } from './module'
import { namespacePresets } from './namespace'
import { conditionPresets } from './condition'
import { tryPresets } from './try'
import { loopPresets } from './loop'
import { switchPresets } from './switch'
import { statementPresets } from './statement'
import { objectPresets } from './object'
import { utilsPresets } from './utils'

export const ALL_PRESETS = [
  ...stringPresets,
  ...variablePresets,
  ...esmPresets,
  ...classPresets,
  ...interfacePresets,
  ...enumPresets,
  ...functionPresets,
  ...typeAliasPresets,
  ...conditionalPresets,
  ...decoratorPresets,
  ...modulePresets,
  ...namespacePresets,
  ...conditionPresets,
  ...tryPresets,
  ...loopPresets,
  ...switchPresets,
  ...statementPresets,
  ...objectPresets,
  ...utilsPresets,
]
