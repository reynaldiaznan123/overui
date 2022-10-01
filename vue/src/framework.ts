import { App, reactive } from 'vue'

export interface UiOptions {
  dark: boolean | 'automatical',
}

export function createUi (options?: UiOptions) {
  const install = (app: App) => {
    app.mixin({
      computed: {
        $xcore () {
          return reactive({})
        }
      }
    })
  }

  return { install }
}
