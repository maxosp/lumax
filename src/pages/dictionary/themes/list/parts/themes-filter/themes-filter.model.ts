import { createEvent, restore } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/dictionary/themes/list/parts/themes-filter/parts/dropdown-modules'

export const themesFilters = createFiltersModel(
  {
    search_area: 'search_all',
    has_assignment: false,
    is_prerequisite: false,
    is_not_prerequisite: false,
    has_no_assignment: false,
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)
