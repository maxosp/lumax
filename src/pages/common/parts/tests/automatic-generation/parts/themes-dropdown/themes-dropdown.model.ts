import { createEvent, createStore, forward, attach, restore, combine } from 'effector-root'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $studyYear } from '@/pages/testing/tests/create/test-create-page.model'
import { debounce } from 'patronum'

export const themesDropdownModule = createFilter()

const getThemes = attach({
  effect: getThemesListFx,
})

export const loadThemes = createEvent<void>()
export const $themes = createStore<DropdownItem[]>([])

export const resetThemes = createEvent<void>()

forward({
  from: resetThemes,
  to: themesDropdownModule.methods.resetDropdown,
})

export const setSelectedThemes = createEvent<DropdownItem[]>()
export const $selectedThemes = restore(setSelectedThemes, []).reset(resetThemes)

forward({
  from: loadThemes,
  to: getThemes.prepend(() => ({})),
})

forward({
  from: getThemes.doneData.map((res) =>
    res.body.data.map((theme, index) => ({
      id: index,
      name: theme.name,
      title: theme.name,
      study_year: theme.study_year,
      subject: theme.subject,
      author: theme.id,
    }))
  ),
  to: [$themes, themesDropdownModule.methods.setItems],
})

const $formToGetThemeList = combine($selectedSubject, $studyYear, (subj, year) => ({
  subject: subj && +subj.name,
  study_year: year,
}))

const debounced = debounce({
  source: $formToGetThemeList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [
    getThemes.prepend((data) => {
      return {
        subject: data.subject,
        study_year: data.study_year,
      }
    }),
  ],
})
