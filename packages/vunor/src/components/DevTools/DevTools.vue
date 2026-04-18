<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { VuButton } from '../Button'
import { VuCard, VuCardHeader, VuCardInner } from '../Card'
import type { TVunorPaletteColor, TVunorPaletteOptions } from '../../theme'
import VuCheckbox from '../Checkbox/Checkbox.vue'
import VuSlider from '../Slider/Slider.vue'
import VuTabs from '../Tabs/Tabs.vue'
import { generatePalette } from '../../theme/palitra'
import { color } from '@prostojs/palitra'

function colorToRgbWithOpacity(c: string) {
  const [r, g, b] = color(c).rgba()
  return `${r} ${g} ${b}`
}

function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined

  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      func(...args)
    }, wait)
  }
}

const props = defineProps<{
  defaultOpen?: boolean
}>()

const modelValue = defineModel('open')
modelValue.value = !!props.defaultOpen

type TPalette = Required<
  Omit<TVunorPaletteOptions, 'colors'> & { colors: Record<string, TVunorPaletteColor> }
>

interface TColorState {
  name: string
  color: string
  preserveInputColor: [boolean]
  saturateDark: [number]
  saturateLight: [number]
  vividDark: [number]
  vividLight: [number]
  flatness: [number]
}

interface TMainState {
  preserveInputColor: [boolean]
  flatness: [number]
  lumDark: [number]
  lumLight: [number]
  lumMiddle: [number]
  useMiddle: [boolean]
  saturateDark: [number]
  saturateLight: [number]
  vividDark: [number]
  vividLight: [number]
}

interface TLayerState {
  desaturate: [number]
  flatness: [number]
  lumDark: [number]
  lumLight: [number]
  saturateDark: [number]
  saturateLight: [number]
  vividDark: [number]
  vividLight: [number]
}

interface TMiscState {
  darkest: [number]
  lightest: [number]
  layersDepth: [number]
  flatness: [number]
}

const colors = ref<TColorState[]>([])
const main = ref<TMainState | null>(null)
const layer = ref<TLayerState | null>(null)
const misc = ref<TMiscState | null>(null)

function cleanup() {
  const s = document.head.querySelector('style#vunor-palette-sandbox')
  if (s) {
    s.remove()
  }
}

function buildOpts(): TVunorPaletteOptions {
  if (!main.value || !layer.value || !misc.value) {return {}}

  const m = main.value
  const l = layer.value
  const x = misc.value

  const opts: TVunorPaletteOptions = {
    darkest: x.darkest[0],
    lightest: x.lightest[0],
    layersDepth: x.layersDepth[0],
    flatness: x.flatness[0],
    mainPalette: {
      preserveInputColor: m.preserveInputColor[0],
      flatness: m.flatness[0],
      luminance: {
        dark: m.lumDark[0],
        light: m.lumLight[0],
        middle: m.lumMiddle[0],
        useMiddle: m.useMiddle[0],
      },
      saturate: { dark: m.saturateDark[0], light: m.saturateLight[0] },
      vivid: { dark: m.vividDark[0], light: m.vividLight[0] },
    },
    layerPalette: {
      desaturate: l.desaturate[0],
      flatness: l.flatness[0],
      luminance: { dark: l.lumDark[0], light: l.lumLight[0] },
      saturate: { dark: l.saturateDark[0], light: l.saturateLight[0] },
      vivid: { dark: l.vividDark[0], light: l.vividLight[0] },
    },
    colors: {} as Record<string, TVunorPaletteColor>,
  }

  for (const c of colors.value) {
    ;(opts.colors as Record<string, TVunorPaletteColor>)[c.name] = {
      color: c.color,
      preserveInputColor: c.preserveInputColor[0],
      saturate: { dark: c.saturateDark[0], light: c.saturateLight[0] },
      vivid: { dark: c.vividDark[0], light: c.vividLight[0] },
      flatness: c.flatness[0],
    }
  }
  return opts
}

const SUFFIXES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const LD = [
  'light-0',
  'light-1',
  'light-2',
  'light-3',
  'light-4',
  'dark-0',
  'dark-1',
  'dark-2',
  'dark-3',
  'dark-4',
]
const COLOR_NAMES = ['primary', 'secondary', 'grey', 'neutral', 'good', 'warn', 'error']

const apply = debounce(() => {
  cleanup()
  const opts = buildOpts()
  const { colors: result } = generatePalette(opts)

  const newS = document.createElement('style')
  newS.id = 'vunor-palette-sandbox'

  for (const c of COLOR_NAMES) {
    const col = result[c]
    if (!col) {continue}
    newS.textContent += `.scope-${c} {\n`
    for (const s of SUFFIXES) {
      const v = result[`${c}-${s}`]
      newS.textContent += `--scope-color-${s}: ${v ? colorToRgbWithOpacity(v) : ''};\n`
    }
    newS.textContent += `--scope-color: ${colorToRgbWithOpacity(col)};\n`
    const v500 = result[`${c}-500`]
    newS.textContent += `--current-hl: ${v500 ? colorToRgbWithOpacity(v500) : ''};\n`

    for (const s of LD) {
      const v = result[`${c}-${s}`]
      newS.textContent += `--scope-${s}: ${v ? colorToRgbWithOpacity(v) : ''};\n`
    }
    newS.textContent += '}\n'

    for (const s of SUFFIXES) {
      const v = result[`${c}-${s}`]
      if (!v) {continue}
      const rgb = colorToRgbWithOpacity(v)
      newS.textContent += `.text-${c}-${s}{color:rgb(${rgb} / var(--un-text-opacity))}\n`
      newS.textContent += `.bg-${c}-${s}{background-color:rgb(${rgb} / var(--un-bg-opacity))}\n`
      newS.textContent += `.current-outline-${c}-${s}{--current-outline:${rgb};}\n`
      newS.textContent += `.current-text-${c}-${s}{--current-text:${rgb};}\n`
      newS.textContent += `.current-bg-${c}-${s}{--current-bg:${rgb};}\n`
      newS.textContent += `.current-border-${c}-${s}{--current-border:${rgb};}\n`
      newS.textContent += `.current-icon-${c}-${s}{--current-icon:${rgb};}\n`
    }
  }

  document.head.append(newS)
}, 100)

function buildMisc(p: TPalette): TMiscState {
  return {
    darkest: [p.darkest],
    lightest: [p.lightest],
    layersDepth: [p.layersDepth],
    flatness: [p.flatness ?? 1],
  }
}

function buildMain(p: TPalette): TMainState {
  const m = p.mainPalette
  return {
    preserveInputColor: [m.preserveInputColor ?? false],
    flatness: [m.flatness ?? p.flatness ?? 1],
    lumDark: [m.luminance?.dark ?? p.darkest + p.layersDepth + 0.02],
    lumLight: [m.luminance?.light ?? p.lightest],
    lumMiddle: [m.luminance?.middle ?? 0.62],
    useMiddle: [m.luminance?.useMiddle ?? true],
    saturateDark: [m.saturate?.dark ?? -0.25],
    saturateLight: [m.saturate?.light ?? -0.25],
    vividDark: [m.vivid?.dark ?? 0.1],
    vividLight: [m.vivid?.light ?? 0.2],
  }
}

function buildLayer(p: TPalette): TLayerState {
  const l = p.layerPalette
  return {
    desaturate: [l.desaturate ?? 0.2],
    flatness: [l.flatness ?? p.flatness ?? 1],
    lumDark: [l.luminance?.dark ?? p.darkest],
    lumLight: [l.luminance?.light ?? p.darkest + p.layersDepth],
    saturateDark: [l.saturate?.dark ?? -0.2],
    saturateLight: [l.saturate?.light ?? -0.2],
    vividDark: [l.vivid?.dark ?? 0],
    vividLight: [l.vivid?.light ?? 0],
  }
}

function buildColor(name: string, val: TVunorPaletteColor, p: TPalette): TColorState {
  const m = p.mainPalette
  return {
    name,
    color: val.color ?? '#000000',
    preserveInputColor: [val.preserveInputColor ?? m.preserveInputColor ?? false],
    saturateDark: [val.saturate?.dark ?? m.saturate?.dark ?? -0.25],
    saturateLight: [val.saturate?.light ?? m.saturate?.light ?? -0.25],
    vividDark: [val.vivid?.dark ?? m.vivid?.dark ?? 0.1],
    vividLight: [val.vivid?.light ?? m.vivid?.light ?? 0.2],
    flatness: [val.flatness ?? m.flatness ?? p.flatness ?? 1],
  }
}

function reset() {
  if (!document?.head) {return}
  cleanup()
  const styleEl = document.head.querySelector('style[data-vite-dev-id="\\/__uno.css"]')
  const s = styleEl?.textContent
  if (!s) {return}
  const base64 = /__vunor_palette_options\s\{background-image:\surl\("data:image\/gif;base64,([^"]+)/.exec(
    s
  )?.[1]
  if (!base64) {return}

  const paletteOpts = JSON.parse(atob(base64)) as TPalette
  misc.value = buildMisc(paletteOpts)
  main.value = buildMain(paletteOpts)
  layer.value = buildLayer(paletteOpts)
  colors.value = Object.entries(paletteOpts.colors).map(([name, val]) =>
    buildColor(name, val, paletteOpts)
  )
}

onMounted(reset)

// Misc holds foundational params (darkest/lightest/layersDepth/flatness) that palitra
// only consults as fallbacks. Since main/layer luminance is always emitted in buildOpts,
// the fallback never fires — so propagate Misc into main/layer using palitra's own
// default formulas whenever Misc changes.
watch(
  misc,
  m => {
    if (!m || !main.value || !layer.value) {return}
    main.value.lumDark = [m.darkest[0] + m.layersDepth[0] + 0.02]
    main.value.lumLight = [m.lightest[0]]
    main.value.flatness = [m.flatness[0]]
    layer.value.lumDark = [m.darkest[0]]
    layer.value.lumLight = [m.darkest[0] + m.layersDepth[0]]
    layer.value.flatness = [m.flatness[0]]
  },
  { deep: true }
)

const tab = ref('colors')
const expandedColor = ref<string | null>(null)

// dragging the popup:
const down = ref(false)
const offset = reactive({
  x: 12,
  y: 12,
})

const grabbedAt = {
  x: 0,
  y: 0,
}
const prevPos = {
  x: 0,
  y: 0,
}

function onMouseDown(event: MouseEvent) {
  down.value = true
  grabbedAt.x = event.screenX
  grabbedAt.y = event.screenY
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove)
  prevPos.x = offset.x
  prevPos.y = offset.y
}

function onMouseUp(event: MouseEvent) {
  down.value = false
  if (grabbedAt.x !== event.screenX || grabbedAt.y !== event.screenY) {
    event.stopPropagation()
    event.preventDefault()
  } else {
    modelValue.value = !modelValue.value
  }
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('mousemove', onMouseMove)
}

function onMouseMove(event: MouseEvent) {
  offset.x = prevPos.x + event.screenX - grabbedAt.x
  offset.y = prevPos.y + event.screenY - grabbedAt.y
}

function fmt(v?: number) {
  return v === undefined ? '' : Number(v).toFixed(2)
}
</script>

<template>
  <div
    v-if="colors?.length > 0"
    :style="{
      transform: `translate(${offset.x}px, ${offset.y}px)`,
    }"
    class="fingertip-[2em] fixed left-0 top-0 max-w-screen max-h-screen text-11px"
    :class="{
      'w-[34em] h-[44em]': modelValue,
      'w-[3em] h-[3em]': !modelValue,
    }"
  >
    <VuCard
      no-padding
      rounded
      level="h6"
      class="layer-0 transition-all-200 w-[34em] h-[44em] border border-grey-500/50 overflow-clip flex flex-col transform-origin-tl"
      :class="{
        'scale-100 shadow-md opacity-50 hover:opacity-100': modelValue,
        'scale-20 opacity-0 pointer-events-none': !modelValue,
      }"
    >
      <VuCardInner
        @mousedown="onMouseDown"
        :class="{
          'cursor-grab': !down,
          'cursor-grabbing': down,
        }"
        class="layer-2 flex justify-between items-center fingertip-[1em] select-none"
      >
        <VuCardHeader class="text-mb-0 text-mt-0">Vunor Palette Sandbox</VuCardHeader>
        <VuButton
          icon="i--clear"
          class="c8-flat btn-square rounded"
          @mousedown.stop=""
          @click.stop="modelValue = !modelValue"
        />
      </VuCardInner>

      <VuCardInner class="layer-0 border-b">
        <VuTabs
          default-value="colors"
          v-model="tab"
          :tabs="[
            { value: 'colors', label: 'Colors' },
            { value: 'main', label: 'Main' },
            { value: 'layers', label: 'Layers' },
            { value: 'misc', label: 'Misc' },
          ]"
        />
      </VuCardInner>

      <VuCardInner class="layer-0 flex-grow overflow-auto pt-$l">
        <!-- COLORS TAB -->
        <div v-if="tab === 'colors'">
          <div
            v-for="c of colors"
            :key="c.name"
            class="border-b border-grey-500/30 pb-$xs mb-$xs"
          >
            <div class="flex items-center gap-$xs mb-$xs">
              <input
                type="color"
                :id="`vunor-color-${c.name}`"
                v-model="c.color"
                class="p-0 size-[2em] bg-transparent border-0"
                @input="apply"
              />
              <input
                v-model="c.color"
                @input="apply"
                class="flex-grow bg-transparent border border-grey-500/30 px-$xs py-1 rounded text-mono"
              />
              <strong class="w-6em truncate">{{ c.name }}</strong>
              <VuButton
                :icon="expandedColor === c.name ? 'i--chevron-up' : 'i--chevron-down'"
                class="c8-flat btn-square rounded"
                @click="expandedColor = expandedColor === c.name ? null : c.name"
              />
            </div>
            <div v-if="expandedColor === c.name" class="pl-$m grid grid-cols-2 gap-$xs">
              <VuSlider
                :label="`saturate.dark ${fmt(c.saturateDark[0])}`"
                :min="-1"
                :max="1"
                :step="0.05"
                v-model="c.saturateDark"
                @update:model-value="apply"
              />
              <VuSlider
                :label="`saturate.light ${fmt(c.saturateLight[0])}`"
                :min="-1"
                :max="1"
                :step="0.05"
                v-model="c.saturateLight"
                @update:model-value="apply"
              />
              <VuSlider
                :label="`vivid.dark ${fmt(c.vividDark[0])}`"
                :min="0"
                :max="1"
                :step="0.05"
                v-model="c.vividDark"
                @update:model-value="apply"
              />
              <VuSlider
                :label="`vivid.light ${fmt(c.vividLight[0])}`"
                :min="0"
                :max="1"
                :step="0.05"
                v-model="c.vividLight"
                @update:model-value="apply"
              />
              <VuSlider
                :label="`flatness ${fmt(c.flatness[0])}`"
                :min="0"
                :max="1"
                :step="0.01"
                v-model="c.flatness"
                @update:model-value="apply"
              />
              <VuCheckbox
                v-model="c.preserveInputColor[0]"
                label="preserveInputColor"
                @update:model-value="apply"
              />
            </div>
          </div>
        </div>

        <!-- MAIN PALETTE TAB -->
        <div v-if="tab === 'main' && main" class="grid grid-cols-2 gap-$xs">
          <VuSlider
            :label="`luminance.dark ${fmt(main.lumDark[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="main.lumDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`luminance.light ${fmt(main.lumLight[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="main.lumLight"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`luminance.middle ${fmt(main.lumMiddle[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="main.lumMiddle"
            @update:model-value="apply"
          />
          <VuCheckbox
            v-model="main.useMiddle[0]"
            label="luminance.useMiddle"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`saturate.dark ${fmt(main.saturateDark[0])}`"
            :min="-1"
            :max="1"
            :step="0.05"
            v-model="main.saturateDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`saturate.light ${fmt(main.saturateLight[0])}`"
            :min="-1"
            :max="1"
            :step="0.05"
            v-model="main.saturateLight"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`vivid.dark ${fmt(main.vividDark[0])}`"
            :min="0"
            :max="1"
            :step="0.05"
            v-model="main.vividDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`vivid.light ${fmt(main.vividLight[0])}`"
            :min="0"
            :max="1"
            :step="0.05"
            v-model="main.vividLight"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`flatness ${fmt(main.flatness[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="main.flatness"
            @update:model-value="apply"
          />
          <VuCheckbox
            v-model="main.preserveInputColor[0]"
            label="preserveInputColor"
            @update:model-value="apply"
          />
        </div>

        <!-- LAYERS PALETTE TAB -->
        <div v-if="tab === 'layers' && layer" class="grid grid-cols-2 gap-$xs">
          <VuSlider
            :label="`desaturate ${fmt(layer.desaturate[0])}`"
            :min="0"
            :max="1"
            :step="0.05"
            v-model="layer.desaturate"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`flatness ${fmt(layer.flatness[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="layer.flatness"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`luminance.dark ${fmt(layer.lumDark[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="layer.lumDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`luminance.light ${fmt(layer.lumLight[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="layer.lumLight"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`saturate.dark ${fmt(layer.saturateDark[0])}`"
            :min="-1"
            :max="1"
            :step="0.05"
            v-model="layer.saturateDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`saturate.light ${fmt(layer.saturateLight[0])}`"
            :min="-1"
            :max="1"
            :step="0.05"
            v-model="layer.saturateLight"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`vivid.dark ${fmt(layer.vividDark[0])}`"
            :min="0"
            :max="1"
            :step="0.05"
            v-model="layer.vividDark"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`vivid.light ${fmt(layer.vividLight[0])}`"
            :min="0"
            :max="1"
            :step="0.05"
            v-model="layer.vividLight"
            @update:model-value="apply"
          />
        </div>

        <!-- MISC TAB -->
        <div v-if="tab === 'misc' && misc" class="grid grid-cols-1 gap-$xs">
          <VuSlider
            :label="`darkest ${fmt(misc.darkest[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="misc.darkest"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`lightest ${fmt(misc.lightest[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="misc.lightest"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`layersDepth ${fmt(misc.layersDepth[0])}`"
            :min="0"
            :max="0.5"
            :step="0.01"
            v-model="misc.layersDepth"
            @update:model-value="apply"
          />
          <VuSlider
            :label="`flatness (top-level) ${fmt(misc.flatness[0])}`"
            :min="0"
            :max="1"
            :step="0.01"
            v-model="misc.flatness"
            @update:model-value="apply"
          />
        </div>
      </VuCardInner>

      <VuCardInner class="layer-2 flex justify-center">
        <VuButton label="Reset All" @click="reset" class="c8-flat" />
      </VuCardInner>
    </VuCard>
    <!-- prettier-ignore-attribute class -->
    <div
      class="absolute
        shadow-[0_0_5px_2px_rgb(var(--scope-color-500))]
        left-0
        top-0
        size-[3em]
        rounded-full
        transition-opacity-200
        surface-500
        flex
        justify-center
        items-center
        current-outline-primary-700
        outline-current
        outline-[2px]
        outline-solid
        hover:opacity-100
        cursor-pointer
        select-none"
      title="Vunor Palette Sandbox"
      :class="{
        'opacity-0 pointer-events-none': modelValue,
        'opacity-50': !modelValue,
        'cursor-grabbing': down,
      }"
      @mousedown="onMouseDown"
    >
      <strong class="text-16px text-mb-0">V</strong>
    </div>
  </div>
</template>
