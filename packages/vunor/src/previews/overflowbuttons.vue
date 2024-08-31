<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuButton from '../components/Button/Button.vue'
import VuPopover from '../components/Popover/Popover.vue'
import VuOverflowContainer from '../components/OverflowContainer/OverflowContainer.vue'
import { ref } from 'vue'
const designs = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat'] as const

const maxVisibleArray = ref([5])
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Overflow Buttons</VuCardHeader>

    <VuSlider v-model="maxVisibleArray" label="Max Visible Buttons" :max="25" :min="0" inverted />

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <h4 class="text-mt-$m">Segmented Buttons</h4>
      <div class="flex gap-$m flex-col w-full" v-for="design of designs">
        <VuOverflowContainer
          class="max-w-full justify-end overflow-hidden"
          :max-visible="maxVisibleArray[0]"
          :items="[
            'Button 1',
            'Button 2',
            'Button 3',
            'Button 4',
            'Button 5',
            'Button 6',
            'Button 7',
            'Button 8',
            'Button 9',
            'Button 10',
            'Button 11',
            'Button 12',
            'Button 13',
            'Button 14',
            'Button 15',
            'Button 16',
            'Button 17',
            'Button 18',
            'Button 19',
            'Button 20',
            'Button 21',
            'Button 22',
            'Button 23',
            'Button 24',
            'Button 25',
          ]"
        >
          <template v-slot:default="{ item }">
            <VuButton :label="item" class="segmented" :class="design" />
          </template>
          <template v-slot:overflow="slotProps">
            <VuPopover
              class="btn-square"
              :class="{ [design]: true, segmented: slotProps.count < 25 }"
            >
              <template v-slot:content="{ close }">
                <div class="scope-primary flex flex-col layer-0 shadow-xl rounded-$m">
                  <div>
                    <VuButton
                      v-for="item of slotProps.items"
                      :label="item"
                      class="c8-flat rounded-0!"
                      @click="close"
                    />
                  </div>
                </div>
              </template>
            </VuPopover>
          </template>
        </VuOverflowContainer>
      </div>
    </div>
  </VuCard>
</template>
