import { createEvent, restore } from 'effector-root'

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<void>()

// forward({
//     from:
// })
