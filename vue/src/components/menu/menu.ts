import './menu.sass'

import { h, nextTick, onBeforeMount, onMounted, ref } from 'vue'

import useAnchor, { useAnchorProps } from '../../composables/anchor'
import usePortal from '../../composables/portal'

import { defineComponent } from '../../utils/private/define'
import { setPosition } from '../../utils/private/position'
import {
  AlignedPlacement,
  Alignment, 
  autoPlacement,
  Axis,
  // computePosition,
  detectOverflow,
  ElementRects,
  flip,
  hide,
  Length,
  Placement,
  Side,
} from '@floating-ui/dom'
import { VirtualElement } from '../../types'
import { rectToClientRect } from '../../utils/doms'
import { getRectRelativeToOffsetParent } from '../../utils/floating/getRectRelativeToOffsetParent'
import { computePosition } from '../../utils/floating/computePosition'
import { getClippingRect } from '../../utils/floating/getClippingRect'
import { convertOffsetParentRelativeRectToViewportRelativeRect } from '../../utils/floating/convertOffsetParentRelativeRectToViewportRelativeRect'
import { isElement } from '../../utils/floating/is'
import { getDimensions } from '../../utils/floating/getDimensions'
import { getOffsetParent } from '../../utils/floating/getOffsetParent'
import { getDocumentElement } from '../../utils/floating/getDocumentElement'

const sides: Side[] = ['top', 'right', 'bottom', 'left']
const allPlacements = sides.reduce(
  (acc: Placement[], side) =>
    acc.concat(
      side,
      `${side}-start` as AlignedPlacement,
      `${side}-end` as AlignedPlacement
    ),
  []
)

function getAlignment<T extends string>(placement: T): Alignment {
  return placement.split('-')[1] as Alignment;
}

function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}

function getOppositeAlignmentPlacement(placement: Placement): Placement {
  const hash: {
    [key in string]: string
  } = {
    start: 'end',
    end: 'start'
  }

  return placement.replace(
    /start|end/g,
    (matched) => (hash as any)[matched]
  ) as Placement;
}

function getPlacementList(
  alignment: Alignment | null,
  autoAlignment: boolean,
  allowedPlacements: Array<Placement>
) {
  const allowedPlacementsSortedByAlignment = alignment
    ? [
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) === alignment
        ),
        ...allowedPlacements.filter(
          (placement) => getAlignment(placement) !== alignment
        ),
      ]
    : allowedPlacements.filter((placement) => getSide(placement) === placement);

  return allowedPlacementsSortedByAlignment.filter((placement) => {
    if (alignment) {
      return (
        getAlignment(placement) === alignment ||
        (autoAlignment
          ? getOppositeAlignmentPlacement(placement) !== placement
          : false)
      );
    }

    return true;
  });
}

function getMainAxisFromPlacement(placement: Placement): Axis {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y'
}

function getLengthFromAxis(axis: Axis): Length {
  return axis === 'y' ? 'height' : 'width'
}

function getOppositePlacement<T extends string>(placement: T): T {
  const hash: {
    [key in string]: string
  } = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  }

  return placement.replace(
    /left|right|bottom|top/g,
    (matched) => (hash as any)[matched]
  ) as T
}

function getAlignmentSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false
): {main: Side; cross: Side} {
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  let mainAlignmentSide: Side =
    mainAxis === 'x'
      ? alignment === (rtl ? 'end' : 'start')
        ? 'right'
        : 'left'
      : alignment === 'start'
        ? 'bottom'
        : 'top'

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }

  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide),
  };
}

export default defineComponent({
  name: 'GenMenu',

  props: {
    ...useAnchorProps,

    scroller: [String]
  },

  setup () {
    const root = ref<HTMLElement | null>(null)

    const anchor = useAnchor({

    })
    const portal = usePortal({
      render: () => {
        return h('div', {
          ref: root,
          style: 'position: fixed;background: red;width: 50px;height: 150px;text-align: center;',
        }, '')
      }
    })

    // onBeforeMount(() => {
    //   portal.show()
    // })

    onMounted(() => {
      portal.show()

      nextTick(() => {
        const floatingEl = root.value
        const referenceEl = anchor.el.value

        const update = (el: Element | VirtualElement) => {
          const virtualEl = {
            getBoundingClientRect() {
              return {
                x: 0,
                y: 0,
                top: 0,
                left: 0,
                bottom: 20,
                right: 20,
                width: 20,
                height: 20,
              }
            }
          }
          // console.log(getRectRelativeToOffsetParent(
          //   virtualEl as any,
          //   rootEl.value as any,
          // ))

          // console.log(floatingEl && referenceEl)

          if (floatingEl && referenceEl) {
            // console.log('Ubah')
            computePosition(el, floatingEl, {
              platform: {
                getClippingRect,
                convertOffsetParentRelativeRectToViewportRelativeRect,
                isElement,
                getDimensions,
                getOffsetParent,
                getDocumentElement,
                getElementRects: ({reference, floating, strategy}) => {
                  return {
                    reference: getRectRelativeToOffsetParent(
                      reference,
                      getOffsetParent(floating),
                      strategy
                    ),
                    floating: {...getDimensions(floating), x: 0, y: 0},
                  }
                },
                getClientRects: (element) => Array.from(element.getClientRects()),
                isRTL: (element) => getComputedStyle(element).direction === 'rtl',
              },
              placement: 'left-start',
              strategy: 'fixed',
              middleware: [
                // autoPlacement({
                //   boundary: referenceEl.parentElement?.parentElement!,
                //   alignment: 'start',
                // }),
                // flip(),
                // hide({
                //   strategy: 'escaped'
                // }),

                {
                  name: 'autoPlacement',
                  async fn(middlewareArguments) {
                    const {
                      x,
                      y,
                      rects,
                      middlewareData,
                      placement,
                      platform,
                      elements
                    } = middlewareArguments

                    const placements = getPlacementList('start', true, allPlacements)

                    const overflow = await detectOverflow(middlewareArguments)

                    const currentIndex = middlewareData.autoPlacement?.index ?? 0
                    const currentPlacement = placements[currentIndex]

                    if (currentPlacement == null) {
                      return {}
                    }

                    const { main, cross } = getAlignmentSides(
                      currentPlacement,
                      rects,
                      await platform.isRTL?.(elements.floating)
                    )

                    // Make `computeCoords` start from the right place
                    if (placement !== currentPlacement) {
                      return {
                        x,
                        y,
                        reset: {
                          placement: placements[0],
                        },
                      }
                    }

                    const currentOverflows = [
                      overflow[getSide(currentPlacement)],
                      overflow[main],
                      overflow[cross],
                    ]

                    console.log({
                      [getSide(currentPlacement)]: overflow[getSide(currentPlacement)],
                      [main]: overflow[main],
                      [cross]: overflow[cross]
                    })

                    const allOverflows = [
                      ...(middlewareData.autoPlacement?.overflows ?? []),
                      {
                        placement: currentPlacement,
                        overflows: currentOverflows
                      },
                    ]

                    console.log(allOverflows)

                    const nextPlacement = placements[currentIndex + 1]

                    // There are more placements to check
                    if (nextPlacement) {
                      return {
                        data: {
                          index: currentIndex + 1,
                          overflows: allOverflows,
                        },
                        reset: {
                          placement: nextPlacement,
                        },
                      };
                    }

                    const placementsSortedByLeastOverflow = allOverflows
                      .slice()
                      .sort((a, b) => a.overflows[0] - b.overflows[0]);
                    const placementThatFitsOnAllSides = placementsSortedByLeastOverflow.find(
                      ({overflows}) => overflows.every((overflow) => overflow <= 0)
                    )?.placement;

                    // console.log(allOverflows, placementsSortedByLeastOverflow, placementThatFitsOnAllSides)

                    const resetPlacement =
                      placementThatFitsOnAllSides ??
                      placementsSortedByLeastOverflow[0].placement;

                    console.log(resetPlacement)

                    if (resetPlacement !== placement) {
                      return {
                        data: {
                          index: currentIndex + 1,
                          overflows: allOverflows,
                        },
                        reset: {
                          placement: resetPlacement,
                        },
                      };
                    }

                    return {}
                  },
                },

                // {
                //   name: 'testmiddleware',
                //   async fn (args) {
                //     const elementContext = 'floating';
                //     const altBoundary = false;
                //     const altContext = elementContext === 'floating' ? 'reference' : 'floating';
                //     const element = args.elements[altBoundary ? altContext : elementContext];

                //     const clippingClientRect = rectToClientRect(
                //       await args.platform.getClippingRect({
                //         element:
                //           (await args.platform.isElement?.(element)) ?? true
                //             ? element
                //             : element.contextElement ||
                //               (await args.platform.getDocumentElement?.(args.elements.floating)),
                //         boundary: 'clippingAncestors',
                //         rootBoundary: 'viewport',
                //         strategy: args.strategy,
                //       })
                //     );
                //     const elementClientRect = rectToClientRect(
                //       args.platform.convertOffsetParentRelativeRectToViewportRelativeRect
                //         ? await args.platform.convertOffsetParentRelativeRectToViewportRelativeRect({
                //             rect:
                //               elementContext === 'floating'
                //                 ? {...args.rects.floating, x: args.x, y: args.y}
                //                 : args.rects.reference,
                //             offsetParent: await args.platform.getOffsetParent?.(args.elements.floating),
                //             strategy: args.strategy,
                //           })
                //         : args.rects[elementContext]
                //     );

                //     // console.log(clippingClientRect, elementClientRect)

                //     console.log({
                //       top: clippingClientRect.top - elementClientRect.top,
                //       bottom:
                //         elementClientRect.bottom -
                //         clippingClientRect.bottom,
                //       left: clippingClientRect.left - elementClientRect.left,
                //       right:
                //         elementClientRect.right - clippingClientRect.right,
                //     })
                    
                //     return {}
                //   }
                // }
              ],
            }).then((context) => {
              // console.log(context.middlewareData.hide)

              Object.assign(floatingEl.style, {
                top: `${context.y}px`,
                left: `${context.x}px`
              })
            })

            // console.log(getClippingRect({
            //   element: targetEl,
            //   boundary: 'clippingAncestors',
            //   rootBoundary: 'viewport',
            //   strategy: targetEl.style.position as any
            // }))

            // console.log(floatingEl.style.position)

            setPosition({
              elements: {
                floating: floatingEl,
                reference: el
              },
              placements: {
                floating: {
                  vertical: 'top',
                  horizontal: 'middle'
                },
                reference: {
                  vertical: 'bottom',
                  horizontal: 'middle'
                }
              },
              hidden: true,
              strategy: floatingEl.style.position
            })
          }
        }

        if (floatingEl && referenceEl) {
          // console.log(rootEl.value.style.paddingLeft)

          // console.log(rootEl.value.getBoundingClientRect())

          // console.log(getBoundingClientRect(rootEl.value))

          // setPosition({
          //   floatingEl: rootEl.value,
          //   referenceEl: anchorEl,
          // })



          // update()

          // let timeoutId: any
          // referenceEl.parentElement?.parentElement?.addEventListener('scroll', () => {
          //   // timeoutId && clearTimeout(timeoutId)
          //   // timeoutId = setTimeout(update)
          //   timeoutId && cancelAnimationFrame(timeoutId) 
          //   timeoutId = requestAnimationFrame(update)
          // })

          referenceEl.parentElement?.parentElement?.addEventListener('click', (e) => {
            // console.log('test')
            // update({
            //   getBoundingClientRect() {
            //     return {
            //       width: 0,
            //       height: 0,
            //       x: e.clientX,
            //       y: e.clientY,
            //       left: e.clientX,
            //       top: e.clientY,
            //       right: e.clientX,
            //       bottom: e.clientY
            //     }
            //   }
            // })

            const verticals = ['top', 'center', 'bottom']
            const horizontals = ['left', 'middle', 'right']
            const placements: any[] = []

            let count = 0

            let started = true
            while (started && count <= 50) {
              for (const vertical of verticals) {
                for (const horizontal of horizontals) {
                  const length = placements.filter((placement) => {
                    return (
                      // placement.floating.vertical === vertical &&
                      // placement.floating.horizontal === horizontal &&
                      placement.reference.vertical === vertical &&
                      placement.reference.horizontal === horizontal
                    )
                  }).length

                  if (length <= 0) {
                    placements.push({
                      // floating: {
                      //   vertical,
                      //   horizontal
                      // },
                      reference: {
                        vertical,
                        horizontal
                      }
                    })
                  }
                }
              }

              count++
            }

            console.log(placements)
          })
        }

        // const commonX = reference.x + reference.width / 2 - floating.width / 2
        // const commonY = reference.y + reference.height / 2 - floating.height / 2
        // const commonAlign = reference.y / 2 - floating.y / 2

        // let coords = { x: 0, y: 0 }

        // coords = { x: commonX, y: reference.y - floating.height }

        // coords.x -= commonAlign
      })
    })

    return portal.render
  }
})
