import { createEvent, restore } from 'effector-root'
import { TogglerSettings } from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/types'
import { DEFAULT_TOGGLERS } from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/constants'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const setTogglers = createEvent<TogglerSettings>()
export const $togglers = restore(setTogglers, DEFAULT_TOGGLERS).reset(reset)
