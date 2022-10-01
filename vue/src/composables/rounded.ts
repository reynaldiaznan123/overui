
import { propsFactory } from '../utils/props'

export const makeRoundedProps = propsFactory({
  rounded: {
    type: [Boolean, Number, String]
  }
})