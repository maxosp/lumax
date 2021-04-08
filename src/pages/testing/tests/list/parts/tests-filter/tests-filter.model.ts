import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadList } from '@/pages/testing/tests/list/tests-page.model'
import { dropdownModules } from '@/pages/testing/tests/list/parts/tests-filter/parts/dropdown-modules'

export const testsFilters = createFiltersModel({}, dropdownModules)
export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: testsFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: testsFilters.methods.applyFilters,
  source: testsFilters.store.$filterParams,
  target: loadList.prepend(() => ({})),
})
