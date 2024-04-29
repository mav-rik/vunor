<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    maxW?: string
    headerH?: string
    footerH?: string
    leftW?: string
    rightW?: string
    footer?: boolean
    header?: boolean
    left?: boolean
    right?: boolean
    headerClass?: string | Record<string, boolean>
    footerClass?: string | Record<string, boolean>
    leftClass?: string | Record<string, boolean>
    rightClass?: string | Record<string, boolean>
    mainClass?: string | Record<string, boolean>
    scrollTopOnChangeView?: boolean
  }>(),
  {
    maxW: '90rem',
    headerH: '3rem',
    footerH: '3rem',
    leftW: '14rem',
    rightW: '14rem',
  }
)

const vars = computed(() =>
  [
    `--app-max-w: ${props.maxW}`,
    `--app-header-h: ${props.header ? props.headerH : '0rem'}`,
    `--app-footer-h: ${props.footer ? props.footerH : '0rem'}`,
    `--app-left-w: ${props.left ? props.leftW : '0rem'}`,
    `--app-right-w: ${props.right ? props.rightW : '0rem'}`,
  ].join(';')
)

const mainScroll = ref<HTMLDivElement>()
const main = ref<HTMLDivElement>()

let observer: MutationObserver

const autoScroll: MutationCallback = (changes: MutationRecord[]) => {
  if (changes.length && changes.some(c => c.type === 'childList') && mainScroll.value) {
    mainScroll.value.scroll({ top: 0, left: 0 })
  }
}

onMounted(() => {
  if (props.scrollTopOnChangeView && main.value) {
    observer = new MutationObserver(autoScroll)
    observer.observe(main.value, {
      childList: true,
      subtree: false,
    })
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="h-screen w-full flex flex-col items-center" :style="vars">
    <div ref="mainScroll" class="flex-1 overflow-y-scroll overflow-x-auto w-full thin-scrollbar">
      <header
        v-if="header"
        class="sticky top-0 flex-shrink-0 h-[var(--app-header-h)] w-full flex"
        :class="headerClass"
      >
        <div class="mx-auto max-w-[var(--app-max-w)] flex items-center justify-between w-full">
          <slot name="header"></slot>
        </div>
      </header>

      <div class="max-w-[var(--app-max-w)] w-full mx-auto flex">
        <aside
          class="hidden lg:block w-[var(--app-left-w)] top-[var(--app-header-h)] overflow-auto fixed"
          :style="'height: calc(100vh - var(--app-header-h) - var(--app-footer-h))'"
        >
          <div class="min-h-full" :class="leftClass">
            <slot name="left"></slot>
          </div>
        </aside>

        <main
          class="flex-1 overflow-auto lg:pl-[var(--app-left-w)] lg:pr-[var(--app-right-w)]"
          :class="mainClass"
          ref="main"
        >
          <slot></slot>
        </main>

        <aside
          class="hidden xl:block w-[var(--app-right-w)] top-[var(--app-header-h)] overflow-auto fixed"
          :class="rightClass"
          :style="'height: calc(100vh - var(--app-header-h) - var(--app-footer-h)); left: calc(50% - var(--app-right-w) + min(var(--app-max-w), 100vw) / 2);'"
        >
          <slot name="right"></slot>
        </aside>
      </div>
    </div>

    <footer v-if="footer" class="flex-shrink-0 h-[var(--app-footer-h)] px-4 w-full flex">
      <div class="mx-auto max-w-[var(--app-max-w)] flex items-center justify-between w-full">
        footer
      </div>
    </footer>
  </div>
</template>
