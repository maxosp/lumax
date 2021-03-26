import { createEvent, restore, forward, combine } from 'effector-root'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import {
  getThemes,
  $selectedTheme,
} from '@/pages/common/dropdowns/themes-list/theme-dropdown.model'
import { modules } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/parts/index'
import { TogglerSettings } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/types'
import { DEFAULT_TOGGLERS } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/constants'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const setTogglers = createEvent<TogglerSettings>()
export const $togglers = restore(setTogglers, DEFAULT_TOGGLERS).reset(reset)

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

export const $canSetTags = every({
  predicate: (value) => value !== null,
  stores: [$selectedTheme],
})

forward({
  from: [
    modules.classesDropdownModule.methods.itemChanged,
    modules.subjectsDropdownModule.methods.itemChanged,
  ],
  to: modules.themesDropdownModule.methods.resetItem,
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
