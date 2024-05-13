<script setup lang="ts">
const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

type Props = {
  label?: string
  placeholder?: string
  design?: 'flat' | 'filled' | 'round'
  error?: string | boolean
  hint?: string
  iconPrepend?: string
  iconAppend?: string
  iconBefore?: string
  iconAfter?: string
  required?: boolean
  groupItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  design: 'flat',
})

const open = defineModel<boolean>('open')
const modelValue = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="modelValue" v-model:open="open">
    <Input
      class="cursor-pointer select-none"
      :label
      :placeholder
      :design
      :value="modelValue"
      :iconPrepend
      :iconAppend="iconAppend || 'i--chevron-down'"
      :required
      :groupItem
      :model-value="modelValue"
      v-slot="{ focus, blur }"
      @click="open = !open"
    >
      <SelectValue as="span" class="w-full h-0 absolute invisible" />
      <SelectTrigger as-child :aria-label="label" class="w-full h-full text-left">
        <input
          class="i8-input cursor-pointer"
          :data-has-prepend="!!$slots.prepend || !!iconPrepend"
          :data-has-append="!!$slots.append || !!iconAppend"
          :data-has-label="!!label"
          :required
          :placeholder
          :value="modelValue"
          type="text"
          readonly
          @click="open = !open"
          @focus="focus"
          @blur="blur"
        />
      </SelectTrigger>
    </Input>

    <SelectPortal>
      <SelectContent
        class="min-w-[160px] bg-white rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
        :side-offset="5"
      >
        <SelectScrollUpButton
          class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default"
        >
          <Icon name="i--chevron-up" class="h-3.5 w-3.5" />
        </SelectScrollUpButton>

        <SelectViewport class="p-[5px]">
          <SelectLabel class="px-[25px] text-xs leading-[25px] text-mauve11"> Fruits </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in options"
              :key="index"
              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              :value="option"
            >
              <SelectItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon name="i--checkmark" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator class="h-[1px] bg-green6 m-[5px]" />
          <SelectLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
            Vegetables
          </SelectLabel>
          <SelectGroup>
            <SelectItem
              v-for="(option, index) in vegetables"
              :key="index"
              class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              :value="option"
              :disabled="option === 'Courgette'"
            >
              <SelectItemIndicator
                class="absolute left-0 w-[25px] inline-flex items-center justify-center"
              >
                <Icon name="i--checkmark" />
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>
        </SelectViewport>

        <SelectScrollDownButton
          class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default"
        >
          <Icon name="i--chevron-down" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
