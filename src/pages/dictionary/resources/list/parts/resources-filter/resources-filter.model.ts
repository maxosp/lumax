import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import {
  loadFilteredTree,
  loadTreeLight,
} from '@/pages/dictionary/resources/list/resources-page.model'
import { dropdownModules } from '@/pages/dictionary/resources/list/parts/resources-filter/parts/dropdown-modules'

export const resourcesFilters = createFiltersModel(
  {
    search_area: 'search_all',
    created_by_me: false,
  },
  dropdownModules
)
export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: resourcesFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: resourcesFilters.methods.applyFilters,
  source: resourcesFilters.store.$filterParams,
  target: loadFilteredTree,
})
