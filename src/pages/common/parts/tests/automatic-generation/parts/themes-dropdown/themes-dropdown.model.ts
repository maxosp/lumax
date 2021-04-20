import { createEvent, createStore, forward, attach, restore, combine } from 'effector-root'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'
import { condition, debounce } from 'patronum'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'

export const themesDropdownModule = createFilter()

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
})

export const $themes = createStore<DropdownItem[]>([])

export const resetThemes = createEvent<void>()

export const toggleIsPageLoaded = createEvent<boolean>()
export const $isPageLoaded = restore(toggleIsPageLoaded, false)

forward({
  from: resetThemes,
  to: themesDropdownModule.methods.resetDropdown,
})

export const setSelectedThemes = createEvent<DropdownItem[]>()
export const $selectedThemes = restore(setSelectedThemes, []).reset(resetThemes)

function formatData(data: GetThemeTreeFilterListResponse[]): any {
  return data.map((elem: any, index: number) => ({
    id: index,
    name: `${elem.theme.id}`,
    title: elem.theme.name,
    leaves: elem.leaves.length ? formatData(elem.leaves) : elem.leaves,
  }))
}

forward({
  from: getThemesTreeList.doneData.map((data) => formatData(data.body)),
  to: themesDropdownModule.methods.setItems,
})

const $formToGetThemeList = combine($selectedSubject, $selectedClass, (subj, year) => ({
  subject: subj && +subj.name,
  study_year: year && +year.name,
}))

const debounced = debounce({
  source: $formToGetThemeList,
  timeout: 150,
})

forward({
  from: debounced,
  to: condition({
    if: $isPageLoaded,
    then: getThemesTreeList,
  }),
})
