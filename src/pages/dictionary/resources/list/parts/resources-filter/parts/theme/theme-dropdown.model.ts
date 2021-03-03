import { createEvent, createStore, forward } from 'effector-root'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'

export const loadThemes = createEvent<void>()

export const themeDropdownModule = createFilter()

export const $themes = createStore<DropdownItem[]>([])

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
