import { createEvent, forward, restore } from 'effector-root'

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const loadModal = createEvent<number[]>()

forward({
  from: loadModal,
  to: modalVisibilityChanged.prepend(() => true),
})
