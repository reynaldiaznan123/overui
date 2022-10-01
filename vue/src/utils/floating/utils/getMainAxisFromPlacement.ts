
import type {Axis, Placement} from '@floating-ui/dom';
import {getSide} from './getSide';

export function getMainAxisFromPlacement(placement: Placement): Axis {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
}