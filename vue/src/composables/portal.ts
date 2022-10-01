import {
  getCurrentInstance,
  h,
  onUnmounted,
  ref,
  Teleport,
  VNode
} from 'vue'

import { isEmpty } from '../utils/is'
import { portals } from '../utils/private/portal'

interface Props {
  inner?: any
  global?: boolean
  render: () => VNode
}

export default function({ inner, global, render }: Props) {
  let el: HTMLElement | string | null = null

  const isActive = ref(false)
  const isAccessible = ref(false)

  let show = (isReady?: boolean) => {}
  let hide = (isReady?: boolean) => {}

  const onGlobal = global

  const vm = getCurrentInstance()
  if (vm !== null) {
    show = (isReady) => {
      if (isReady === true) {
        isAccessible.value = true
      } else {
        isAccessible.value = false

        if (isActive.value === false) {
          if (!onGlobal && el === null) {
            el = 'body'
          }

          isActive.value = true

          portals.push(vm.proxy)
        }
      }
    }

    hide = (isReady) => {
      isAccessible.value = false

      if (isReady === true) {
        isActive.value = false

        const index = portals.indexOf(vm.proxy)
        if (index > -1) {
          portals.splice(index, 1)
        }
      }
    }
  }

  onUnmounted(() => {
    hide()
  })

  return {
    isActive: isActive,
    isAccessible: isAccessible,

    show: show,
    hide: hide,

    render: () => {
      if (isActive.value === true) {
        if (onGlobal === true && isEmpty(el)) {
          return render()
        }
  
        return h(Teleport, {
          to: 'body',
        }, render())
      }

      return []
    }
  }
}