export function slot (vm: any, name: string, data = {}, otherwise?: any) {
  if (vm[name]) {
    return vm[name](data)
  } else if (vm.slots && vm.slots[name]) {
    return vm.slots[name](data)
  } else if (vm.$scopedSlots && vm.$scopedSlots[name]) {
    return vm.$scopedSlots[name](data)
  } else if (vm.$slots && vm.$slots[name]) {
    return vm.$slots[name](data)
  }

  return otherwise
}
