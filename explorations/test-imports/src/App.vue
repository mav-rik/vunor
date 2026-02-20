<script setup lang="ts">
import { ref } from 'vue'

// Test direct imports
import VuButton from 'vunor/Button'
import VuInput from 'vunor/Input'
import VuCard from 'vunor/Card'

const name = ref('')
</script>

<template>
  <div style="padding: 2rem" class="layer-0 scope-neutral">
    <h1>Vunor Import Test</h1>

    <!-- Direct imports -->
    <h2>Direct imports</h2>
    <VuCard>
      <VuInput v-model="name" label="Your name" design="round" />
      <VuButton class="c8-flat" label="Click me" />
    </VuCard>

    <!-- Auto-resolved via VunorVueResolver -->
    <h2>Auto-resolved</h2>
    <VuButton label="Auto-resolved button" />
  </div>
</template>
