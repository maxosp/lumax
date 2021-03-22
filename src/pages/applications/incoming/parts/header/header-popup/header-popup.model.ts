import { createEvent, forward, restore } from 'effector-root'

export const download = createEvent<void>()

export const selectAllChanged = createEvent<boolean>()
export const $selectAll = restore(selectAllChanged, false)

forward({
  from: download,
  to: selectAllChanged.prepend(() => false),
})
