<script setup lang="ts">
const dense = ref(false)
const level = ref('h6')
</script>

<template>
  <header></header>

  <main class="flex gap-$xl items-start justify-center p-$xxl bg-gray-200 min-h-100vh">
    <Card level="h3" class="bg-white p-0 overflow-hidden max-w-md shadow-xl relative" rounded>
      <img src="https://wallpapers.com/images/featured/picture-en3dnh2zi84sgt3t.jpg" />
      <div class="p-$card-spacing">
        <CardHeader :level class="fw-$bold">Card Header </CardHeader>
        <p class="text-h5 fw-$bold text-gray-400 text-mb-$l">Short Subheader</p>
        <p class="text-body text-my-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti facere molestiae saepe
          eligendi voluptatem sed, assumenda libero, exercitationem sapiente eveniet inventore,
          fugit odit veritatis temporibus tempora ex quod vitae repudiandae.
        </p>
      </div>
    </Card>
  </main>
</template>
