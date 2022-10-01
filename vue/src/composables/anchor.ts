import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { isDefined, isNotEmpty, isString } from '../utils/is'

type Target = HTMLElement | Element | Node | null

interface Props {

}

export const useAnchorProps = {
  target: {
    default: true
  },
  noParentEvent: Boolean,
  contextMenu: Boolean,
}

export default function({}: Props) {
  const el = ref<Target>(null)

  
  const vm = getCurrentInstance()
  
  function pickEl() {
    if (
      vm?.props?.target === false ||
      vm?.props?.target === '' ||
      vm?.proxy?.$el?.parentNode === null
    ) {
      el.value = null
    } else if (
      vm?.props?.target === true &&
      vm?.proxy?.$el?.parentNode
    ) {
      setEl(vm.proxy.$el.parentNode)
    } else if (
      vm?.props.target
    ) {
      let target: any = vm.props.target

      if (isString(target)) {
        try {
          target = document.querySelector(target)
        } catch (e) {}
      }

      if (isNotEmpty(target) && isDefined(target)) {
        el.value = target?.$el || target
      } else {
        el.value = null
      }
    }

    if (el.value === null) {
      console.error(`Anchor: target element is not found`)
    }
  }

  function setEl(node: Node) {
    el.value = node
  }

  watch(() => vm?.props?.contextMenu, (val) => {
    if (el.value !== null) {

    }
  })

  watch(() => vm?.props?.target, (val) => {
    if (el.value !== null) {

    }

    pickEl()
  })

  watch(() => vm?.props?.noParentEvent, (val) => {
    if (el.value !== null) {

    }
  })

  onMounted(() => {
    pickEl()
  })

  return {
    el: el,
  }
}