import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/applications/incoming/parts/filter/parts/dropdown-modules'
import { loadList } from '@/pages/applications/incoming/incoming-applications-page.model'

export const incomingApplicationsFilters = createFiltersModel(
  {
    moderate_by_me: false,
    search_area: 'search_all',
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: incomingApplicationsFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: incomingApplicationsFilters.methods.applyFilters,
  source: incomingApplicationsFilters.store.$filterParams,
  target: loadList,
})
