import { isNotEmpty } from '../is'

const nodes: HTMLElement[] = []

export function createGlobalNode(id?: string) {
  const el = document.createElement('div')

  if (isNotEmpty(id)) {
    el.id = id!
  }

  document.body.append(el)

  nodes.push(el)

  return el
}

export function removeGlobalNode(el: HTMLElement) {
  const index = nodes.indexOf(el)
  if (index > -1) {
    const node = nodes[index]
    node.remove()
    nodes.slice(index, 1)
  }
}
