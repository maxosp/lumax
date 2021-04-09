import { createEvent, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadTree } from '@/pages/bank/lesson-tasks/list/lesson-page.model'
import { dropdownModules } from '@/pages/bank/lesson-tasks/list/parts/lesson-tasks-filter/parts/dropdown-modules'

export const lessonTasksFilters = createFiltersModel({}, dropdownModules)
export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: lessonTasksFilters.methods.resetFilters,
  to: loadTree.prepend(() => ({})),
})

sample({
  clock: lessonTasksFilters.methods.applyFilters,
  source: lessonTasksFilters.store.$filterParams,
  target: loadTree,
})
