import {
  getCurrentInstance,
  shallowReactive,
  shallowRef,
  toRaw,
  watchEffect
} from 'vue'

import type {
  ComponentInternalInstance,
  ComponentOptions,
  ComponentOptionsMixin,
  ComponentOptionsWithoutProps,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps,
  ComponentPropsOptions,
  ComputedOptions,
  DefineComponent,
  EmitsOptions,
  MethodOptions,
  RenderFunction,
  SetupContext
} from 'vue'

type PropsComponent = Readonly<object>
type ResultComponent = object | RenderFunction

// https://github.com/vuejs/core/blob/main/packages/runtime-core/src/apiDefineComponent.ts
export function defineComponent<Props, RawBindings = object
> (
  setup: (
    props: Readonly<Props>,
    ctx: SetupContext
  ) => RawBindings | RenderFunction
): DefineComponent<Props, RawBindings>
export function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string
> (
  options: ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): DefineComponent<Props, RawBindings, D, C, M, Mixin, Extends, E, EE>
export function defineComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
> (
  options: ComponentOptionsWithArrayProps<
    PropNames,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): DefineComponent<Readonly<{ [key in PropNames]?: any }>, RawBindings, D, C, M, Mixin, Extends, E, EE>
export function defineComponent<
  // the Readonly constraint allows TS to treat the type of { required: true }
  // as constant instead of boolean.
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string
> (
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  >
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>
export function defineComponent (options: Function | ComponentOptions) {
  const name = typeof options === 'function' ? options.name : options.name
  const setup = typeof options === 'function' ? options : options.setup
  if (setup) {
    const custom = (props: Readonly<Record<string, any>>, context: SetupContext): ResultComponent => {
      const instance = getCurrentInstance() as ComponentInternalInstance
      
      const _subcomponent = shallowRef()
      const _props = shallowReactive({ ...toRaw(props) })

      watchEffect(() => {

      })

      const bindings = setup(props, context)

      return bindings
    }

    if (typeof options === 'function') {
      options = custom
    } else if (options.setup) {
      options.setup = custom
    }
  }

  return typeof options === 'function'
    ? { setup: options, name: options.name } : options
}
