import {
  getDeviceInfo,
  getUserAgentDataString
} from './browsers'
import {
  getBoundingClientRect,
  getComputedStyle,
  getWindow
} from './doms'

export function isServer() {
  return typeof process !== 'undefined'
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function isDefined(value: any): boolean {
  return !isUndefined(value)
}

export function isUndefined (value: any): boolean {
  return typeof value === 'undefined'
}

export function isArray(value: any): value is any[] {
  if (isFunction(Array.isArray)) {
    return isDefined(value) && Array.isArray(value)
  }
  return Object.prototype.toString.call(value) === '[object Array]'
}

export function isNumber(value: any): boolean {
  return typeof value === 'number'
}

export function isNumeric(value: any): boolean {
  return isDefined(value) && isFinite(value) && !isNaN(parseFloat(value))
}

export function isObject(value: any): boolean {
  return typeof value === 'object'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isFunction(value: any): boolean {
  return typeof value === 'function'
}

export function isAsyncFunction(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object AsyncFunction]'
}

export function isAsync(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Promise]'
}

export function isSync(value: any): boolean {
  if (isAsync(value) || isAsyncFunction(value)) {
    return false;
  }
  return true;
}

export function isPromise(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Promise]'
}

export function isRegExp(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

export function isNull(value: any): boolean {
  return value === null
}

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean'
}

export function isNotEmpty(value: any): boolean {
  return !isEmpty(value)
}

export function isEmpty(value: any): boolean {
  if (value == null) {
    return true
  } else if (value.length != null) {
    return value.length === 0
  } else if (isBoolean(value)) {
    return false
  } else if (isNumber(value)) {
    return isNaN(value)
  } else if (isObject(value)) {
    return Object.keys(value).length === 0
  }
  return false
}

export function isWindow(value: any): value is Window {
  if (isBrowser()) {
    return value instanceof Window ||
      value.document && value.location
  }
  return false
}

export function isElement(value: any): value is Element {
  if (isBrowser()) {
    return value instanceof window.Element ||
      value instanceof getWindow(value)!.Element
  }
  return false
}

export function isHTMLElement(value: any): value is HTMLElement {
  if (isBrowser()) {
    return value instanceof window.HTMLElement ||
      value instanceof getWindow(value)!.HTMLElement
  }
  return false
}

export function isNode(value: any): value is Node {
  if (isBrowser()) {
    return value instanceof window.Node ||
      value instanceof getWindow(value)!.Node
  }
  return false
}

export function isOverflowElement(element: Element): boolean {
  // Firefox wants us to check `-x` and `-y` variations as well
  const { overflow, overflowX, overflowY } = getComputedStyle(element)
  return /visible|auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)
}

export function isScrollElement(element: Element): boolean {
  const ignoree = [
    'overflow-auto',
    'overflow-scroll',
    'overflow-y-auto',
    'overflow-x-auto',
    'overflow-y-scroll',
    'overflow-x-scroll',
    '--o-scroll',
    '--o-scroll-y',
    '--o-scroll-x',
    '--o-overflow-auto',
    '--o-overflow-scroll',
    '--o-overflow-y-auto',
    '--o-overflow-x-auto',
    '--o-overflow-y-scroll',
    '--o-overflow-x-scroll'
  ]

  const { overflow, overflowX, overflowY } = getComputedStyle(element)
  return /auto|scroll|hidden/.test(overflow + overflowY + overflowX) ||
    ignoree.find((v) => element.classList.contains(v)) !== undefined
}

export function isScaled(el: HTMLElement): boolean {
  const rect = getBoundingClientRect(el)
  return (
    Math.round(rect.width) !== el.offsetWidth ||
    Math.round(rect.height) !== el.offsetHeight
  )
}

export function isShadowRoot(node: Node): node is ShadowRoot {
  if (isBrowser()) {
    if (isUndefined(ShadowRoot)) {
      return false
    }

    const ownElement = getWindow(node)?.ShadowRoot
    return ownElement !== undefined && node instanceof ownElement ||
      node instanceof ShadowRoot
  }

  return false
}

export function isLayoutViewport(): boolean {
  const device = getDeviceInfo()
  if (device !== null) {
    const { browser: { name } } = device
    return !/^((?!chrome|android).)*safari/i.test(name as string)
  }

  // Not Safari
  return !/^((?!chrome|android).)*safari/i.test(getUserAgentDataString())

  // Feature detection for this fails in various ways
  // • Always-visible scrollbar or not
  // • Width of <html>, etc.
  // const vV = win.visualViewport;
  // return vV ? Math.abs(win.innerWidth / vV.scale - vV.width) < 0.5 : true;
}

export function isContainingBlock(element: Element): boolean {
  // TODO: Try and use feature detection here instead
  const deviceInfo = getDeviceInfo()
  const browserName = deviceInfo?.browser.name
  const isFirefox = browserName === 'firefox'
  const css = getComputedStyle(element)

  // This is non-exhaustive but covers the most common CSS properties that
  // create a containing block.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== 'none' ||
    css.perspective !== 'none' ||
    css.contain === 'paint' ||
    ['transform', 'perspective'].includes(css.willChange) ||
    (isFirefox && css.willChange === 'filter') ||
    (isFirefox && (css.filter ? css.filter !== 'none' : false))
  )
}
