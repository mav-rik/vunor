import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'

import App from './App.vue'
import { i8Focusable } from './directives/i8-focusable'

const a = createApp(App)

a.directive('i8-focusable', i8Focusable)

a.mount('#app')
