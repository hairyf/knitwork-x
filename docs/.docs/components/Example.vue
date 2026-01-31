<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { codeToHtml } from 'shiki'
import { ALL_PRESETS } from '../config'

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
    leftHtml.value = await highlight(preset.code, 'typescript')
    const outputLines = preset.output()
    rightHtml.value = await highlight(outputLines.join('\n'), 'typescript')
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
