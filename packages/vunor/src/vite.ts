/** What a resolver returns: the default export of `vunor/<Name>`, imported as `Vu<Name>`. */
export interface TVunorResolvedComponent {
  name: 'default'
  as: string
  from: string
}

/**
 * Component resolver for `unplugin-vue-components` (`Components({ resolvers: [VunorVueResolver] })`):
 * resolves `Vu<Name>` to `vunor/<Name>`. Typed structurally (it satisfies the plugin's
 * `ComponentResolver`), so vunor's types do not depend on unplugin-vue-components.
 */
export const VunorVueResolver = (componentName: string): TVunorResolvedComponent | undefined => {
  if (componentName.startsWith('Vu')) {
    const name = componentName.slice(2)
    return {
      name: 'default',
      as: componentName,
      from: `vunor/${name}`,
    }
  }
  return undefined
}
