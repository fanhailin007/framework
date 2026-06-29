/**
 * @description 引入UnoCSS(项目实际并未使用，仅为有需求的用户提供)
 * @author sundan
 * @version 1.0.0
 */
// import('virtual:uno.css')

import { createHead } from '@vueuse/head'
// import ElementPlus from 'element-plus'
import { validateAppSecurity } from 'core-security'
import 'virtual:svg-icons-register'

import { ContextMenu, ContextMenuGroup, ContextMenuItem, ContextMenuSeparator } from 'vsv-context-menu'
import 'vsv-context-menu/lib/vue3-context-menu.css'
import { VabIcon } from 'vsv-icon'
import type { App } from 'vue'
import './styles/vab.scss'

validateAppSecurity()

export const setupVab = (app: App<Element>) => {
  // app.use(ElementPlus)
  app.use(createHead())
  app.component('VabIcon', VabIcon)
  app.component('VabContextMenu', ContextMenu)
  app.component('VabContextMenuGroup', ContextMenuGroup)
  app.component('VabContextMenuItem', ContextMenuItem)
  app.component('VabContextMenuSeparator', ContextMenuSeparator)
  const Plugins = import.meta.glob('./plugins/*.ts', { eager: true })
  Object.getOwnPropertyNames(Plugins).forEach((key) => {
    const plugin: any = Plugins[key]
    app.use(plugin.default)
  })
}
