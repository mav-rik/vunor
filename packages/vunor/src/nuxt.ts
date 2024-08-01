import { addComponent, defineNuxtModule } from '@nuxt/kit'

const components = __vue_files__

const index = defineNuxtModule({
  meta: {
    name: 'vunor/nuxt',
    configKey: 'vunor',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    // prefix: '',
    components: true,
  },
  setup(options) {
    if (options.components) {
      const vueFiles = Array.isArray(options.components)
        ? components.filter(c => (options.components as unknown as string[]).includes(c))
        : components
      for (const component of vueFiles) {
        addComponent({
          name: `Vu${component}`,
          export: 'default',
          filePath: `vunor/${component}.vue`,
        })
      }
    }
  },
})

// eslint-disable-next-line import/no-default-export
export { index as default }
