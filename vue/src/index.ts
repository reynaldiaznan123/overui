import { createUi as _createUi } from './framework'

import type { UiOptions } from './framework'

export { Alert, Menu } from './components'

export const createUi = (options?: UiOptions) => {
  return _createUi(options)
}
