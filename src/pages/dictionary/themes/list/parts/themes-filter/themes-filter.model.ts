import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadTree } from '@/pages/dictionary/themes/list/themes-page.model'
import { dropdownModules } from '@/pages/dictionary/themes/list/parts/themes-filter/parts/dropdown-modules'

export const themesFilters = createFiltersModel(
  {
    search_area: 'search_all',
    has_assignment: false,
    is_prerequisite: false,
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: themesFilters.methods.resetFilters,
  to: loadTree.prepend(() => ({})),
})

sample({
  clock: themesFilters.methods.applyFilters,
  source: themesFilters.store.$filterParams,
  target: loadTree,
})
