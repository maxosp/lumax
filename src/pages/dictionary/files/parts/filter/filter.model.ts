import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadFilteredTree, loadTreeLight } from '@/pages/dictionary/files/system-files-page.model'

export const filesFilters = createFiltersModel({ search_area: 'search_all' })

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: filesFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: filesFilters.methods.applyFilters,
  source: filesFilters.store.$filterParams,
  target: loadFilteredTree,
})
