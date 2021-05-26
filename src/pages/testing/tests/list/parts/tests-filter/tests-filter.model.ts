import { createEvent, restore } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/testing/tests/list/parts/tests-filter/parts/dropdown-modules'

export const testsFilters = createFiltersModel({}, dropdownModules)
export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)
