import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadFilteredTree, loadTreeLight } from '@/pages/labels/labels-page.model'
import { dropdownModules } from '@/pages/labels/parts/labels-filter/parts/dropdown-modules'

export const labelsFilters = createFiltersModel(
  {
    search_area: 'search_all',
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: labelsFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: labelsFilters.methods.applyFilters,
  source: labelsFilters.store.$filterParams,
  target: loadFilteredTree,
})
