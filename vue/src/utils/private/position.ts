import { FloatingElement, ReferenceElement } from '../../types'
import {
  getBoundingClientRect,
  getClippingRect,
  getDimensions,
  getDocumentElement,
  getNodeName,
  getNodeScroll,
  getOffsetParent,
  getRectRelativeToOffsetParent,
  rectToClientRect
} from '../doms'
import {
  isElement,
  isHTMLElement,
  isOverflowElement
} from '../is'

type Side = 'top' | 'right' | 'bottom' | 'left'
type SideObject = {
  [key in Side]: number
}
type Padding = number | {
  [key in Side]?: number
}
type VerticalAxis = 'top' | 'center' | 'bottom'
type HorizontalAxis = 'left' | 'middle' | 'right'

interface PositionVertical {
  floating: VerticalAxis
  reference: VerticalAxis
}

interface PositionProps {
  elements: {
    floating: FloatingElement
    reference: ReferenceElement
  }
  placements: {
    floating: {
      vertical: VerticalAxis
      horizontal: HorizontalAxis
    }
    reference: {
      vertical: VerticalAxis
      horizontal: HorizontalAxis
    }
  }
  hidden?: boolean
  strategy: string
}

const overflows = []

function getElementRects(
  floating: FloatingElement,
  reference: ReferenceElement
) {
  const engine = {
    floating: {
      ...getDimensions(floating),
      x: 0,
      y: 0,
    },
    reference: getRectRelativeToOffsetParent(
      reference,
      getOffsetParent(floating)!,
      floating.style.position,
    )
  }

  return {
    floating: {
      ...engine.floating,
      center: engine.floating.height / 2,
      middle: engine.floating.width / 2,
    },
    reference: {
      ...engine.reference,
      center: engine.reference.y + (
        (
          engine.reference.y + engine.reference.height
        ) - engine.reference.y
      ) / 2,
      middle: engine.reference.x + (
        (
          engine.reference.x + engine.reference.width
        ) - engine.reference.x
      ) / 2,
    }
  }
}

function getViewportRelativeRect({
  rect,
  offsetParent,
  strategy,
}: {
  rect: any
  offsetParent: Element | Window
  strategy: string
}) {
  const isOffsetParent = isHTMLElement(offsetParent)
  const documentElement = getDocumentElement(offsetParent)

  if (offsetParent === documentElement) {
    return rect
  }

  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  }
  const offset = {
    x: 0,
    y: 0
  }

  if (
    isOffsetParent ||
    (!isOffsetParent && strategy !== 'fixed')
  ) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent)
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true)
      offset.x = offsetRect.x + offsetParent.clientLeft
      offset.y = offsetRect.y + offsetParent.clientTop
    }
  }

  return {
    ...rect,
    x: rect.x - scroll.scrollLeft + offset.x,
    y: rect.y - scroll.scrollTop + offset.y,
  }
}

function detectOverflow(options: any) {
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0,
    elements,
    x,
    y,
    rects,
    strategy
  } = options

  const paddingObject = getSideObjectFromPadding(padding)
  const altContext = elementContext === 'floating' ? 'reference' : 'floating'
  const element = elements[altBoundary ? altContext : elementContext]

  const clippingClientRect = rectToClientRect(
    getClippingRect({
      element:
        (isElement(element)) ?? true
          ? element
          : element.contextElement ||
            (getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy,
    })
  )
  const elementClientRect = rectToClientRect(
    getViewportRelativeRect
      ? getViewportRelativeRect({
          rect:
            elementContext === 'floating'
              ? {...rects.floating, x, y}
              : rects.reference,
          offsetParent: getOffsetParent(elements.floating)!,
          strategy,
        })
      : rects[elementContext]
  )

  return {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right,
  }
}

function getSideObjectFromPadding(padding: Padding): SideObject {
  return typeof padding !== 'number'
    ? { left: 0, top: 0, right: 0, bottom: 0, ...padding }
    : { left: padding, top: padding, right: padding, bottom: padding }
}

export function setPosition({
  elements,
  placements,
  hidden,
  strategy
}: PositionProps) {
  const rects = getElementRects(
    elements.floating,
    elements.reference
  )
  const props = {
    floating: {
      top: rects.floating.y,
      right: rects.floating.x + rects.floating.width,
      left: rects.floating.x,
      bottom: rects.floating.y + rects.floating.height,
      center: rects.floating.center,
      middle: rects.floating.middle
    },
    reference: {
      top: rects.reference.y,
      right: rects.reference.x + rects.reference.width,
      left: rects.reference.x,
      bottom: rects.reference.y + rects.reference.height,
      center: rects.reference.center,
      middle: rects.reference.middle
    }
  }
  const vertical = {
    floating: placements.floating.vertical,
    reference: placements.reference.vertical
  }
  const horizontal = {
    floating: placements.floating.horizontal,
    reference: placements.reference.horizontal
  }
  const floating = {
    vertical: props.floating[vertical.floating],
    horizontal: props.floating[horizontal.floating]
  }
  const reference = {
    vertical: props.reference[vertical.reference],
    horizontal: props.reference[horizontal.reference]
  }
  const styles = {
    top: reference.vertical - floating.vertical,
    left: reference.horizontal - floating.horizontal
  }
  const overflow = detectOverflow({
    elements: elements,
    rects: rects,
    y: styles.top,
    x: styles.left,
    strategy: strategy,
    // altBoundary: true,
    // boundary: elements.reference.parentElement?.parentElement,
    // elementContext: 'reference'
  })

  console.log(overflow)

  const top = Math.ceil(overflow.top)
  const bottom = Math.ceil(overflow.bottom)
  if (
    vertical.floating === 'center' &&
    vertical.reference !== 'center'
  ) {
    if (top > -0.5) {
      styles.top = props.reference.bottom - props.floating.center
    } else if (bottom > -0.5) {
      styles.top = props.reference.top - props.floating.center
    }
  } else if (
    vertical.reference === 'center' &&
    vertical.floating !== 'center'
  ) {
    if (top > -0.5) {
      styles.top = props.reference.center - props.floating.top
    } else if (bottom > -0.5) {
      styles.top = props.reference.center - props.floating.bottom
    }
  } else if (
    vertical.floating === 'center' &&
    vertical.reference === 'center'
  ) {
    if (top > -0.5) {
      styles.top = props.reference.bottom - props.floating.top
    } else if (bottom > -0.5) {
      styles.top = props.reference.top - props.floating.bottom
    }
  } else {
    if (top > -0.5) {
      const positions: PositionVertical = {
        floating: vertical.floating === 'top' ? 'top' : 'bottom',
        reference: vertical.reference === 'top' ? 'top' : 'bottom'
      }
      styles.top = (
        props.reference[positions.reference] -
        props.floating[positions.floating]
      )
    } else if (bottom > -0.5) {
      console.log('test')
      const positions: PositionVertical = {
        floating: vertical.floating === 'top' ? 'bottom' : 'top',
        reference: vertical.reference === 'top' ? 'bottom' : 'top'
      }
      styles.top = (
        props.reference[positions.reference] -
        props.floating[positions.floating]
      )
    }
  }
  
  const right = Math.ceil(overflow.right)
  const left = Math.ceil(overflow.left)
  if (
    (
      horizontal.floating === 'right' &&
      horizontal.reference === 'left'
    ) ||
    (
      horizontal.floating === 'left' &&
      horizontal.reference === 'right'
    )
  ) {
    if (right > -0.5) {
      styles.left = props.reference.left - props.floating.right
    } else if (left > -0.5) {
      styles.left = props.reference.right - props.floating.left
    }
  } else if (
    horizontal.reference === 'middle' &&
    horizontal.floating !== 'middle'
  ) {
    if (right > -0.5) {
      styles.left = props.reference.middle - props.floating.right
    } else if (left > -0.5) {
      styles.left = props.reference.middle - props.floating.left
    }
  } else if (
    horizontal.floating === 'middle' &&
    horizontal.reference !== 'middle'
  ) {
    if (right > -0.5) {
      styles.left = props.reference.left - props.floating.middle
    } else if (left > -0.5) {
      styles.left = props.reference.right - props.floating.middle
    }
  }

  // let visible = true
  // if (hidden === true) {
  //   const overflow = detectOverflow({
  //     elements: elements,
  //     rects: rects,
  //     y: styles.top,
  //     x: styles.left,
  //     strategy: strategy,
  //     altBoundary: true
  //   })

  //   const top = Math.ceil(overflow.top)
  //   const bottom = Math.ceil(overflow.bottom)
  //   if (top > -0.5) {
  //     visible = false
  //   } else if (bottom > -0.5) {
  //     visible = false
  //   }

  //   const right = Math.ceil(overflow.top)
  //   const left = Math.ceil(overflow.bottom)
  //   if (right > -0.5) {
  //     visible = false
  //   } else if (left > -0.5) {
  //     visible = false
  //   }
  // }

  // if (visible === false) {
  //   elements.floating.style.visibility = 'hidden'
  // } else {
  //   elements.floating.style.visibility = 'visible'
  // }

  // elements.floating.style.top = `${styles.top}px`
  // elements.floating.style.left = `${styles.left}px`
  // elements.floating.style.width = `${rects.reference.width}px`
}

