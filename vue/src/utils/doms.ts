import { VirtualElement } from '../types'
import {
  isArray,
  isBrowser,
  isContainingBlock,
  isElement,
  isFunction,
  isHTMLElement,
  isLayoutViewport,
  isNode,
  isNull,
  isOverflowElement,
  isScaled,
  isScrollElement,
  isShadowRoot,
  isUndefined,
  isWindow
} from './is'

type RootBoundary = 'viewport' | 'document'
type Boundary = Element | RootBoundary

export function getWindow(el?: Node | Window): Window | null {
  if (isBrowser()) {
    if (isUndefined(el) || isNull(el)) {
      return window
    }

    if (!isWindow(el)) {
      const owner = el?.ownerDocument
      return owner ? owner.defaultView || window : window
    }

    return el
  }

  return null
}

export function getNodeName(node: Node | Window): string {
  return isWindow(node)
    ? '' : (node ? (node.nodeName || '').toLowerCase() : '')
}

export function getComputedStyle(el: Element) {
  if (
    document.defaultView &&
    isFunction(document.defaultView.getComputedStyle)
  ) {
    return document.defaultView.getComputedStyle(el)
  } else if (
    window.getComputedStyle &&
    isFunction(window.getComputedStyle)
  ) {
    return window.getComputedStyle(el)
  }

  const getComputedStyle = getWindow(el)?.getComputedStyle

  return isFunction(getComputedStyle)
    ? getComputedStyle!(el) : (el as HTMLElement).style
}

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === 'html') {
    return node
  }

  return (
    (node as any).assignedSlot ||
    node.parentNode ||
    (isShadowRoot(node) ? node.host : null) ||
    getDocumentElement(node as any)
  )
}

function getTrueOffsetParent(el: Element) {
  if (
    !isHTMLElement(el) ||
    getComputedStyle(el).position === 'fixed'
  ) {
    return null
  }
  return el.offsetParent
}

function getContainingBlock(el: Element | Node) {
  let currentNode: Node | null = getParentNode(el)

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host
  }

  while (
    isHTMLElement(currentNode) &&
    !['html', 'body'].includes(getNodeName(currentNode))
  ) {
    if (isContainingBlock(currentNode)) {
      return currentNode
    } else {
      currentNode = currentNode.parentNode
    }
  }

  return null
}

export function getOffsetParent(el: Element): Element | Window | null {
  if (el && isBrowser()) {
    const window = getWindow(el) as (Window & typeof globalThis)
    
    let offsetParent = getTrueOffsetParent(el)
    while (
      offsetParent &&
      getComputedStyle(el).position === 'static'
    ) {
      offsetParent = getTrueOffsetParent(offsetParent)
    }

    if (
      offsetParent &&
      (
        getNodeName(offsetParent) === 'html' || (
          getNodeName(offsetParent) === 'body' &&
          getComputedStyle(offsetParent).position === 'static' &&
          !isContainingBlock(offsetParent)
        )
      )
    ) {
      return window
    }

    return offsetParent || getContainingBlock(el) || window
  }

  return null
}

export function getDocumentElement(node: Node | Window): HTMLElement {
  return (
    (isNode(node) ? node.ownerDocument : node.document) || window.document
  ).documentElement
}

export function getNodeScroll (el: Element | Window) {
  if (isElement(el)) {
    return {
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop
    }
  }

  return {
    scrollLeft: el.pageXOffset ?? el.scrollX,
    scrollTop: el.pageYOffset ?? el.scrollY
  }
}

function getWindowScrollBarX(el: Element): number {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return (
    getBoundingClientRect(getDocumentElement(el as any)).left +
    getNodeScroll(el).scrollLeft
  )
}

export function getDimensions(element: Element) {
  if (isHTMLElement(element)) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    }
  }

  const rect = getBoundingClientRect(element)
  return {
    width: rect.width,
    height: rect.height
  }
}

export function getRectRelativeToOffsetParent (
  el: Element | VirtualElement,
  offsetParent: Element | Window,
  strategy: string,
) {
  const isFixedStrategy = strategy === 'fixed'
  const isOffsetParent = isHTMLElement(offsetParent)
  const documentElement = getDocumentElement(offsetParent)
  const rect = getBoundingClientRect(
    el,
    isOffsetParent && isScaled(offsetParent),
    isFixedStrategy,
  )
  
  const scroll = {
    scrollLeft: 0,
    scrollTop: 0
  }
  const offset = {
    x: 0,
    y: 0
  }

  if (isOffsetParent || (!isOffsetParent && !isFixedStrategy)) {
    if (
        getNodeName(offsetParent) !== 'body' ||
        isOverflowElement(documentElement)
    ) {
      scroll.scrollLeft = getNodeScroll(offsetParent).scrollLeft
      scroll.scrollTop = getNodeScroll(offsetParent).scrollTop
    }

    if (isHTMLElement(offsetParent)) {
      const rect = getBoundingClientRect(offsetParent, true)
      offset.x = rect.x + (offsetParent).clientLeft
      offset.y = rect.y + (offsetParent).clientTop
    } else if (documentElement) {
      offset.x = getWindowScrollBarX(documentElement)
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offset.x,
    y: rect.top + scroll.scrollTop - offset.y,
    width: rect.width,
    height: rect.height
  }
}

export function getBoundingClientRect (
  el: Element | VirtualElement,
  includeScale = false,
  isFixedStrategy = false
) {
  const rect = el.getBoundingClientRect()

  let scaleX = 1
  let scaleY = 1

  if (includeScale && isHTMLElement(el)) {
    scaleX = el.offsetWidth > 0 ? rect.width / el.offsetWidth || 1 : 1
    scaleY = el.offsetHeight > 0 ? rect.height / el.offsetHeight || 1 : 1
  }

  const layer = isElement(el) ? getWindow(el) : window
  const isVisualOffsets = !isLayoutViewport() && isFixedStrategy

  const x = (
    rect.left + (
      isVisualOffsets ? layer?.visualViewport?.offsetLeft ?? 0 : 0
    )
  ) / scaleX
  const y = (
    rect.top + (
      isVisualOffsets ? layer?.visualViewport?.offsetTop ?? 0 : 0
    )
  ) / scaleY
  const w = rect.width / scaleX
  const h = rect.height / scaleY

  return {
    x: x,
    y: y,
    width: w,
    height: h,
    top: y,
    right: x + w,
    bottom: y + h,
    left: x,
  }
}

export function getDocumentRect (el: HTMLElement) {
  const html = getDocumentElement(el as any)
  const scroll = getNodeScroll(el)
  const body = el.ownerDocument?.body

  const width = Math.max(
    html.scrollWidth,
    html.clientWidth,
    body ? body.scrollWidth : 0,
    body ? body.clientWidth : 0
  )
  const height = Math.max(
    html.scrollHeight,
    html.clientHeight,
    body ? body.scrollHeight : 0,
    body ? body.clientHeight : 0
  )

  let x = -scroll.scrollLeft + getWindowScrollBarX(el)
  const y = -scroll.scrollTop

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += Math.max(html.clientWidth, body ? body.clientWidth : 0) - width
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  }
}

export function getViewportRect(el: Element, strategy: string) {
  const layer = getWindow(el)
  const html = getDocumentElement(el as any)
  const visualViewport = layer?.visualViewport

  let width = html.clientWidth
  let height = html.clientHeight
  let x = 0
  let y = 0

  if (visualViewport) {
    width = visualViewport.width
    height = visualViewport.height

    const layoutViewport = isLayoutViewport()

    if (layoutViewport || (!layoutViewport && strategy === 'fixed')) {
      x = visualViewport.offsetLeft
      y = visualViewport.offsetTop
    }
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  }
}

export function getNearestOverflowAncestor(node: Node): HTMLElement {
  const parentNode = getParentNode(node)
  const selectors = ['html', 'body', '#document']

  if (selectors.includes(getNodeName(parentNode))) {
    // @ts-ignore assume body is always available
    return node.ownerDocument.body
  }

  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode
  }

  return getNearestOverflowAncestor(parentNode)
}

export function getOverflowAncestors(
  node: Node,
  list: Array<Element | Window> = []
): Array<Element | Window | VisualViewport> {
  const scrollableAncestor = getNearestOverflowAncestor(node)
  const isBody = scrollableAncestor === node.ownerDocument?.body
  const layer = getWindow(scrollableAncestor)
  const target = isBody
    ? ([layer] as any).concat(
        layer?.visualViewport || [],
        isOverflowElement(scrollableAncestor) ? scrollableAncestor : []
      )
    : scrollableAncestor
  const updatedList = list.concat(target)

  return isBody
    ? updatedList
    : // @ts-ignore: isBody tells us target will be an HTMLElement here
      updatedList.concat(getOverflowAncestors(target))
}

function getInnerBoundingClientRect(el: Element, strategy: string) {
  const clientRect = getBoundingClientRect(
    el, false, strategy === 'fixed'
  )
  const top = clientRect.top + el.clientTop
  const left = clientRect.left + el.clientLeft

  return {
    top,
    left,
    x: left,
    y: top,
    right: left + el.clientWidth,
    bottom: top + el.clientHeight,
    width: el.clientWidth,
    height: el.clientHeight,
  }
}

function getClientRectFromClippingAncestor(
  el: Element,
  clipping: Boundary,
  strategy: string
) {
  if (clipping === 'viewport') {
    return rectToClientRect(getViewportRect(el, strategy))
  }

  if (isElement(clipping)) {
    return getInnerBoundingClientRect(clipping, strategy)
  }

  return rectToClientRect(
    getDocumentRect(getDocumentElement(el as any))
  )
}

function elementContains(parent: Element, child: Element): boolean {
  const rootNode = child.getRootNode?.()

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true
  }
  // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
    let next = child
    do {
      // use `===` replace node.isSameNode()
      if (next && parent === next) {
        return true
      }
      // @ts-ignore: need a better way to handle this...
      next = next.parentNode || next.host
    } while (next)
  }

  return false
}

function getClippingAncestors(element: Element): Array<Element> {
  const clippingAncestors = getOverflowAncestors(element)
  const canEscapeClipping = ['absolute', 'fixed'].includes(
    getComputedStyle(element).position
  )
  const clipperElement = canEscapeClipping && isHTMLElement(element)
    ? getOffsetParent(element) : element

  if (!isElement(clipperElement)) {
    return []
  }

  // @ts-ignore isElement check ensures we return Array<Element>
  return clippingAncestors.filter(
    (clippingAncestor) =>
      isElement(clippingAncestor) &&
      elementContains(clippingAncestor, clipperElement) &&
      isScrollElement(clippingAncestor) &&
      getNodeName(clippingAncestor) !== 'body'
  )
}

export function rectToClientRect(rect: any) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height,
  }
}

export function getClippingRect({
  element,
  boundary,
  rootBoundary,
  strategy,
}: {
  element: Element
  boundary: 'clippingAncestors' | Boundary | Boundary[]
  rootBoundary: RootBoundary
  strategy: string
}) {
  const ancestors: Boundary[] = boundary === 'clippingAncestors'
    ? getClippingAncestors(element)
    : ([] as Boundary[]).concat(
        isArray(boundary) ? boundary : [boundary]
      )
  const clippingAncestors = [
    ...ancestors, rootBoundary
  ].filter((row) => {
    return row === 'document' ||
      row === 'viewport' ||
      isHTMLElement(row) ||
      isElement(row) ||
      isNode(row)
  })
  const firstClippingAncestor = clippingAncestors[0]

  const clipping = ancestors.reduce((acc, ancestor) => {
    const rect = getClientRectFromClippingAncestor(
      element, ancestor, strategy
    )

    acc.top = Math.max(rect.top, acc.top)
    acc.right = Math.min(rect.right, acc.right)
    acc.bottom = Math.min(rect.bottom, acc.bottom)
    acc.left = Math.max(rect.left, acc.left)

    return acc
  }, getClientRectFromClippingAncestor(
    element, firstClippingAncestor, strategy
  ))

  return {
    width: clipping.right - clipping.left,
    height: clipping.bottom - clipping.top,
    x: clipping.left,
    y: clipping.top
  }
}
