<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { codeToHtml } from 'shiki'
import * as knitwork from 'knitwork-x'

// undocs/Nuxt 使用 @nuxtjs/color-mode：useColorMode() 的 value 为当前生效的主题 ('light' | 'dark' 等)
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
interface Preset {
  label: string
  sampleCode: string
  getOutput: () => string
}

const presets: Preset[] = [
  {
    label: 'genImport',
    sampleCode: `import { genImport } from 'knitwork-x'

genImport('vue', ['ref'])
// => import { ref } from "vue";`,
    getOutput: () => knitwork.genImport('vue', ['ref']),
  },
  {
    label: 'genImport (multiple)',
    sampleCode: `import { genImport } from 'knitwork-x'

genImport('vue', ['ref', 'computed', 'watch'])
// => import { ref, computed, watch } from "vue";`,
    getOutput: () => knitwork.genImport('vue', ['ref', 'computed', 'watch']),
  },
  {
    label: 'genClass',
    sampleCode: `import { genClass, genConstructor } from 'knitwork-x'

genClass('Foo', [
  genConstructor([], [])
])
// => class Foo { constructor() {} }`,
    getOutput: () =>
      knitwork.genClass('Foo', [
        knitwork.genConstructor([], []),
      ]),
  },
  {
    label: 'genClass (extends)',
    sampleCode: `import { genClass, genConstructor } from 'knitwork-x'

genClass('Bar', [
  genConstructor(
    [{ name: 'x', type: 'number' }],
    ['super();', 'this.x = x;']
  )
], { extends: 'Base' })
// => class Bar extends Base { ... }`,
    getOutput: () =>
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
  },
  {
    label: 'genInterface',
    sampleCode: `import { genInterface } from 'knitwork-x'

genInterface('User', [
  { name: 'id', type: 'number' },
  { name: 'name', type: 'string' }
])
// => interface User { id: number; name: string; }`,
    getOutput: () =>
      knitwork.genInterface('User', [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
      ]),
  },
  {
    label: 'Combined',
    sampleCode: `import { genImport, genClass, genConstructor } from 'knitwork-x'

const imp = genImport('vue', ['ref'])
const cls = genClass('Counter', [
  genConstructor([], ['super();'])
], { export: true })

imp + '\\n\\n' + cls`,
    getOutput: () => {
      const imp = knitwork.genImport('vue', ['ref'])
      const cls = knitwork.genClass(
        'Counter',
        [knitwork.genConstructor([], ['super();'])],
        { export: true },
      )
      return `${imp}\n\n${cls}`
    },
  },
]

const currentIndex = ref(0)
const current = computed(() => presets[currentIndex.value]!)
const leftHtml = ref('')
const rightHtml = ref('')
const error = ref<string | null>(null)


async function highlight(code: string, lang: string) {
  return codeToHtml(code, {
    lang,
    defaultColor: isDark.value ? 'dark' : 'light',
    theme: isDark.value ? 'github-dark' : 'github-light',
  })
}

async function updateOutput() {
  const preset = current.value
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

// 主题切换时重新高亮，以匹配亮/暗色
watch(isDark, () => {
  updateOutput()
})
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex gap-2 p-3 flex-wrap">
        <button v-for="(preset, i) in presets" :key="preset.label" type="button"
          class="px-4 py-2 text-sm rounded-lg transition-colors" :class="i === currentIndex
              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
              : 'hover:bg-muted'
            " @click="selectPreset(i)">
          {{ preset.label }}
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Sample code
        </p>
        <div v-if="leftHtml"
          class="playground-code text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="leftHtml" />
      </div>
      <div class="overflow-auto min-h-[140px] bg-muted rounded-lg">
        <p class="pt-3 px-3 text-xs text-muted mb-3 font-medium uppercase tracking-wider">
          Generated output
        </p>
        <div v-if="rightHtml"
          class="playground-code text-sm rounded overflow-hidden [&_pre]:!p-3 [&_pre]:!m-0 [&_pre]:!rounded [&_pre]:!bg-transparent [&_pre]:!leading-3"
          v-html="rightHtml" />
        <p v-else-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>
