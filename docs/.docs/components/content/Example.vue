<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { codeToHtml } from 'shiki'
import * as knitwork from 'knitwork-x'

const props = withDefaults(
  defineProps<{
    /** 仅显示该模块的示例；不传则显示所有示例 */
    module?: string
  }>(),
  { module: undefined },
)

// undocs/Nuxt 使用 @nuxtjs/color-mode：useColorMode() 的 value 为当前生效的主题 ('light' | 'dark' 等)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

interface Preset {
  label: string
  module: string
  sampleCode: string
  getOutput: () => string
}

const ALL_PRESETS: Preset[] = [
  // string
  {
    module: 'string',
    label: 'genString',
    sampleCode: `import { genString } from 'knitwork-x'

genString('foo')
genString('foo', { singleQuotes: true })`,
    getOutput: () =>
      `${knitwork.genString('foo')}\n${knitwork.genString('foo', { singleQuotes: true })}`,
  },
  {
    module: 'string',
    label: 'genSafeVariableName',
    sampleCode: `import { genSafeVariableName } from 'knitwork-x'

genSafeVariableName('valid_import')
genSafeVariableName('for')`,
    getOutput: () =>
      `${knitwork.genSafeVariableName('valid_import')}\n${knitwork.genSafeVariableName('for')}`,
  },
  {
    module: 'string',
    label: 'genTemplateLiteral',
    sampleCode: `import { genTemplateLiteral } from 'knitwork-x'

genTemplateLiteral(['hello ', 'x'])`,
    getOutput: () => knitwork.genTemplateLiteral(['hello ', 'x']),
  },
  // variable
  {
    module: 'variable',
    label: 'genVariable',
    sampleCode: `import { genVariable } from 'knitwork-x'

genVariable('a', '2')
genVariable('x', '1', { kind: 'let' })
genVariable('y', '2', { export: true })`,
    getOutput: () =>
      `${knitwork.genVariable('a', '2')}\n${knitwork.genVariable('x', '1', { kind: 'let' })}\n${knitwork.genVariable('y', '2', { export: true })}`,
  },
  // esm
  {
    module: 'esm',
    label: 'genImport',
    sampleCode: `import { genImport } from 'knitwork-x'

genImport('vue', ['ref'])
genImport('vue', ['ref', 'computed', 'watch'])`,
    getOutput: () =>
      `${knitwork.genImport('vue', ['ref'])}\n${knitwork.genImport('vue', ['ref', 'computed', 'watch'])}`,
  },
  {
    module: 'esm',
    label: 'genDynamicImport',
    sampleCode: `import { genDynamicImport } from 'knitwork-x'

genDynamicImport('pkg')
genDynamicImport('pkg', { wrapper: false })`,
    getOutput: () =>
      `${knitwork.genDynamicImport('pkg')}\n${knitwork.genDynamicImport('pkg', { wrapper: false })}`,
  },
  {
    module: 'esm',
    label: 'genExport / genDefaultExport',
    sampleCode: `import { genExport, genDefaultExport } from 'knitwork-x'

genExport('pkg', ['a', 'b'])
genDefaultExport('foo')`,
    getOutput: () =>
      `${knitwork.genExport('pkg', ['a', 'b'])}\n${knitwork.genDefaultExport('foo')}`,
  },
  // class
  {
    module: 'class',
    label: 'genClass',
    sampleCode: `import { genClass, genConstructor } from 'knitwork-x'

genClass('Foo', [genConstructor([], [])])
genClass('Bar', [
  genConstructor(
    [{ name: 'x', type: 'number' }],
    ['super();', 'this.x = x;']
  )
], { extends: 'Base' })`,
    getOutput: () =>
      `${knitwork.genClass('Foo', [knitwork.genConstructor([], [])])}\n\n${knitwork.genClass(
        'Bar',
        [
          knitwork.genConstructor(
            [{ name: 'x', type: 'number' }],
            ['super();', 'this.x = x;'],
          ),
        ],
        { extends: 'Base' },
      )}`,
  },
  {
    module: 'class',
    label: 'genClassProperty / genClassMethod',
    sampleCode: `import { genClassProperty, genClassMethod } from 'knitwork-x'

genClassProperty('x', { type: 'number' })
genClassMethod({ name: 'bar', parameters: [{ name: 'x', type: 'string' }], body: ['return x;'], returnType: 'string' })`,
    getOutput: () =>
      `${knitwork.genClassProperty('x', { type: 'number' })}\n${knitwork.genClassMethod({ name: 'bar', parameters: [{ name: 'x', type: 'string' }], body: ['return x;'], returnType: 'string' })}`,
  },
  // interface
  {
    module: 'interface',
    label: 'genInterface',
    sampleCode: `import { genInterface } from 'knitwork-x'

genInterface('User', [
  { name: 'id', type: 'number' },
  { name: 'name', type: 'string' }
])`,
    getOutput: () =>
      knitwork.genInterface('User', [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
      ]),
  },
  {
    module: 'interface',
    label: 'genCallSignature / genIndexSignature',
    sampleCode: `import { genCallSignature, genIndexSignature } from 'knitwork-x'

genCallSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'number' })
genIndexSignature('string', 'number')`,
    getOutput: () =>
      `${knitwork.genCallSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'number' })}\n${knitwork.genIndexSignature('string', 'number')}`,
  },
  // enum
  {
    module: 'enum',
    label: 'genEnum',
    sampleCode: `import { genEnum } from 'knitwork-x'

genEnum('Color', { Red: 0, Green: 1, Blue: 2 })
genEnum('Status', { Active: 'active', Inactive: 'inactive' })`,
    getOutput: () =>
      `${knitwork.genEnum('Color', { Red: 0, Green: 1, Blue: 2 })}\n\n${knitwork.genEnum('Status', { Active: 'active', Inactive: 'inactive' })}`,
  },
  // function
  {
    module: 'function',
    label: 'genFunction / genArrowFunction',
    sampleCode: `import { genFunction, genArrowFunction } from 'knitwork-x'

genFunction({ name: 'foo', parameters: [{ name: 'x', type: 'string' }] })
genArrowFunction({ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' })`,
    getOutput: () =>
      `${knitwork.genFunction({ name: 'foo', parameters: [{ name: 'x', type: 'string' }] })}\n\n${knitwork.genArrowFunction({ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' })}`,
  },
  {
    module: 'function',
    label: 'genBlock / genParam',
    sampleCode: `import { genBlock, genParam } from 'knitwork-x'

genBlock(['const a = 1;', 'return a;'])
genParam({ name: 'x', type: 'string', optional: true })`,
    getOutput: () =>
      `${knitwork.genBlock(['const a = 1;', 'return a;'])}\n\n${knitwork.genParam({ name: 'x', type: 'string', optional: true })}`,
  },
  // type-alias
  {
    module: 'type-alias',
    label: 'genTypeAlias / genUnion',
    sampleCode: `import { genTypeAlias, genUnion } from 'knitwork-x'

genTypeAlias('Foo', 'string')
genTypeAlias('Bar', { name: 'string', count: 'number' })
genUnion(['string', 'number'])`,
    getOutput: () =>
      `${knitwork.genTypeAlias('Foo', 'string')}\n\n${knitwork.genTypeAlias('Bar', { name: 'string', count: 'number' })}\n\n${knitwork.genUnion(['string', 'number'])}`,
  },
  // conditional
  {
    module: 'conditional',
    label: 'genConditionalType',
    sampleCode: `import { genConditionalType } from 'knitwork-x'

genConditionalType('T', 'U', 'X', 'Y')
genConditionalType('T', 'null', 'never', 'T')`,
    getOutput: () =>
      `${knitwork.genConditionalType('T', 'U', 'X', 'Y')}\n\n${knitwork.genConditionalType('T', 'null', 'never', 'T')}`,
  },
  // decorator
  {
    module: 'decorator',
    label: 'genDecorator',
    sampleCode: `import { genDecorator } from 'knitwork-x'

genDecorator('Component')
genDecorator('Route', '("/api")')`,
    getOutput: () =>
      `${knitwork.genDecorator('Component')}\n${knitwork.genDecorator('Route', '("/api")')}`,
  },
  // module
  {
    module: 'module',
    label: 'genModule / genAugmentation',
    sampleCode: `import { genModule } from 'knitwork-x'

genModule('@nuxt/utils')
genModule('@nuxt/utils', 'interface MyInterface {}')`,
    getOutput: () =>
      `${knitwork.genModule('@nuxt/utils')}\n\n${knitwork.genModule('@nuxt/utils', 'interface MyInterface {}')}`,
  },
  // namespace
  {
    module: 'namespace',
    label: 'genNamespace / genDeclareNamespace',
    sampleCode: `import { genNamespace, genDeclareNamespace } from 'knitwork-x'

genNamespace('MyNamespace')
genDeclareNamespace('global', 'interface Window {}')`,
    getOutput: () =>
      `${knitwork.genNamespace('MyNamespace')}\n\n${knitwork.genDeclareNamespace('global', 'interface Window {}')}`,
  },
  // condition
  {
    module: 'condition',
    label: 'genIf / genTernary',
    sampleCode: `import { genIf, genTernary } from 'knitwork-x'

genIf('x > 0', 'return x;')
genTernary('x > 0', 'x', '-x')`,
    getOutput: () =>
      `${knitwork.genIf('x > 0', 'return x;')}\n\n${knitwork.genTernary('x > 0', 'x', '-x')}`,
  },
  // try
  {
    module: 'try',
    label: 'genTry / genCatch / genFinally',
    sampleCode: `import { genTry, genCatch, genFinally } from 'knitwork-x'

genTry('mightThrow();')
genCatch(['throw e;'], { binding: 'e' })
genFinally('cleanup();')`,
    getOutput: () =>
      `${knitwork.genTry('mightThrow();')}\n\n${knitwork.genCatch(['throw e;'], { binding: 'e' })}\n\n${knitwork.genFinally('cleanup();')}`,
  },
  // loop
  {
    module: 'loop',
    label: 'genFor / genForOf / genWhile',
    sampleCode: `import { genFor, genForOf, genWhile } from 'knitwork-x'

genFor('let i = 0', 'i < n', 'i++', 'console.log(i);')
genForOf('const x', 'items', 'console.log(x);')
genWhile('running', 'step();')`,
    getOutput: () =>
      `${knitwork.genFor('let i = 0', 'i < n', 'i++', 'console.log(i);')}\n\n${knitwork.genForOf('const x', 'items', 'console.log(x);')}\n\n${knitwork.genWhile('running', 'step();')}`,
  },
  // switch
  {
    module: 'switch',
    label: 'genSwitch / genCase / genDefault',
    sampleCode: `import { genSwitch, genCase, genDefault } from 'knitwork-x'

genSwitch('x', [
  genCase('1', 'break;'),
  genDefault('return 0;')
])`,
    getOutput: () =>
      knitwork.genSwitch('x', [
        knitwork.genCase('1', 'break;'),
        knitwork.genDefault('return 0;'),
      ]),
  },
  // statement
  {
    module: 'statement',
    label: 'genReturn / genThrow',
    sampleCode: `import { genReturn, genThrow } from 'knitwork-x'

genReturn('x')
genReturn()
genThrow("new Error('failed')")`,
    getOutput: () =>
      `${knitwork.genReturn('x')}\n${knitwork.genReturn()}\n${knitwork.genThrow("new Error('failed')")}`,
  },
  // object
  {
    module: 'object',
    label: 'genObjectLiteral / genObjectFromRaw',
    sampleCode: `import { genObjectLiteral, genObjectFromRaw } from 'knitwork-x'

genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])
genObjectFromRaw({ foo: 'bar' })`,
    getOutput: () =>
      `${knitwork.genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])}\n\n${knitwork.genObjectFromRaw({ foo: 'bar' })}`,
  },
  // utils
  {
    module: 'utils',
    label: 'genJSDocComment / genObjectKey / genComment',
    sampleCode: `import { genJSDocComment, genObjectKey, genComment } from 'knitwork-x'

genJSDocComment('Single line')
genObjectKey('foo-bar')
genComment('Single line comment')`,
    getOutput: () =>
      `${knitwork.genJSDocComment('Single line')}\n\n${knitwork.genObjectKey('foo-bar')}\n\n${knitwork.genComment('Single line comment')}`,
  },
]

const presets = computed(() =>
  props.module
    ? ALL_PRESETS.filter((p) => p.module === props.module)
    : ALL_PRESETS,
)

const currentIndex = ref(0)
const current = computed(() => presets.value[currentIndex.value])
const leftHtml = ref('')
const rightHtml = ref('')
const error = ref<string | null>(null)

// 当 module 或 presets 变化时重置索引
watch(
  () => [props.module, presets.value.length],
  () => {
    currentIndex.value = 0
  },
)

async function highlight(code: string, lang: string) {
  return codeToHtml(code, {
    lang,
    defaultColor: isDark.value ? 'dark' : 'light',
    theme: isDark.value ? 'github-dark' : 'github-light',
  })
}

async function updateOutput() {
  const preset = current.value
  if (!preset) {
    leftHtml.value = ''
    rightHtml.value = ''
    return
  }
  error.value = null
  try {
    leftHtml.value = await highlight(preset.sampleCode, 'typescript')
    const output = preset.getOutput()
    rightHtml.value = await highlight(output, 'typescript')
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    rightHtml.value = ''
  }
}

function selectPreset(index: number) {
  currentIndex.value = index
  updateOutput()
}

onMounted(() => {
  updateOutput()
})

watch(current, () => {
  updateOutput()
})

watch(isDark, () => {
  updateOutput()
})
</script>

<template>
  <div v-if="current">
    <div class="flex">
      <div class="flex gap-2 p-3 flex-wrap">
        <button
          v-for="(preset, i) in presets"
          :key="`${preset.module}-${preset.label}`"
          type="button"
          class="px-4 py-2 text-sm rounded-lg transition-colors"
          :class="
            i === currentIndex
              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'hover:bg-muted'
          "
          @click="selectPreset(i)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Sample code
        </p>
        <div
          v-if="leftHtml"
          class="text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="leftHtml"
        />
      </div>
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Generated output
        </p>
        <div
          v-if="rightHtml"
          class="text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="rightHtml"
        />
        <p v-else-if="error" class="text-sm text-red-600 dark:text-red-400 p-3">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
