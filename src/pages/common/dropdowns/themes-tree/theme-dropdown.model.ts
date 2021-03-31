import { combine, createEvent, createStore, forward, restore } from 'effector-root'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem, SelectedObjectType } from '@/pages/common/types'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/common/dropdowns/subject/subjects-dropdown.model'
import { $selectedClass } from '@/pages/common/dropdowns/class/classes-dropdown.model'

export const loadThemes = createEvent<void>()

export const themesDropdownModule = createFilter()

export const $themes = createStore<DropdownItem[]>([])

export const setSelectedTheme = createEvent<DropdownItem | SelectedObjectType | null>()
export const $selectedTheme = restore(setSelectedTheme, null)

function formatData(data: GetThemeTreeFilterListResponse[]): any {
  return data.map((elem: any) => ({
    name: `${elem.theme.id}`,
    title: elem.theme.name,
    id: elem.theme.id,
    leaves: elem.leaves.length ? formatData(elem.leaves) : elem.leaves,
  }))
}

forward({
  from: getThemesTreeListFx.doneData.map((data) => formatData(data.body)),
  to: $themes,
})

forward({
  from: loadThemes,
  to: getThemesTreeListFx.prepend(() => ({ is_prerequisite: false })),
})

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
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
  to: [
    getThemesTreeListFx.prepend((data) => {
      return {
        study_year: data.study_year ? data.study_year : undefined,
        subject: data.subject ? data.subject : undefined,
        is_prerequisite: false,
      }
    }),
  ],
})
