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
    // the demo renders no <RouterView>: the routes only keep links (VuButton `to`) and
    // the address bar resolvable, without "No match found" warnings
    routes: [
      {
        path: '/test',
        redirect: '/',
      },
      {
        path: '/:pathMatch(.*)*',
        component: { render: () => null },
      },
    ],
  })
)

a.directive('i8-focusable', i8Focusable)

a.mount('#app')
