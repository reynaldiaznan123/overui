import type { Placement, Side } from '@floating-ui/dom';

export function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}