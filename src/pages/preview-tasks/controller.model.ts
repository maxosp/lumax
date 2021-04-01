import { createEvent, restore } from 'effector-root'

export const toggleSwitchers = createEvent<boolean>()
export const $switcherIspreview = restore(toggleSwitchers, true)
