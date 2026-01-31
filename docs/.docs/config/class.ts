import * as knitwork from 'knitwork-x'
import type { Preset } from './types'

export const classPresets: Preset[] = [
  {
    module: 'class',
    label: 'genClass',
    code: `genClass('Foo', [genConstructor([], [])])
genClass('Bar', [
  genConstructor(
    [{ name: 'x', type: 'number' }],
    ['super();', 'this.x = x;']
  )
], { extends: 'Base' })`,
    output: () => [
      knitwork.genClass('Foo', [knitwork.genConstructor([], [])]),
      knitwork.genClass(
        'Bar',
        [
          knitwork.genConstructor(
            [{ name: 'x', type: 'number' }],
            ['super();', 'this.x = x;'],
          ),
        ],
        { extends: 'Base' },
      ),
    ],
  },
  {
    module: 'class',
    label: 'genConstructor',
    code: `genConstructor()
genConstructor(
  [{ name: 'x', type: 'string' }],
  ['super();', 'this.x = x;']
)`,
    output: () => [
      knitwork.genConstructor(),
      knitwork.genConstructor([{ name: 'x', type: 'string' }], ['super();', 'this.x = x;']),
    ],
  },
  {
    module: 'class',
    label: 'genClassProperty',
    code: `genClassProperty('x', { type: 'number' })
genClassProperty('name', {
  type: 'string',
  optional: true
})`,
    output: () => [
      knitwork.genClassProperty('x', { type: 'number' }),
      knitwork.genClassProperty('name', { type: 'string', optional: true }),
    ],
  },
  {
    module: 'class',
    label: 'genClassMethod',
    code: `genClassMethod({
  name: 'bar',
  parameters: [{ name: 'x', type: 'string' }],
  body: ['return x;'],
  returnType: 'string'
})
genClassMethod({
  name: 'run',
  body: ['console.log(1);']
})`,
    output: () => [
      knitwork.genClassMethod({ name: 'bar', parameters: [{ name: 'x', type: 'string' }], body: ['return x;'], returnType: 'string' }),
      knitwork.genClassMethod({ name: 'run', body: ['console.log(1);'] }),
    ],
  },
  {
    module: 'class',
    label: 'genGetter',
    code: `genGetter('value', ['return this._v;'])
genGetter('id', ['return this._id;'], {
  returnType: 'string'
})`,
    output: () => [
      knitwork.genGetter('value', ['return this._v;']),
      knitwork.genGetter('id', ['return this._id;'], { returnType: 'string' }),
    ],
  },
  {
    module: 'class',
    label: 'genSetter',
    code: `genSetter('value', 'v', ['this._v = v;'])
genSetter('id', 'x', ['this._id = x;'], {
  paramType: 'string'
})`,
    output: () => [
      knitwork.genSetter('value', 'v', ['this._v = v;']),
      knitwork.genSetter('id', 'x', ['this._id = x;'], { paramType: 'string' }),
    ],
  },
]
