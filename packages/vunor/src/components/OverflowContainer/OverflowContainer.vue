<script setup lang="ts" generic="T">
const props = defineProps<{ items: T[]; maxVisible?: number }>()

const hiddenCount = ref(0)

const visibleItems = computed(() => {
  return props.items.slice(0, props.items.length - hiddenCount.value)
})

const hiddenItems = computed(() => {
  return props.items.slice(props.items.length - hiddenCount.value)
})

const root = ref<{ $el: HTMLDivElement }>()

let mObserver: MutationObserver
let rObserver: ResizeObserver

watch(
  () => [props.items],
  () => fit()
)

onMounted(() => {
  mObserver = new MutationObserver(() => {
    if (!busy) {
      fit()
    }
  })
  rObserver = new ResizeObserver(() => {
    if (!busy) {
      fit()
    }
  })
  if (root.value) {
    rObserver.observe(root.value.$el, {
      box: 'content-box',
    })
    mObserver.observe(root.value.$el, {
      childList: true,
      subtree: true,
    })
  }
  fit()
})

onBeforeUnmount(() => {
  if (root.value) {
    mObserver?.disconnect()
    rObserver?.disconnect()
  }
})

let busy = false

async function fit(i?: number) {
  if (root.value && props.items.length > 1) {
    busy = true
    hiddenCount.value =
      typeof i === 'number' ? i : Math.max(0, props.items.length - (props.maxVisible ?? 999))
    await nextTick()

    const rootWidth = root.value.$el.getBoundingClientRect().width

    let itFits = false
    let additional = 1
    while (!itFits) {
      itFits = true
      const children = root.value.$el.children
      const firstLeft = children[0]?.getBoundingClientRect().left
      for (let j = 0; j < children.length; j++) {
        const { left, width } = children[j].getBoundingClientRect()
        const w = left + width - firstLeft
        if (w >= rootWidth) {
          itFits = false
          hiddenCount.value =
            props.items.length - (j + 1) + (hiddenCount.value > 0 ? additional : 1)
          if (additional === 1) {
            additional = 2
          }
          await nextTick()
          break
        }
      }
    }
    busy = false

    // if (!doesItFit()) {
    //   busy = true
    //   fit(hiddenCount.value + 1)
    // } else {
    //   busy = false
    // }
  }
  if (props.items.length < 2) {
    hiddenCount.value = 0
  }
}

function doesItFit() {
  if (root.value) {
    const c = root.value.$el
    const { width } = c.getBoundingClientRect()
    const overflowWidth = c.scrollWidth
    return overflowWidth <= width
  }
  return true
}
</script>

<template>
  <Primitive class="flex" ref="root">
    <slot v-for="item of visibleItems" :item>
      <span>{{ item }}</span>
    </slot>
    <slot v-if="hiddenCount > 0" name="overflow" :count="hiddenCount" :items="hiddenItems">
      <span class="whitespace-nowrap">{{ hiddenCount }} more...</span>
    </slot>
  </Primitive>
</template>
