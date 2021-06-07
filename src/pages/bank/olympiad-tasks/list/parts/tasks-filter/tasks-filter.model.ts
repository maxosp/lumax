import { createEvent, restore, forward, combine } from 'effector-root'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  $selectedTheme,
  getThemes,
} from '@/pages/common/dropdowns/themes-list/theme-dropdown.model'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { dropdownModules } from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/dropdown-modules'
import {
  getTags,
  resetSelectedTags,
} from '@/pages/bank/olympiad-tasks/list/parts/tasks-filter/parts/tags-dropdown/tags-dropdown.model'

export const olympiadTasksFilters = createFiltersModel({}, dropdownModules)

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

const $formToGetThemeOrTagList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && +cl.name,
  subject: obj && +obj.name,
}))

const debounced = debounce({
  source: $formToGetThemeOrTagList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [getThemes.prepend(() => ({})), getTags, resetSelectedTags.prepend(() => ({}))],
})

forward({
  from: reset,
  to: resetSelectedTags,
})

forward({
  from: [
    dropdownModules.classesDropdownModule.methods.itemChanged,
    dropdownModules.classesDropdownModule.methods.resetItem,
    dropdownModules.subjectsDropdownModel.methods.itemChanged,
    dropdownModules.subjectsDropdownModel.methods.resetItem,
  ],
  to: [
    dropdownModules.tagsDropdownModel.methods.resetItem,
    olympiadTasksFilters.methods.changeFilter.prepend(() => ({ tags: undefined })),
  ],
})
