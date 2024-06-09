import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import { i8Focusable } from './directives/i8-focusable'

const a = createApp(App)

a.use(
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/test',
        redirect: '/',
      },
    ],
  })
)

a.directive('i8-focusable', i8Focusable)

a.mount('#app')
