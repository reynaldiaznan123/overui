// Styles
import './alert.sass'

import { mdiClose } from '@mdi/js'
import { computed, h, markRaw, ref, watch } from 'vue'

import type { PropType } from 'vue'

import { makeRoundedProps } from '../../composables/rounded'

import { defineComponent } from '../../utils/private/define'
import { slot } from '../../utils/private/render'

import { Icon } from '../icon'

export default markRaw(defineComponent({
  name: 'Alert',

  props: {
    modelValue: {
      type: Boolean,
      default: () => true
    },

    title: String,
    message: String,

    close: Boolean,

    ...makeRoundedProps()
  },

  emits: ['update:modelValue'],

  setup (props, { slots, emit }) {
    const active = ref(props.modelValue)
    
    watch(() => props.modelValue, (value) => {
      active.value = value
    })

    function createAfterComponent () {
      return h('div', {
        class: ['xcore-alert--after']
      }, slot(slots, 'after'))
    }

    function createBeforeComponent () {
      return h('div', {
        class: ['xcore-alert--before']
      }, slot(slots, 'before'))
    }

    function createTitleComponent () {
      return h('div', {
        class: ['xcore-alert--header__title']
      }, slot(slots, 'title', {
        title: props.title
      }, props.title))
    }

    function createCloseComponent () {
      return props.close && h('div', {
        class: ['xcore-alert--header__closable'],

        onClick () {
          active.value = !active.value

          emit('update:modelValue', false)
        }
      }, slot(slots, 'closable', {
        active: active.value
      }, h(Icon, { name: mdiClose, size: '18px' })))
    }

    function createContentComponent () {
      return h('div', {
        class: ['xcore-alert--content']
      }, [
        h('div', {
          class: [
            'xcore-alert--header'
          ],
        }, [
          createTitleComponent(),
          createCloseComponent()
        ]),

        slot(slots, 'default', {
          message: props.message
        }, props.message)
      ])
    }

    return () => {
      return active.value && h('div', {
        class: 'xcore-alert'
      }, h('div', {
        class: 'xcore-alert--wrapper'
      }, [
        slot(slots, 'out'),
        
        createBeforeComponent(),
        createContentComponent(),
        createAfterComponent()
      ]))
    }
  }
}))
