import { createEvent, restore } from 'effector-root'

export const changeNavState = createEvent<boolean>()
export const $isOpened = restore(changeNavState, false)

export const changeOpenedItem = createEvent<number | null>()
export const $openedItem = restore(changeOpenedItem, null)
