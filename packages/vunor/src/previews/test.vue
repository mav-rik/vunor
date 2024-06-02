<script setup lang="ts">
const designs = ['c8-filled', 'c8-outlined', 'c8-light', 'c8-flat'] as const
const maxVisible = ref(25)
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Testing</CardHeader>

    <Input
      v-model="maxVisible"
      type="number"
      max="25"
      min="0"
      design="filled"
      class="w-200px"
      label="Max Visible Buttons"
    />

    <div class="relative mb-$xxl flex flex-col gap-$l">
      <h4 class="text-mt-$m">Segmented Buttons</h4>
      <div class="flex gap-$m flex-col w-full max-w-1020px" v-for="design of designs">
        <OverflowContainer
          class="max-w-full justify-end overflow-hidden"
          :max-visible
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
            <Button :label="item" class="segmented-btn" :class="design" />
          </template>
          <template v-slot:overflow="slotProps">
            <Button
              icon="i--more-vert"
              class="btn-square"
              :class="{ [design]: true, 'segmented-btn': slotProps.count < 25 }"
            />
          </template>
        </OverflowContainer>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.with-bg {
  position: relative;
  min-height: 100vh;
}
.with-bg:before {
  content: ' ';
  position: fixed;
  pointer-events: none;
  margin-left: -2.5em;
  width: 80vw;
  top: 0;
  height: 100vh;
  background-image: url(/bg7.png);
  background-size: cover;
  mix-blend-mode: darken;
  opacity: 0.05;
}
.dark .with-bg:before {
  mix-blend-mode: overlay;
  opacity: 0.25;
}
</style>
