import { createEvent, restore } from 'effector-root'
import { TogglerSettings } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/types'
import { DEFAULT_TOGGLERS } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/constants'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const setTogglers = createEvent<TogglerSettings>()
export const $togglers = restore(setTogglers, DEFAULT_TOGGLERS).reset(reset)
