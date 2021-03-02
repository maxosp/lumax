import { createEvent, restore } from 'effector-root'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const createdByMeChanged = createEvent<boolean>()
export const $createdByMe = restore<boolean>(createdByMeChanged, false)
