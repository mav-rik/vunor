<script setup lang="ts">
import VuCard from '../components/Card/Card.vue'
import VuCardHeader from '../components/Card/CardHeader.vue'
import VuButton from '../components/Button/Button.vue'
import VuDialog from '../components/Dialog/Dialog.vue'
import { ref } from 'vue'
const basicDialog = ref(false)
const scrollDialog = ref(false)
const noFooterDialog = ref(false)
const customFooterDialog = ref(false)
const h3TitleDialog = ref(false)

function onFooterClick(btn: string) {
  console.log('Footer Click', { btn })
}
</script>
<template>
  <VuCard level="h2" class="relative">
    <VuCardHeader class="mb-$s">Dialog</VuCardHeader>

    <div class="flex flex-col gap-$xl">
      <!-- Example 1: Basic Dialog with Header, Footer, and Content -->
      <section>
        <h3 class="text-xl font-bold mb-4">Example 1: Basic Dialog</h3>
        <VuButton label="Open Basic Dialog" @click="basicDialog = true" class="c8-filled" />
        <VuDialog
          v-model:open="basicDialog"
          class="layer-0 w-full h-full max-w-30em max-h-50em"
          title="Basic Dialog"
          rounded
          modal
          close-button
          :footer-buttons="['OK', 'Cancel']"
          @footer-click="onFooterClick"
          @footer-click.ok="console.log('Click OK')"
        >
          <span>This is a basic dialog with footer buttons.</span>
        </VuDialog>
      </section>

      <!-- Example 2: Dialog with Scrollable Content -->
      <section>
        <h3 class="text-xl font-bold mb-4">Example 2: Scrollable Content</h3>
        <VuButton label="Open Scrollable Dialog" @click="scrollDialog = true" class="c8-filled" />
        <VuDialog
          v-model:open="scrollDialog"
          class="layer-0 w-full h-full max-w-30em max-h-50em"
          title="Scrollable Dialog"
          rounded
          modal
          close-button
          :footer-buttons="['Apply', 'Cancel']"
          @footer-click="onFooterClick"
        >
          <span>Content</span>
          <div v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero eveniet, soluta rem
            adipisci dicta quod harum et dolor id aspernatur in asperiores suscipit odit cumque
            aliquam nesciunt iste ducimus eius?
          </div>
        </VuDialog>
      </section>

      <!-- Example 3: Dialog Without Footer -->
      <section>
        <h3 class="text-xl font-bold mb-4">Example 3: Dialog Without Footer</h3>
        <VuButton
          label="Open Dialog without Footer"
          @click="noFooterDialog = true"
          class="c8-filled"
        />
        <VuDialog
          v-model:open="noFooterDialog"
          class="layer-0 w-full h-full max-w-30em max-h-50em"
          title="Dialog without Footer"
          rounded
          modal
          close-button
        >
          <span>This dialog doesn't have a footer section.</span>
        </VuDialog>
      </section>

      <!-- Example 4: Dialog with Custom Footer Content -->
      <section>
        <h3 class="text-xl font-bold mb-4">Example 4: Custom Footer Content</h3>
        <VuButton
          label="Open Dialog with Custom Footer"
          @click="customFooterDialog = true"
          class="c8-filled"
        />
        <VuDialog
          v-model:open="customFooterDialog"
          class="layer-0 w-full h-full max-w-30em max-h-50em"
          title="Custom Footer Dialog"
          rounded
          modal
          close-button
        >
          <span>This dialog has custom footer content.</span>
          <template #footer>
            <div class="surface-100 flex justify-end px-$card-spacing py-$m">
              <VuButton label="Save" class="c8-filled" @click="onFooterClick('Save')" />
              <VuButton label="Close" class="c8-flat" @click="customFooterDialog = false" />
            </div>
          </template>
        </VuDialog>
      </section>

      <!-- Example 5: Dialog with Different Title Level -->
      <section>
        <h3 class="text-xl font-bold mb-4">Example 5: Dialog with Different Title Level (H3)</h3>
        <VuButton
          label="Open Dialog with H3 Title"
          @click="h3TitleDialog = true"
          class="c8-filled"
        />
        <VuDialog
          v-model:open="h3TitleDialog"
          class="layer-0 w-full h-full max-w-30em max-h-50em"
          title="Dialog with H3 Title"
          level="h3"
          rounded
          modal
          close-button
          :footer-buttons="['OK']"
          @footer-click="onFooterClick"
        >
          <span>This dialog uses an H3 title level.</span>
        </VuDialog>
      </section>

      <section>
        <h4 class="text-xl font-semibold">Props</h4>
        <ul class="list-disc pl-6">
          <li>
            <strong>defaultOpen</strong> (<em>boolean</em>): Defines whether the dialog is open by
            default.
          </li>
          <li>
            <strong>modal</strong> (<em>boolean</em>): Determines if the dialog should be modal.
          </li>
          <li><strong>rounded</strong> (<em>boolean</em>): Adds rounded corners to the dialog.</li>
          <li><strong>title</strong> (<em>string</em>): The title of the dialog.</li>
          <li>
            <strong>focusFirstSelector</strong> (<em>string</em>, default: 'input'): Specifies the
            selector of the element that should be focused first when the dialog opens.
          </li>
          <li>
            <strong>class</strong> (<em>string | string[] | object</em>): Classes for styling the
            dialog container.
          </li>
          <li>
            <strong>contentClass</strong> (<em>string | string[] | object</em>, default:
            'px-$card-spacing py-$m flex-grow-1 overflow-auto'): Classes for styling the content
            section.
          </li>
          <li>
            <strong>closeButton</strong> (<em>boolean</em>): Shows or hides the close button in the
            header.
          </li>
          <li>
            <strong>footerButtons</strong> (<em>array</em>): An array of buttons to display in the
            footer, can be a string or object.
          </li>
          <li>
            <strong>level</strong> (<em>string</em>, default: 'h4'): The header level of the dialog,
            can be one of 'h1', 'h2', etc.
          </li>
          <li>
            <strong>onEscapeKeyDown</strong> (<em>function</em>): Callback for when the escape key
            is pressed.
          </li>
          <li>
            <strong>onPointerDownOutside</strong> (<em>function</em>): Callback for when the pointer
            is down outside the dialog.
          </li>
          <li>
            <strong>onFocusOutside</strong> (<em>function</em>): Callback for when focus moves
            outside the dialog.
          </li>
          <li>
            <strong>onInteractOutside</strong> (<em>function</em>): Callback for any interaction
            outside the dialog.
          </li>
          <li>
            <strong>onOpenAutoFocus</strong> (<em>function</em>): Callback for auto-focusing when
            the dialog opens.
          </li>
          <li>
            <strong>onCloseAutoFocus</strong> (<em>function</em>): Callback for auto-focusing when
            the dialog closes.
          </li>
        </ul>
      </section>

      <section>
        <h4 class="text-xl font-semibold">Model</h4>
        <ul class="list-disc pl-6">
          <li>
            <strong>open</strong> (<em>boolean</em>): The model value that controls whether the
            dialog is open or closed.
          </li>
        </ul>
      </section>

      <section>
        <h4 class="text-xl font-semibold">Events</h4>
        <ul class="list-disc pl-6">
          <li>
            <strong>footerClick</strong> (<em>button: string, event: MouseEvent</em>): Emitted when
            a footer button is clicked. The button label and the event are passed as arguments.
          </li>
        </ul>
      </section>

      <section>
        <h4 class="text-xl font-semibold">Slots</h4>
        <ul class="list-disc pl-6">
          <li><strong>header</strong>: Slot for customizing the dialog header.</li>
          <li><strong>title</strong>: Slot for the dialog title.</li>
          <li><strong>footer</strong>: Slot for customizing the footer content and buttons.</li>
        </ul>
      </section>
    </div>
  </VuCard>
</template>
