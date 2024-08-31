<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuCheckbox from '../components/Checkbox/Checkbox.vue'
import VuButton from '../components/Button/Button.vue'
import { ref } from 'vue'

const designs = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat'] as const
const scopes = ['scope-primary', 'scope-neutral', 'scope-error'] as const
const loading = ref(false)
const disabled = ref(false)
const dense = ref(false)
</script>
<template>
  <VuCard
    level="h2"
    class="relative"
    :class="{
      'fingertip-s': dense,
    }"
  >
    <VuCardHeader class="mb-$s">Buttons</VuCardHeader>
    <div class="flex gap-$xl mb-$m">
      <VuCheckbox label="Loading State" v-model="loading" />
      <VuCheckbox label="Disabled State" v-model="disabled" />
      <VuCheckbox label="Dense" v-model="dense" />
    </div>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          :label="design"
        ></VuButton>
        <VuButton :loading :disabled class="c8-filled w-md" label="c8-filled w-md"></VuButton>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          class="rounded"
          :label="design"
        ></VuButton>
        <VuButton
          :loading
          :disabled
          class="c8-filled w-md rounded"
          label="c8-filled w-md"
        ></VuButton>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded 50%</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          class="btn-round"
          :label="design"
        ></VuButton>
        <VuButton
          :loading
          :disabled
          class="c8-filled w-md btn-round"
          label="c8-filled w-md"
        ></VuButton>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Buttons with Icons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          :label="design"
          icon="i--config"
        />
        <VuButton
          :loading
          :disabled
          class="c8-filled w-md"
          icon="i--config"
          label="c8-filled w-md"
        ></VuButton>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Rounded 50% with Icons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          class="btn-round"
          :label="design"
          icon="i--config"
        ></VuButton>
        <VuButton
          :loading
          :disabled
          class="c8-filled w-md btn-round"
          label="c8-filled w-md"
          icon="i--config"
        ></VuButton>
      </div>
    </div>

    <h3 class="mb-$xs mt-$m">Icon buttons</h3>
    <div v-for="scope of scopes" class="flex flex-col" :class="scope">
      <h4 class="mb-$xs text-scope-color-500">{{ scope }}</h4>
      <div class="flex flex-wrap mb-$l gap-$m">
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          class="btn-square"
          :label="design"
          icon="i--config"
        />
        <VuButton
          :loading
          :disabled
          v-for="design of designs"
          :class="design"
          class="btn-round btn-square"
          :label="design"
          icon="i--config"
        />
      </div>
    </div>
  </VuCard>
</template>
