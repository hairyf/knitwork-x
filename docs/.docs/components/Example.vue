<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { codeToHtml } from 'shiki'
import * as knitwork from 'knitwork-x'

const props = withDefaults(
  defineProps<{
    /** Filter examples by module; show all when not provided */
    module?: string
  }>(),
  { module: undefined },
)

// undocs/Nuxt uses @nuxtjs/color-mode: useColorMode().value is the active theme ('light' | 'dark' etc.)
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
    label: 'genExport',
    sampleCode: `import { genExport } from 'knitwork-x'

genExport('pkg', ['a', 'b'])
genExport('utils', ['fn'])`,
    getOutput: () =>
      `${knitwork.genExport('pkg', ['a', 'b'])}\n${knitwork.genExport('utils', ['fn'])}`,
  },
  {
    module: 'esm',
    label: 'genDefaultExport',
    sampleCode: `import { genDefaultExport } from 'knitwork-x'

genDefaultExport('foo')
genDefaultExport('App')`,
    getOutput: () =>
      `${knitwork.genDefaultExport('foo')}\n${knitwork.genDefaultExport('App')}`,
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
    label: 'genClassProperty',
    sampleCode: `import { genClassProperty } from 'knitwork-x'

genClassProperty('x', { type: 'number' })
genClassProperty('name', { type: 'string', optional: true })`,
    getOutput: () =>
      `${knitwork.genClassProperty('x', { type: 'number' })}\n${knitwork.genClassProperty('name', { type: 'string', optional: true })}`,
  },
  {
    module: 'class',
    label: 'genClassMethod',
    sampleCode: `import { genClassMethod } from 'knitwork-x'

genClassMethod({ name: 'bar', parameters: [{ name: 'x', type: 'string' }], body: ['return x;'], returnType: 'string' })
genClassMethod({ name: 'run', body: ['console.log(1);'] })`,
    getOutput: () =>
      `${knitwork.genClassMethod({ name: 'bar', parameters: [{ name: 'x', type: 'string' }], body: ['return x;'], returnType: 'string' })}\n\n${knitwork.genClassMethod({ name: 'run', body: ['console.log(1);'] })}`,
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
    label: 'genCallSignature',
    sampleCode: `import { genCallSignature } from 'knitwork-x'

genCallSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'number' })
genCallSignature({ parameters: [], returnType: 'void' })`,
    getOutput: () =>
      `${knitwork.genCallSignature({ parameters: [{ name: 'x', type: 'string' }], returnType: 'number' })}\n\n${knitwork.genCallSignature({ parameters: [], returnType: 'void' })}`,
  },
  {
    module: 'interface',
    label: 'genIndexSignature',
    sampleCode: `import { genIndexSignature } from 'knitwork-x'

genIndexSignature('string', 'number')
genIndexSignature('number', 'string')`,
    getOutput: () =>
      `${knitwork.genIndexSignature('string', 'number')}\n\n${knitwork.genIndexSignature('number', 'string')}`,
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
    label: 'genFunction',
    sampleCode: `import { genFunction } from 'knitwork-x'

genFunction({ name: 'foo', parameters: [{ name: 'x', type: 'string' }] })
genFunction({ name: 'bar', parameters: [], body: ['return 0;'] })`,
    getOutput: () =>
      `${knitwork.genFunction({ name: 'foo', parameters: [{ name: 'x', type: 'string' }] })}\n\n${knitwork.genFunction({ name: 'bar', parameters: [], body: ['return 0;'] })}`,
  },
  {
    module: 'function',
    label: 'genArrowFunction',
    sampleCode: `import { genArrowFunction } from 'knitwork-x'

genArrowFunction({ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' })
genArrowFunction({ parameters: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }], body: 'a + b' })`,
    getOutput: () =>
      `${knitwork.genArrowFunction({ parameters: [{ name: 'x', type: 'number' }], body: 'x * 2' })}\n\n${knitwork.genArrowFunction({ parameters: [{ name: 'a', type: 'number' }, { name: 'b', type: 'number' }], body: 'a + b' })}`,
  },
  {
    module: 'function',
    label: 'genBlock',
    sampleCode: `import { genBlock } from 'knitwork-x'

genBlock(['const a = 1;', 'return a;'])
genBlock(['try { f(); } catch (e) {}'])`,
    getOutput: () =>
      `${knitwork.genBlock(['const a = 1;', 'return a;'])}\n\n${knitwork.genBlock(['try { f(); } catch (e) {}'])}`,
  },
  {
    module: 'function',
    label: 'genParam',
    sampleCode: `import { genParam } from 'knitwork-x'

genParam({ name: 'x', type: 'string', optional: true })
genParam({ name: 'n', type: 'number' })`,
    getOutput: () =>
      `${knitwork.genParam({ name: 'x', type: 'string', optional: true })}\n\n${knitwork.genParam({ name: 'n', type: 'number' })}`,
  },
  // type-alias
  {
    module: 'type-alias',
    label: 'genTypeAlias',
    sampleCode: `import { genTypeAlias } from 'knitwork-x'

genTypeAlias('Foo', 'string')
genTypeAlias('Bar', { name: 'string', count: 'number' })`,
    getOutput: () =>
      `${knitwork.genTypeAlias('Foo', 'string')}\n\n${knitwork.genTypeAlias('Bar', { name: 'string', count: 'number' })}`,
  },
  {
    module: 'type-alias',
    label: 'genUnion',
    sampleCode: `import { genUnion } from 'knitwork-x'

genUnion(['string', 'number'])
genUnion(['A', 'B', 'C'])`,
    getOutput: () =>
      `${knitwork.genUnion(['string', 'number'])}\n\n${knitwork.genUnion(['A', 'B', 'C'])}`,
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
    label: 'genModule',
    sampleCode: `import { genModule } from 'knitwork-x'

genModule('@nuxt/utils')
genModule('@nuxt/utils', 'interface MyInterface {}')`,
    getOutput: () =>
      `${knitwork.genModule('@nuxt/utils')}\n\n${knitwork.genModule('@nuxt/utils', 'interface MyInterface {}')}`,
  },
  {
    module: 'module',
    label: 'genAugmentation',
    sampleCode: `import { genAugmentation } from 'knitwork-x'

genAugmentation('@nuxt/utils')
genAugmentation('@nuxt/utils', 'interface MyInterface {}')`,
    getOutput: () =>
      `${knitwork.genAugmentation('@nuxt/utils')}\n\n${knitwork.genAugmentation('@nuxt/utils', 'interface MyInterface {}')}`,
  },
  // namespace
  {
    module: 'namespace',
    label: 'genNamespace',
    sampleCode: `import { genNamespace } from 'knitwork-x'

genNamespace('MyNamespace')
genNamespace('Utils')`,
    getOutput: () =>
      `${knitwork.genNamespace('MyNamespace')}\n\n${knitwork.genNamespace('Utils')}`,
  },
  {
    module: 'namespace',
    label: 'genDeclareNamespace',
    sampleCode: `import { genDeclareNamespace } from 'knitwork-x'

genDeclareNamespace('global', 'interface Window {}')
genDeclareNamespace('NodeJS', [\n  'interface Process {}',\n  'const version: string'\n])`,
    getOutput: () =>
      `${knitwork.genDeclareNamespace('global', 'interface Window {}')}\n\n${knitwork.genDeclareNamespace('NodeJS', ['interface Process {}', 'const version: string'])}`,
  },
  // condition
  {
    module: 'condition',
    label: 'genIf',
    sampleCode: `import { genIf } from 'knitwork-x'

genIf('x > 0', 'return x;')
genIf('ok', ['log();', 'return;'])`,
    getOutput: () =>
      `${knitwork.genIf('x > 0', 'return x;')}\n\n${knitwork.genIf('ok', ['log();', 'return;'])}`,
  },
  {
    module: 'condition',
    label: 'genTernary',
    sampleCode: `import { genTernary } from 'knitwork-x'

genTernary('x > 0', 'x', '-x')
genTernary('ok', 'true', 'false')`,
    getOutput: () =>
      `${knitwork.genTernary('x > 0', 'x', '-x')}\n\n${knitwork.genTernary('ok', 'true', 'false')}`,
  },
  // try
  {
    module: 'try',
    label: 'genTry',
    sampleCode: `import { genTry } from 'knitwork-x'

genTry('mightThrow();')
genTry(['const x = await f();', 'return x;'])`,
    getOutput: () =>
      `${knitwork.genTry('mightThrow();')}\n\n${knitwork.genTry(['const x = await f();', 'return x;'])}`,
  },
  {
    module: 'try',
    label: 'genCatch',
    sampleCode: `import { genCatch } from 'knitwork-x'

genCatch(['throw e;'], { binding: 'e' })
genCatch(['logError();'])`,
    getOutput: () =>
      `${knitwork.genCatch(['throw e;'], { binding: 'e' })}\n\n${knitwork.genCatch(['logError();'])}`,
  },
  {
    module: 'try',
    label: 'genFinally',
    sampleCode: `import { genFinally } from 'knitwork-x'

genFinally('cleanup();')
genFinally(['release();', "log('done');"])`,
    getOutput: () =>
      `${knitwork.genFinally('cleanup();')}\n\n${knitwork.genFinally(['release();', "log('done');"])}`,
  },
  // loop
  {
    module: 'loop',
    label: 'genFor',
    sampleCode: `import { genFor } from 'knitwork-x'

genFor('let i = 0', 'i < n', 'i++', 'console.log(i);')
genFor('let j = 0', 'j < 10', 'j++', 'sum += j;')`,
    getOutput: () =>
      `${knitwork.genFor('let i = 0', 'i < n', 'i++', 'console.log(i);')}\n\n${knitwork.genFor('let j = 0', 'j < 10', 'j++', 'sum += j;')}`,
  },
  {
    module: 'loop',
    label: 'genForOf',
    sampleCode: `import { genForOf } from 'knitwork-x'

genForOf('const x', 'items', 'console.log(x);')
genForOf('const item', 'list', 'process(item);')`,
    getOutput: () =>
      `${knitwork.genForOf('const x', 'items', 'console.log(x);')}\n\n${knitwork.genForOf('const item', 'list', 'process(item);')}`,
  },
  {
    module: 'loop',
    label: 'genWhile',
    sampleCode: `import { genWhile } from 'knitwork-x'

genWhile('running', 'step();')
genWhile('hasMore', ['fetch();', 'hasMore = false;'])`,
    getOutput: () =>
      `${knitwork.genWhile('running', 'step();')}\n\n${knitwork.genWhile('hasMore', ['fetch();', 'hasMore = false;'])}`,
  },
  // switch
  {
    module: 'switch',
    label: 'genSwitch',
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
  {
    module: 'switch',
    label: 'genCase',
    sampleCode: `import { genCase } from 'knitwork-x'

genCase('1', 'break;')
genCase("'a'", ['doA();', 'break;'])`,
    getOutput: () =>
      `${knitwork.genCase('1', 'break;')}\n\n${knitwork.genCase("'a'", ['doA();', 'break;'])}`,
  },
  {
    module: 'switch',
    label: 'genDefault',
    sampleCode: `import { genDefault } from 'knitwork-x'

genDefault('return 0;')
genDefault(['log("default");', 'break;'])`,
    getOutput: () =>
      `${knitwork.genDefault('return 0;')}\n\n${knitwork.genDefault(['log("default");', 'break;'])}`,
  },
  // statement
  {
    module: 'statement',
    label: 'genReturn',
    sampleCode: `import { genReturn } from 'knitwork-x'

genReturn('x')
genReturn()`,
    getOutput: () =>
      `${knitwork.genReturn('x')}\n${knitwork.genReturn()}`,
  },
  {
    module: 'statement',
    label: 'genThrow',
    sampleCode: `import { genThrow } from 'knitwork-x'

genThrow("new Error('failed')")
genThrow('e')`,
    getOutput: () =>
      `${knitwork.genThrow("new Error('failed')")}\n${knitwork.genThrow('e')}`,
  },
  // object
  {
    module: 'object',
    label: 'genObjectLiteral',
    sampleCode: `import { genObjectLiteral } from 'knitwork-x'

genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])
genObjectLiteral(['a', 'b', 'c'])`,
    getOutput: () =>
      `${knitwork.genObjectLiteral(['type', ['type', 'A'], ['...', 'b']])}\n\n${knitwork.genObjectLiteral(['a', 'b', 'c'])}`,
  },
  {
    module: 'object',
    label: 'genObjectFromRaw',
    sampleCode: `import { genObjectFromRaw } from 'knitwork-x'

genObjectFromRaw({ foo: 'bar' })
genObjectFromRaw({ a: 1, b: 'x' })`,
    getOutput: () =>
      `${knitwork.genObjectFromRaw({ foo: 'bar' })}\n\n${knitwork.genObjectFromRaw({ a: 1, b: 'x' })}`,
  },
  // utils
  {
    module: 'utils',
    label: 'genJSDocComment',
    sampleCode: `import { genJSDocComment } from 'knitwork-x'

genJSDocComment('Single line')
genJSDocComment('@param x - number')`,
    getOutput: () =>
      `${knitwork.genJSDocComment('Single line')}\n\n${knitwork.genJSDocComment('@param x - number')}`,
  },
  {
    module: 'utils',
    label: 'genObjectKey',
    sampleCode: `import { genObjectKey } from 'knitwork-x'

genObjectKey('foo-bar')
genObjectKey('default')`,
    getOutput: () =>
      `${knitwork.genObjectKey('foo-bar')}\n\n${knitwork.genObjectKey('default')}`,
  },
  {
    module: 'utils',
    label: 'genComment',
    sampleCode: `import { genComment } from 'knitwork-x'

genComment('Single line comment')
genComment('TODO: fix')`,
    getOutput: () =>
      `${knitwork.genComment('Single line comment')}\n\n${knitwork.genComment('TODO: fix')}`,
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

// Reset index when module or presets change
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

watch([current, isDark], updateOutput, { immediate: true })
</script>

<template>
  <div v-if="current">
    <div class="flex gap-2 py-3 flex-wrap">
      <button v-for="(preset, i) in presets" :key="`${preset.module}-${preset.label}`" type="button"
        class="px-4 py-2 text-sm rounded-lg transition-colors" :class="i === currentIndex
          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
          : 'hover:bg-muted'
          " @click="selectPreset(i)">
        {{ preset.label }}
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg pb-3">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Sample code
        </p>
        <div v-if="leftHtml"
          class="text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="leftHtml" />
      </div>
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg pb-3">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Generated output
        </p>
        <div v-if="rightHtml"
          class="text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="rightHtml" />
        <p v-else-if="error" class="text-sm text-red-600 dark:text-red-400 p-3">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
