import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { createStore, forward } from 'effector'
import { getThemeData } from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'
import { $themes } from '@/pages/theme-creation/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

forward({
  from: getThemesTreeListFx.doneData.map((data) => formateData(data.body)),
  to: [$positions, $themes],
})

function formateData(data: GetThemeTreeFilterListResponse[]): any {
  return data.map((elem: any) => ({
    name: `${elem.theme.id}`,
    title: elem.theme.name,
    id: elem.theme.id,
    leaves: elem.leaves.length ? formateData(elem.leaves) : elem.leaves,
  }))
}

forward({
  from: positionDropdownModule.methods.itemChanged.map((data) => +data!),
  to: getThemeData,
})
positionDropdownModule.methods.itemChanged.watch((data) => console.log(data))
