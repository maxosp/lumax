import { createEvent, restore } from 'effector-root'

export const setTheme = createEvent<number | null>()
export const $theme = restore(setTheme, null)

export const setDifficulty = createEvent<string | null>()
export const $difficulty = restore(setDifficulty, null)

export const toggleNeedDuplicate = createEvent<boolean>()
export const $needDuplicate = restore(toggleNeedDuplicate, false)

export const setCount = createEvent<number>()
export const $count = restore(setCount, 0)
