import { createEvent, restore } from 'effector-root'

export const modalTasksTypesVisibilityChanged = createEvent<boolean>()
export const $modalTasksTypesVisibility = restore(modalTasksTypesVisibilityChanged, false)
