import type { ComponentResolver } from 'unplugin-vue-components'
import { join } from 'node:path'

const wd = process.cwd()

export const nestedComponents = {
  InputShell: 'Input',
  CardHeader: 'Card',
  CardInner: 'Card',
  LoadingIndicator: 'Loading',
  MenuItem: 'Menu',
  SelectBase: 'Select',
} as Record<string, string | undefined>

export const VunorVueResolver: ComponentResolver = componentName => {
  if (componentName.startsWith('Vu')) {
    const name = componentName.slice(2)
    return {
      name: 'default',
      as: componentName,
      from: join(
        wd,
        `/node_modules/vunor/src/components/${nestedComponents[name] || name}/${name}.vue`
      ),
    }
  }
}
