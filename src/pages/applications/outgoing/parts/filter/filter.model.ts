import { createEvent, restore } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/applications/outgoing/parts/filter/parts/dropdown-modules'

export const outgoingApplicationsFilters = createFiltersModel(
  {
    search_area: 'search_all',
    created_by_me: true,
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)
