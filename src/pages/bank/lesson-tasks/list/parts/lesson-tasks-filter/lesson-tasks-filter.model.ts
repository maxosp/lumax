import { createEvent, restore } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/parts/dropdown-modules'

export const lessonTasksFilters = createFiltersModel({}, dropdownModules)
export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)
