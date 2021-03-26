import { createEvent, restore } from 'effector-root'
import { TaskHintType } from './constants'

export const setHint = createEvent<TaskHintType[]>()
export const resetHintsList = createEvent<void>()
export const $hintsList = restore(setHint, []).reset(resetHintsList)
