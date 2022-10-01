// @ts-ignore
import { createUi, Alert, Menu } from '../src'
import { createSSRApp, h } from 'vue'

// @ts-ignore
import App from './src/App.vue'

export function createApp (context) {
  const { Page, pageProps: props } = context
  const app = createSSRApp({
    render () {
      return h(
        App,
        {},
        {
          default () {
            return h(Page, props || {})
          }
        },
      )
    },
  })

  app.component(Alert.name, Alert)
  app.component(Menu.name, Menu)

  app.use(createUi())

  return app
}
