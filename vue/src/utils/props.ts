import type { ComponentObjectPropsOptions, Prop, PropType } from 'vue'

export function propsFactory<
  PropsOptions extends ComponentObjectPropsOptions
> (props: PropsOptions, source?: string) {
  return <Defaults extends PartialKeys<PropsOptions> = {}>(
    defaults?: Defaults
  ): AppendDefault<PropsOptions, Defaults> => {
    return Object.keys(props).reduce<any>((obj, prop) => {
      const definition = typeof props[prop] === 'object'
        ? props[prop] : { type: props[prop] }
      
      if (defaults && prop in defaults) {
        obj[prop] = {
          ...definition,
          default: defaults[prop]
        }
      } else {
        obj[prop] = definition
      }

      if (source) {
        obj[prop].source = source
      }

      return obj
    }, {})
  }
}

type ObjectStructure = {
  [key: string]: any
}

type PartialKeys<T> = { [P in keyof T]?: unknown }

type AppendDefault<T extends ComponentObjectPropsOptions, D extends PartialKeys<T>> = {
  [P in keyof T]-?: unknown extends D[P]
    ? T[P]
    : T[P] extends Record<string, unknown>
      ? Omit<T[P], 'type' | 'default'> & {
        type: PropType<MergeDefault<T[P], D[P]>>
        default: MergeDefault<T[P], D[P]>
      }
      : {
        type: PropType<MergeDefault<T[P], D[P]>>
        default: MergeDefault<T[P], D[P]>
      }
}

type MergeDefault<T, D> = unknown extends D ? InferPropType<T> : (NonNullable<InferPropType<T>> | D)

type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D> ? (unknown extends V ? D : V) : T
