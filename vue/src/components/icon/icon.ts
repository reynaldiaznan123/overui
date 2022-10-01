import './icon.sass'

import { computed, h, markRaw } from 'vue'

import { defineComponent } from '../../utils/private/define'
import { slot } from '../../utils/private/render'
import { isNull } from '../../utils/is'

const defaultViewBox = '0 0 24 24'

const libMap: any = {
  'mdi-': (i: string) => `mdi ${ i }`,
  'icon-': (i: string) => i, // fontawesome equiv
  'bt-': (i: string) => `bt ${ i }`,
  'eva-': (i: string) => `eva ${ i }`,
  'iconfont ': (i: string) => i,
  'ti-': (i: string) => `themify-icon ${ i }`,
  'bi-': (i: string) => `bootstrap-icons ${ i }`
}

const matMap: any = {
  o_: '-outlined',
  r_: '-round',
  s_: '-sharp'
}

const libRE = new RegExp('^(' + Object.keys(libMap).join('|') + ')')
const matRE = new RegExp('^(' + Object.keys(matMap).join('|') + ')')
const mRE = /^[Mm]\s?[-+]?\.?\d/
const imgRE = /^img:/
const svgUseRE = /^svguse:/
const faRE = /^(fa-(solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /

export default markRaw(defineComponent({
  name: 'Icon',

  props: {
    tag: {
      type: String,
      default: 'i'
    },

    size: String,

    name: String
  },

  setup (props, { slots }) {
    const classes = computed(() => [
      'xcore-icon'
    ])

    const type = computed(() => {
      let classes
      let icon = props.name

      if (icon === 'none' || !icon) {
        return { none: true }
      }

      if (mRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split('|')

        return {
          svg: true,
          viewBox,
          nodes: def.split('&&').map(path => {
            const [ d, style, transform ] = path.split('@@')
            return h('path', { style, d, transform })
          })
        }
      }

      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        }
      }

      if (svgUseRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split('|')

        return {
          svguse: true,
          src: def.substring(7),
          viewBox
        }
      }

      let content = ' '

      const matches: string[] | null = icon.match(libRE)
      if (isNull(matches)) {
        classes = libMap[matches![1]](icon)
      } else if (faRE.test(icon) === true) {
        classes = icon
      } else {
        // "notranslate" class is for Google Translate
        // to avoid tampering with Material Icons ligature font
        //
        // Caution: To be able to add suffix to the class name,
        // keep the 'material-icons' at the end of the string.
        classes = 'notranslate material-icons'

        const matches = icon.match(matRE)
        if (isNull(matches)) {
          icon = icon.substring(2)
          classes += matMap[matches![1]]
        }

        content = icon
      }

      return {
        classes,
        content
      }
    })

    return () => {
      const data = {
        class: classes.value,
        style: {
          fontSize: props.size
        },
        role: 'presentation'
      }

      if (type.value.none === true) {
        return h(props.tag, data, slot(slots, 'default'))
      }

      if (type.value.img === true) {
        return h('span', data, slot(slots, 'default', {}, [
          h('img', {
            src: type.value.src
          })
        ]))
      }

      if (type.value.svg === true) {
        return h('span', data, slot(slots, 'default', {}, [
          h('svg', {
            viewBox: type.value.viewBox
          }, type.value.nodes)
        ]))
      }


      if (type.value.svguse === true) {
        return h('span', data, slot(slots, 'default', {}, [
          h('svg', {
            viewBox: type.value.viewBox
          }, [
            h('use', { 'xlink:href': type.value.src })
          ])
        ]))
      }

      return h(props.tag, data, slot(slots, 'default', {}, [
        type.value.content
      ]))
    }
  }
}))