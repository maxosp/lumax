import { createEvent, restore } from 'effector-root'

export const assignedToMeChanged = createEvent<boolean>()
export const $assignedToMe = restore(assignedToMeChanged, false)
