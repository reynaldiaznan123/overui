export type ClientRectObject = {
  x: number
  y: number
  width: number
  height: number
  left: number
  top: number
  right: number
  bottom: number
}

export interface VirtualElement {
  getBoundingClientRect(): ClientRectObject
  contextElement?: HTMLElement
}

export type ReferenceElement = HTMLElement | VirtualElement
export type FloatingElement = HTMLElement
