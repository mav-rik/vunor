import type { ComponentResolver } from 'unplugin-vue-components'

export const VunorVueResolver: ComponentResolver = componentName => {
  if (componentName.startsWith('Vu')) {
    const name = componentName.slice(2)
    return {
      name: 'default',
      as: componentName,
      from: `vunor/${name}.vue`,
    }
  }
}
