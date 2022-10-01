
import type {Axis, Length} from '@floating-ui/dom';

export function getLengthFromAxis(axis: Axis): Length {
  return axis === 'y' ? 'height' : 'width';
}