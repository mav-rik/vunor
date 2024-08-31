<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import Tabs from '../components/Tabs/Tabs.vue'
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Testing</VuCardHeader>

    <div class="flex flex-col gap-$m">
      <Tabs
        v-for="scope of ['scope-primary', 'scope-secondary', 'scope-neutral']"
        class="w-20em layer-1 border rounded overflow-clip"
        :class="scope"
        indicator
        default-value="tab1"
        :tabs="[{ value: 'tab1' }, { value: 'tab2' }, { value: 'tab3' }]"
      >
        <template v-slot:tab1>
          <div class="layer-0 p-$m">Content 1</div>
        </template>
        <template v-slot:tab2>
          <div class="layer-0 p-$m">Content 2</div>
        </template>
        <template v-slot:tab3>
          <div class="layer-0 p-$m">Content 3</div>
        </template>
      </Tabs>
    </div>
  </VuCard>
</template>
