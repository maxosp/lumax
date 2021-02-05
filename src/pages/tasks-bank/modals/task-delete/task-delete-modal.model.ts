import { createEvent, restore } from 'effector-root'

export const modalTaskDeleteVisibilityChanged = createEvent<boolean>()
export const $modalTaskDeleteVisibility = restore(modalTaskDeleteVisibilityChanged, false)
