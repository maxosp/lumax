import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/applications/outgoing-deletion/parts/filter/parts/dropdown-modules'
import { loadList } from '@/pages/applications/outgoing-deletion/outgoing-deletion-applications-page.model'

export const outgoingDeletionFilters = createFiltersModel(
  {
    search_area: 'search_all',
    created_by_me: true,
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: outgoingDeletionFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: outgoingDeletionFilters.methods.applyFilters,
  source: outgoingDeletionFilters.store.$filterParams,
  target: loadList,
})
