import {isElement} from './is';

export function getNodeScroll(element: Element | Window) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }

  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset,
  };
}
