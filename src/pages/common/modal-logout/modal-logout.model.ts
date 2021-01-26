import { createEvent, restore } from 'effector-root'

export const modalLogoutVisibilityChanged = createEvent<boolean>()
export const $modalLogoutVisibility = restore(modalLogoutVisibilityChanged, false)
