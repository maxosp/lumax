import { createEvent, restore, forward, combine, sample } from 'effector-root'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  getThemes,
  $selectedTheme,
} from '@/pages/common/dropdowns/themes-list/theme-dropdown.model'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadTree } from '@/pages/bank/test-tasks/list/tasks-page.model'
import { dropdownModules } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/dropdown-modules'

export const testTasksFilters = createFiltersModel(
  {
    search_area: 'search_all',
    is_prerequisite: false,
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
  from: testTasksFilters.methods.resetFilters,
  to: loadTree.prepend(() => ({})),
})

sample({
  clock: testTasksFilters.methods.applyFilters,
  source: testTasksFilters.store.$filterParams,
  target: loadTree,
})

forward({
  from: [
    dropdownModules.classesDropdownModule.methods.itemChanged,
    dropdownModules.subjectsDropdownModule.methods.itemChanged,
  ],
  to: dropdownModules.themesDropdownModule.methods.resetItem,
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
  to: getThemes,
})
