<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet pariatur ab maiores voluptatibus ipsum officia nobis! Eveniet error rerum dolore eligendi, tempora qui nobis soluta fugit quibusdam cupiditate, ducimus magnam!'

const scopes = [
  'scope-grey',
  'scope-neutral',
  'scope-primary',
  'scope-secondary',
  'scope-good',
  'scope-warn',
  'scope-error',
]
const surfaces = [
  'surface-0',
  'surface-1',
  'surface-2',
  'surface-3',
  'surface-4',
  'surface-50',
  'surface-100',
  'surface-200',
  'surface-300',
  'surface-400',
  'surface-500',
  'surface-600',
  'surface-700',
  'surface-800',
  'surface-900',
] as const
</script>
<template>
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Surfaces</VuCardHeader>
    <template v-for="scope of scopes">
      <h3 class="mb-$s border-b border-b-2px">Scope "{{ scope }}"</h3>
      <div class="flex flex-wrap gap-$l mb-$xxl" :class="scope">
        <VuCard v-for="s of surfaces" level="h4" rounded class="border w-sm" :class="s">
          <VuCardHeader class="mb-$s fw-bold">{{ s }}</VuCardHeader>
          <p class="text-my-0">{{ lorem }}</p>
        </VuCard>
      </div>
    </template>
  </VuCard>
</template>
