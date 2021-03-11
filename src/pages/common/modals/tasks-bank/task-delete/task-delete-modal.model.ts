import { createEvent, forward, restore } from 'effector-root'

export const modalTaskDeleteVisibilityChanged = createEvent<boolean>()
export const $modalTaskDeleteVisibility = restore(modalTaskDeleteVisibilityChanged, false)

const clearFields = createEvent<void>()
export const loadModalToDelete = createEvent<number[]>()
export const $selectedIds = restore(loadModalToDelete, []).reset(clearFields)

forward({
  from: loadModalToDelete,
  to: modalTaskDeleteVisibilityChanged.prepend(() => true),
})
