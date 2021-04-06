import { createEvent, restore } from 'effector-root'

export const toggleIsPreview = createEvent<boolean>()
export const $isPreview = restore(toggleIsPreview, true)
