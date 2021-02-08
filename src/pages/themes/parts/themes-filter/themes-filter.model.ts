import { createEvent, restore } from 'effector-root'

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false)
