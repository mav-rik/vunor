<script setup lang="ts">
const designs = ['flat', 'filled', 'round'] as const
const showPassword = ref(false)
</script>
<template>
  <Card level="h2" class="with-bg relative">
    <CardHeader class="mb-$s">Inputs</CardHeader>
    <div class="flex flex-col gap-$l relative pb-$xxl">
      <h4 class="">Plain Inputs</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :limit="10" :design label="Label" />
        <InputGroup class="w-full" :limit="10" :design placeholder="placeholder" />
        <InputGroup class="w-full" :limit="10" :design label="Label" hint="Supporting message" />
        <InputGroup class="w-full" :limit="10" :design label="Label" error="Error message" />
      </div>

      <div class="flex gap-$m">
        <Input
          :type="showPassword ? 'text' : 'password'"
          label="password"
          :icon-append="showPassword ? 'i--eye' : 'i--eye-slash'"
          @append-click="showPassword = !showPassword"
        />
        <Input
          :type="showPassword ? 'text' : 'password'"
          label="password"
          design="filled"
          :icon-append="showPassword ? 'i--eye' : 'i--eye-slash'"
          @append-click="showPassword = !showPassword"
        />
        <Input
          :type="showPassword ? 'text' : 'password'"
          label="password"
          design="round"
          :icon-append="showPassword ? 'i--eye' : 'i--eye-slash'"
          @append-click="showPassword = !showPassword"
        />
        <Input
          :type="showPassword ? 'text' : 'password'"
          design="round"
          :icon-append="showPassword ? 'i--eye' : 'i--eye-slash'"
          @append-click="showPassword = !showPassword"
        />
      </div>

      <h4 class="text-mt-$m">Inputs with icon (prepend)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :design label="Label" icon-prepend="i--search"> </InputGroup>
        <InputGroup class="w-full" :design placeholder="placeholder" icon-prepend="i--search">
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-prepend="i--search"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-prepend="i--search"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (prepend) (required)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :design label="Label" icon-prepend="i--search" required>
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          placeholder="placeholder"
          icon-prepend="i--search"
          required
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-prepend="i--search"
          required
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-prepend="i--search"
          required
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (append)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :design label="Label" icon-append="i--input"> </InputGroup>
        <InputGroup class="w-full" :design placeholder="placeholder" icon-append="i--input">
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-append="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-append="i--input"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (prepend and append)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup
          class="w-full"
          :design
          label="Label"
          icon-prepend="i--alert"
          icon-append="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          placeholder="placeholder"
          icon-prepend="i--alert"
          icon-append="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-prepend="i--alert"
          icon-append="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-prepend="i--alert"
          icon-append="i--input"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (before)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :design label="Label" icon-before="i--search"> </InputGroup>
        <InputGroup class="w-full" :design placeholder="placeholder" icon-before="i--search">
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-before="i--search"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-before="i--search"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (after)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" :design label="Label" icon-after="i--input"> </InputGroup>
        <InputGroup class="w-full" :design placeholder="placeholder" icon-after="i--input">
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-after="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-after="i--input"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Inputs with icon (before and after)</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup
          class="w-full"
          :design
          label="Label"
          icon-before="i--alert"
          icon-after="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          placeholder="placeholder"
          icon-before="i--alert"
          icon-after="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          hint="Supporting message"
          icon-before="i--alert"
          icon-after="i--input"
        >
        </InputGroup>
        <InputGroup
          class="w-full"
          :design
          label="Label"
          error="Error message"
          icon-before="i--alert"
          icon-after="i--input"
        >
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Groupped inputs</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup :design>
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-prepend="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-append="i--input"> </Input>
        </InputGroup>

        <InputGroup :design hint="Supporting message">
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-prepend="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-append="i--input"> </Input>
        </InputGroup>
        <InputGroup :design error="Error message">
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-prepend="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-append="i--input"> </Input>
        </InputGroup>
      </div>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup :design>
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-append="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-prepend="i--input"> </Input>
        </InputGroup>

        <InputGroup :design hint="Supporting message">
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-append="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-prepend="i--input"> </Input>
        </InputGroup>
        <InputGroup :design error="Error message">
          <Input
            class="w-xxs"
            group-item
            :design
            label="Label1"
            icon-append="i--alert"
            type="number"
          >
          </Input>
          <Input class="w-xxs" group-item :design label="Label2" icon-prepend="i--input"> </Input>
        </InputGroup>
      </div>

      <h4 class="text-mt-$m">Text area</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup class="w-full" type="textarea" :design label="Label" />
        <InputGroup class="w-full" type="textarea" :design placeholder="placeholder" />
        <InputGroup
          class="w-full"
          type="textarea"
          :design
          label="Label"
          hint="Supporting message"
        />
        <InputGroup class="w-full" type="textarea" :design label="Label" error="Error message" />
      </div>

      <h4 class="text-mt-$m">Text area with icons</h4>
      <div class="flex gap-$m" v-for="design of designs">
        <InputGroup
          class="w-full"
          type="textarea"
          icon-prepend="i--alert"
          icon-append="i--input"
          :design
          :limit="100"
          label="Label"
        />
        <InputGroup
          class="w-full"
          type="textarea"
          icon-prepend="i--alert"
          icon-append="i--input"
          :design
          :limit="100"
          placeholder="placeholder"
        />
        <InputGroup
          class="w-full"
          type="textarea"
          icon-prepend="i--alert"
          icon-append="i--input"
          :design
          :limit="100"
          label="Label"
          hint="Supporting message"
        />
        <InputGroup
          class="w-full"
          type="textarea"
          icon-prepend="i--alert"
          icon-append="i--input"
          :design
          :limit="100"
          label="Label"
          error="Error message"
        />
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
