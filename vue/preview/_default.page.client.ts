import './styles/tailwind.css'
import './styles/app.css'

import { getPage } from 'vite-plugin-ssr/client'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'

import { createApp } from './app'
import type { PageContext } from './types'

hydrate()

export async function hydrate () {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const context = await getPage<PageContextBuiltInClient & PageContext>()
  const app = createApp(context)

  app.mount('#app')
}
