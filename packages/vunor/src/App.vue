<script setup lang="ts">
const dense = ref(false)
const level = ref('h6')
const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima delectus, ducimus repellat ab similique sunt corrupti eos rerum dicta saepe magni deserunt tempore optio impedit quia aliquid dolores dignissimos fuga?'
</script>

<template>
  <header></header>

  <main
    class="flex flex-col gap-$xl text-background-dark-4 items-start justify-start p-$xxl layer-0 min-h-100vh"
  >
    <div class="grid grid-cols-5 gap-$l">
      <card level="h4" class="overflow-hidden max-w-md relative surface scope-error" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="overflow-hidden max-w-md relative surface-alt scope-error" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="overflow-hidden max-w-md relative surface scope-good" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="overflow-hidden max-w-md relative surface-alt scope-good" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <div></div>
      <card level="h4" class="overflow-hidden max-w-md relative surface-inv scope-error" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="overflow-hidden max-w-md relative surface-inv-alt scope-error"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="overflow-hidden max-w-md relative surface-inv scope-good" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="overflow-hidden max-w-md relative surface-inv-alt scope-good" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
    </div>
    <div class="grid grid-cols-5 gap-$l">
      <card level="h4" class="bg-good-light-0 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-0</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-light-1 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-1</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-light-2 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-2</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-light-3 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-3</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-light-4 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">Light-4</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card level="h4" class="bg-good-50 text-good-700 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-50</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-100 text-good-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-100</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-200 text-good-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-200</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-300 text-good-900 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-300</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-400 text-good-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-400</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-500 text-good-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-500</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-600 text-good-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-600</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-700 text-good-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-700</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-800 text-good-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-800</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-good-900 text-good-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">good-900</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card level="h4" class="bg-error-50 text-error-700 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">error-50</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-100 text-error-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-100</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-200 text-error-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-200</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-300 text-error-900 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-300</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-error-400 text-error-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">error-400</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-error-500 text-error-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">error-500</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-600 text-error-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-600</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-700 text-error-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-700</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-800 text-error-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-800</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-error-900 text-error-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">error-900</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card level="h4" class="bg-warn-50 text-warn-700 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-50</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-100 text-warn-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-100</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-200 text-warn-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-200</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-300 text-warn-900 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-300</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-400 text-warn-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-400</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-500 text-warn-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-500</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-600 text-warn-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-600</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-700 text-warn-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-700</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-800 text-warn-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-800</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-warn-900 text-warn-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">warn-900</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card
        level="h4"
        class="bg-accent-50 text-accent-700 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-50</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-100 text-accent-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-100</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-200 text-accent-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-200</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-300 text-accent-900 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-300</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-400 text-accent-50 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-400</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-500 text-accent-50 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-500</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-600 text-accent-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-600</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-700 text-accent-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-700</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-800 text-accent-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-800</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-accent-900 text-accent-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">accent-900</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card level="h4" class="bg-brand-50 text-brand-700 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">brand-50</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-100 text-brand-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-100</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-200 text-brand-800 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-200</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-300 text-brand-900 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-300</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-brand-400 text-brand-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">brand-400</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-brand-500 text-brand-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">brand-500</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-600 text-brand-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-600</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-700 text-brand-100 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-700</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-800 text-brand-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-800</card-header>
        {{ lorem }}
      </card>
      <card
        level="h4"
        class="bg-brand-900 text-brand-200 overflow-hidden max-w-md relative"
        rounded
      >
        <card-header :level class="fw-$bold text-mb-$xs">brand-900</card-header>
        {{ lorem }}
      </card>
      <!--  -->
      <card level="h4" class="bg-info-50 text-info-700 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-50</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-100 text-info-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-100</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-200 text-info-800 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-200</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-300 text-info-900 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-300</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-400 text-info-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-400</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-500 text-info-50 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-500</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-600 text-info-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-600</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-700 text-info-100 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-700</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-800 text-info-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-800</card-header>
        {{ lorem }}
      </card>
      <card level="h4" class="bg-info-900 text-info-200 overflow-hidden max-w-md relative" rounded>
        <card-header :level class="fw-$bold text-mb-$xs">info-900</card-header>
        {{ lorem }}
      </card>
    </div>
  </main>
</template>
