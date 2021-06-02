import { createEvent, restore, forward, combine } from 'effector-root'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  getThemes,
  $selectedTheme,
} from '@/pages/common/dropdowns/themes-list/theme-dropdown.model'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/dropdown-modules'
import { getLabels } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/labels-dropdown/labels-dropdown.model'

export const testTasksFilters = createFiltersModel(
  {
    search_area: 'search_all',
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

export const $canSetLabels = every({
  predicate: (value) => value !== null,
  stores: [$selectedTheme],
})

forward({
  from: [
    dropdownModules.classesDropdownModule.methods.itemChanged,
    dropdownModules.classesDropdownModule.methods.resetItem,
    dropdownModules.subjectsDropdownModule.methods.itemChanged,
    dropdownModules.subjectsDropdownModule.methods.resetItem,
  ],
  to: [
    dropdownModules.themesDropdownModule.methods.resetItem,
    testTasksFilters.methods.changeFilter.prepend(() => ({ theme: undefined })),
  ],
})

forward({
  from: [
    dropdownModules.themesDropdownModule.methods.itemChanged,
    dropdownModules.themesDropdownModule.methods.resetItem,
  ],
  to: [
    dropdownModules.labelsDropdownModule.methods.resetDropdown,
    testTasksFilters.methods.changeFilter.prepend(() => ({ labels: undefined })),
  ],
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

const $formToGetLabelList = combine($selectedTheme, (theme) => ({ theme: theme && +theme.name }))
const debouncedLabelList = debounce({
  source: $formToGetLabelList,
  timeout: 150,
})
forward({
  from: debouncedLabelList,
  to: getLabels,
})
