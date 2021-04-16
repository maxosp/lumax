import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadFilteredTree, loadTreeLight } from '@/pages/tags/tags-page.model'
import { dropdownModules } from '@/pages/tags/parts/tags-filter/parts/dropdown-modules'

export const tagsFilters = createFiltersModel(
  {
    search_area: 'search_all',
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: tagsFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: tagsFilters.methods.applyFilters,
  source: tagsFilters.store.$filterParams,
  target: loadFilteredTree,
})
