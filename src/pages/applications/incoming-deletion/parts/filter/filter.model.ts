import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/applications/incoming-deletion/parts/filter/parts/dropdown-modules'
import { loadList } from '@/pages/applications/incoming-deletion/incoming-deletion-applications-page.model'

export const incomingDeletionFilters = createFiltersModel(
  {
    search_area: 'search_all',
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: incomingDeletionFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: incomingDeletionFilters.methods.applyFilters,
  source: incomingDeletionFilters.store.$filterParams,
  target: loadList,
})
