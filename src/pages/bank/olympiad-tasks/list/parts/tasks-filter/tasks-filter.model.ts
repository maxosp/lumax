import { createEvent, restore, forward, combine, sample } from 'effector-root'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  $selectedTheme,
  getThemes,
} from '@/pages/common/dropdowns/themes-list/theme-dropdown.model'
import { loadList } from '@/pages/bank/olympiad-tasks/list/olympiad-tasks-page.model'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/dropdown-modules'

export const olympiadTasksFilters = createFiltersModel(
  {
    created_by_me: false,
  },
  dropdownModules
)

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

export const $canSetTags = every({
  predicate: (value) => value !== null,
  stores: [$selectedTheme],
})

forward({
  from: olympiadTasksFilters.methods.resetFilters,
  to: loadList.prepend(() => ({})),
})

sample({
  clock: olympiadTasksFilters.methods.applyFilters,
  source: olympiadTasksFilters.store.$filterParams,
  target: loadList,
})

const $formToGetThemeList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && +cl.name,
  subject: obj && +obj.name,
}))

const debounced = debounce({
  source: $formToGetThemeList,
  timeout: 150,
})

forward({
  from: debounced,
  to: getThemes.prepend(() => ({})),
})
