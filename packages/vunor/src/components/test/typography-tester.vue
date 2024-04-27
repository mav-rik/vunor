<script setup lang="ts">
defineProps<{ bold?: boolean }>()
</script>
<template>
  <div class="flex flex-col gap-2">
    <h1 :class="{ 'fw-$bold': bold }">H1 - Display 1</h1>
    <h2 :class="{ 'fw-$bold': bold }">H2 - Display 2</h2>
    <h3 :class="{ 'fw-$bold': bold }">H3 - Title A</h3>
    <h4 :class="{ 'fw-$bold': bold }">H4 - Title B</h4>
    <h5 :class="{ 'fw-$bold': bold }">H5 - Title C</h5>
    <h6 :class="{ 'fw-$bold': bold }">H6 - Heading</h6>

    <div :class="{ 'fw-$bold': bold }" class="text-subheading">Subheading</div>
    <div class="py-2 text-body-l">
      <h6 :class="{ 'fw-$bold': bold }" class="mb-$xs opacity-50">Large Body</h6>
      <p :class="{ 'fw-$bold': bold }" class="max-w-lg">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
        deserunt aut delectus error molestias.
      </p>
    </div>
    <div class="py-2 text-body">
      <h6 :class="{ 'fw-$bold': bold }" class="mb-$xs opacity-50">Regular Body</h6>
      <p :class="{ 'fw-$bold': bold }" class="max-w-lg">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
        deserunt aut delectus error molestias.
      </p>
    </div>
    <div class="py-2 text-body-s">
      <h6 :class="{ 'fw-$bold': bold }" class="mb-$xs opacity-50">Small Body</h6>
      <p :class="{ 'fw-$bold': bold }" class="max-w-lg">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
        deserunt aut delectus error molestias.
      </p>
    </div>

    <div :class="{ 'fw-$bold': bold }" class="text-callout">Callout</div>
    <div :class="{ 'fw-$bold': bold }" class="text-label">Label</div>
    <div :class="{ 'fw-$bold': bold }" class="text-caption">Caption</div>
    <div :class="{ 'fw-$bold': bold }" class="text-overline uppercase">Overline</div>
  </div>
</template>
