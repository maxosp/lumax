import { createEvent, restore } from 'effector-root'

export const treeViewChanged = createEvent<boolean>()
export const $treeView = restore(treeViewChanged, false)
