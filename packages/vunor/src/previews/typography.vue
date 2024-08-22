<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
</script>
<template>
  <VuCard level="h2">
    <VuCardHeader class="mb-$s">Typography</VuCardHeader>
    <h3 class="mb-$s border-b border-b-2px">Regular</h3>
    <div class="flex flex-col gap-2">
      <h1 class="">H1 - Display 1</h1>
      <h2 class="">H2 - Display 2</h2>
      <h3 class="">H3 - Title A</h3>
      <h4 class="">H4 - Title B</h4>
      <h5 class="">H5 - Title C</h5>
      <h6 class="">H6 - Heading</h6>

      <div class="text-subheading">Subheading</div>
      <div class="py-2 text-body-l">
        <h6 class="mb-$xs opacity-50">Large Body</h6>
        <p class="max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>
      <div class="py-2 text-body">
        <h6 class="mb-$xs opacity-50">Regular Body</h6>
        <p class="max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>
      <div class="py-2 text-body-s">
        <h6 class="mb-$xs opacity-50">Small Body</h6>
        <p class="max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>

      <div class="text-callout">Callout</div>
      <div class="text-label">Label</div>
      <div class="text-caption">Caption</div>
      <div class="text-overline uppercase">Overline</div>
    </div>

    <h3 class="mb-$s mt-$l border-b border-b-2px">Bold</h3>
    <div class="flex flex-col gap-2">
      <h1 class="fw-$bold">H1 - Display 1</h1>
      <h2 class="fw-$bold">H2 - Display 2</h2>
      <h3 class="fw-$bold">H3 - Title A</h3>
      <h4 class="fw-$bold">H4 - Title B</h4>
      <h5 class="fw-$bold">H5 - Title C</h5>
      <h6 class="fw-$bold">H6 - Heading</h6>

      <div class="fw-$bold text-subheading">Subheading</div>
      <div class="py-2 text-body-l">
        <h6 class="fw-$bold mb-$xs opacity-50">Large Body</h6>
        <p class="fw-$bold max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>
      <div class="py-2 text-body">
        <h6 class="fw-$bold mb-$xs opacity-50">Regular Body</h6>
        <p class="fw-$bold max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>
      <div class="py-2 text-body-s">
        <h6 class="fw-$bold mb-$xs opacity-50">Small Body</h6>
        <p class="fw-$bold max-w-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati dolore unde, quia
          deserunt aut delectus error molestias.
        </p>
      </div>

      <div class="fw-$bold text-callout">Callout</div>
      <div class="fw-$bold text-label">Label</div>
      <div class="fw-$bold text-caption">Caption</div>
      <div class="fw-$bold text-overline uppercase">Overline</div>
    </div>
  </VuCard>
</template>
