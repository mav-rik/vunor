/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Directive } from 'vue'

function focus(event: FocusEvent) {
  setDataAttr(getClosestI8(event), 'active', true)
}

function blur(event: FocusEvent) {
  setDataAttr(getClosestI8(event), 'active', false)
}

function getClosestI8(event: FocusEvent) {
  const target = event.target as HTMLElement
  return target.closest('.i8') as HTMLDivElement | undefined
}

function setDataAttr(div: HTMLDivElement | undefined, attr: string, val: boolean) {
  if (div) {
    div.dataset[attr] = String(val)
  }
}

export const i8Focusable: Directive = {
  mounted: (el: HTMLInputElement) => {
    el.addEventListener('focus', focus)
    el.addEventListener('blur', blur)
  },
  beforeUnmount: (el: HTMLInputElement) => {
    el.removeEventListener('focus', focus)
    el.removeEventListener('blur', blur)
  },
}
