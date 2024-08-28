<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { VuButton } from '../Button'
import { VuCard, VuCardHeader, VuCardInner } from '../Card'
import { TVunorPaletteColor, TVunorPaletteOptions } from '../../theme'
import { VuInput } from '../Input'
import VuSlider from '../Slider/Slider.vue'
import VuTabs from '../Tabs/Tabs.vue'
import { generatePalette } from '../../theme/palitra'
import { color } from '@prostojs/palitra'

function colorToRgbWithOpacity(c: string) {
  const [r, g, b, a] = color(c).rgba()
  return `${r} ${g} ${b}`
}

function debounce<T extends (...args: any[]) => any>(
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

type TColor = TVunorPaletteColor & { name: string }
type TPalette = Required<
  Omit<TVunorPaletteOptions, 'colors'> & { colors: Record<string, TVunorPaletteColor> }
>

const colors = ref<TColor[]>([])
const mainPalette = ref<TPalette['mainPalette']>({})
const layerPalette = ref<TPalette['layerPalette']>({})
const misc = ref<Pick<TPalette, 'darkest' | 'lightest' | 'layersDepth'>>({
  darkest: 0.24,
  lightest: 0.97,
  layersDepth: 0.08,
})

const mainSlider = ref<[number, number, number]>([0, 0, 0])

function cleanup() {
  const s = document.head.querySelector('style#vunor-palette-sandbox')
  if (s) {
    document.head.removeChild(s)
  }
}

const apply = debounce(() => {
  cleanup()
  const opts = {
    darkest: mainSlider.value[0],
    lightest: mainSlider.value[2],
    mainPalette: {
      luminance: {
        middle: mainSlider.value[1],
      },
    },
    colors: {} as Record<string, TVunorPaletteColor>,
  } as Exclude<Required<Parameters<typeof generatePalette>[0]>, undefined>

  for (const c of colors.value) {
    opts.colors[c.name as 'primary'] = c as TVunorPaletteColor
  }

  const { colors: result } = generatePalette(opts)

  const newS = document.createElement('style')
  newS.id = 'vunor-palette-sandbox'

  const suffixes = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  const ld = [
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

  for (const c of ['primary', 'secondary', 'grey', 'neutral', 'good', 'warn', 'error']) {
    newS.innerText += `.scope-${c} {\n`
    const col = result[c]!
    for (const s of suffixes) {
      newS.innerText += `--scope-color-${s}: ${
        colorToRgbWithOpacity(result[`${c}-${s}`]!) || ''
      };\n`
    }
    newS.innerText += `--scope-color: ${colorToRgbWithOpacity(col)};\n`
    newS.innerText += `--current-hl: ${colorToRgbWithOpacity(result[`${c}-500`]!) || ''};\n`

    for (const s of ld) {
      newS.innerText += `--scope-${s}: ${colorToRgbWithOpacity(result[`${c}-${s}`]!) || ''};\n`
    }
    newS.innerText += '}\n'

    for (const s of suffixes) {
      newS.innerText += `.text-${c}-${s}{color:rgb(${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )} / var(--un-text-opacity))}\n`
      newS.innerText += `.bg-${c}-${s}{background-color:rgb(${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )} / var(--un-bg-opacity))}\n`
      newS.innerText += `.current-outline-${c}-${s}{--current-outline:${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )};}\n`
      newS.innerText += `.current-text-${c}-${s}{--current-text:${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )};}\n`
      newS.innerText += `.current-bg-${c}-${s}{--current-bg:${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )};}\n`
      newS.innerText += `.current-border-${c}-${s}{--current-border:${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )};}\n`
      newS.innerText += `.current-icon-${c}-${s}{--current-icon:${colorToRgbWithOpacity(
        result[`${c}-${s}`]!
      )};}\n`
    }
  }

  document.head.appendChild(newS)
}, 100)

function reset() {
  if (document?.head) {
    cleanup()
    // @ts-expect-error
    const s = document.head.querySelector('style[data-vite-dev-id="\\/__uno.css"]').textContent
    if (s) {
      const base64 =
        /__vunor_palette_options\s\{background-image:\surl\(\"data:image\/gif;base64,([^"]+)/.exec(
          s
        )?.[1]
      if (base64) {
        const paletteOpts = JSON.parse(atob(base64)) as TPalette
        colors.value = []
        mainPalette.value = { ...paletteOpts.mainPalette }
        layerPalette.value = { ...paletteOpts.layerPalette }
        misc.value = {
          darkest: paletteOpts.darkest,
          lightest: paletteOpts.lightest,
          layersDepth: paletteOpts.layersDepth,
        }
        mainSlider.value = [
          misc.value.darkest,
          mainPalette.value.luminance!.middle!,
          misc.value.lightest,
        ]
        for (const [name, val] of Object.entries(paletteOpts.colors)) {
          colors.value.push({
            color: val.color,
            preserveInputColor:
              val.preserveInputColor === paletteOpts.mainPalette.preserveInputColor
                ? val.preserveInputColor
                : undefined,
            saturate: {
              dark:
                val.saturate?.dark === paletteOpts.mainPalette.saturate?.dark
                  ? val.saturate?.dark
                  : undefined,
              light:
                val.saturate?.light === paletteOpts.mainPalette.saturate?.light
                  ? val.saturate?.light
                  : undefined,
            },
            vivid: {
              dark:
                val.vivid?.dark === paletteOpts.mainPalette.vivid?.dark
                  ? val.vivid?.dark
                  : undefined,
              light:
                val.vivid?.light === paletteOpts.mainPalette.vivid?.light
                  ? val.vivid?.light
                  : undefined,
            },
            name,
          })
        }
      }
    }
  }
}

onMounted(reset)

const tab = ref('colors')

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
</script>

<template>
  <div
    v-if="colors?.length > 0"
    :style="{
      transform: `translate(${offset.x}px, ${offset.y}px)`,
    }"
    class="fingertip-[2em] fixed left-0 top-0 max-w-screen max-h-screen text-11px"
    :class="{
      'w-[30em] h-[40em]': modelValue,
      'w-[3em] h-[3em]': !modelValue,
    }"
  >
    <VuCard
      no-padding
      rounded
      level="h6"
      class="layer-0 transition-all-200 w-[30em] h-[40em] border border-grey-500/50 overflow-clip flex flex-col transform-origin-tl"
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
            { value: 'colors', label: 'Colors ' },
            { value: 'main', label: 'Main Palette' },
            { value: 'layers', label: 'Layers Palette' },
          ]"
        />
      </VuCardInner>

      <VuCardInner class="layer-0 flex-grow overflow-auto pt-$l">
        <div class="text-primary-700">Test</div>
        <!-- colors -->
        <div v-if="tab === 'colors'">
          <VuSlider
            label="Darkest | Middle | Brightest"
            :min="0"
            :max="1"
            :step="0.01"
            :thumbs="3"
            v-model="mainSlider"
            class="mb-$l"
            @update:model-value="apply"
          />
          <div v-for="c of colors" :key="c.name" class="flex items-center gap-$xs">
            <VuInput
              v-model="c.color"
              stack-label
              design="filled"
              class="w-12em"
              @update:model-value="apply"
            >
              <template v-slot:before>
                <input
                  type="color"
                  :id="`vunor-color-${c.name}`"
                  v-model="c.color"
                  class="p-0 size-[2em] bg-transparent"
                  @input="apply"
                />
              </template>
            </VuInput>
          </div>
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
