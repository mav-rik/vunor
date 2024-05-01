<script setup lang="ts">
const value = ref('')
</script>
<template>
  <Card level="h2">
    <CardHeader class="mb-$s">Testing</CardHeader>
    <div>
      <Input label="Input1" placeholder="Type anything" v-model="value">
        <template v-slot:before="t">
          <input class="outline-none" @focus="t.focus" @blur="t.blur" />
        </template>
      </Input>
    </div>
    <div>{{ value }}</div>
  </Card>
</template>
