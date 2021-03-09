import { createEvent, createStore, attach, restore, forward } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'

export const themesDropdownModule = createFilter()

export const setSelectedTheme = createEvent<DropdownItem | null>()
export const $selectedTheme = restore(setSelectedTheme, null)

export const getThemes = attach({
  effect: getThemesTreeListFx,
  mapParams: (params: any) => params,
})

export const $themes = createStore<DropdownItem[]>([])

// forward({
//   from: getThemes.doneData.map((res) =>
//     res.body.map((item) => ({ name: item.theme.id, title: item.theme.name }))
//   ),
//   to: $themes,
// })

function formatData(data: GetThemeTreeFilterListResponse[]): any {
  return data.map((elem: any) => ({
    name: `${elem.theme.id}`,
    title: elem.theme.name,
    id: elem.theme.id,
    leaves: elem.leaves.length ? formatData(elem.leaves) : elem.leaves,
  }))
}

forward({
  from: getThemes.doneData.map((data) => formatData(data.body)),
  to: $themes,
})
