import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { createStore, forward, sample } from 'effector-root'
import { $themes } from '@/pages/theme-creation/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'
import { getThemeData } from '../prerequisites/prerequisites.model'

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
sample({
  clock: positionDropdownModule.methods.itemChanged,
  source: positionDropdownModule.store.$item,
  fn: (item: string | null) => {
    if (item) getThemeData(+item)
  },
})
