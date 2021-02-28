import { createEvent, restore } from 'effector-root'
import { DEFAULT_TOGGLERS } from '@/pages/dictionary/themes/list/parts/themes-filter/constants'
import { TogglerSettings } from '@/pages/dictionary/themes/list/parts/themes-filter/types'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const setTogglers = createEvent<TogglerSettings>()
export const $togglers = restore(setTogglers, DEFAULT_TOGGLERS).reset(reset)
