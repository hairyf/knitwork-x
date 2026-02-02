import { classPresets } from './class'
import { conditionPresets } from './condition'
import { conditionalPresets } from './conditional'
import { decoratorPresets } from './decorator'
import { enumPresets } from './enum'
import { esmPresets } from './esm'
import { functionPresets } from './function'
import { interfacePresets } from './interface'
import { loopPresets } from './loop'
import { modulePresets } from './module'
import { namespacePresets } from './namespace'
import { objectPresets } from './object'
import { statementPresets } from './statement'
import { stringPresets } from './string'
import { switchPresets } from './switch'
import { tryPresets } from './try'
import { typePresets } from './type'
import { utilsPresets } from './utils'
import { variablePresets } from './variable'

export type { Preset } from './types'

export const ALL_PRESETS = [
  ...stringPresets,
  ...variablePresets,
  ...esmPresets,
  ...classPresets,
  ...interfacePresets,
  ...enumPresets,
  ...functionPresets,
  ...typePresets,
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
