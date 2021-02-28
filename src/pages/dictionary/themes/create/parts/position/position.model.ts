import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { createStore, forward, sample } from 'effector-root'
import { $themes } from '@/pages/dictionary/themes/create/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'
import { getThemeData } from '../prerequisites/prerequisites.model'

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

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
  to: [$positions, $themes],
})

sample({
  clock: positionDropdownModule.methods.itemChanged,
  source: positionDropdownModule.store.$item,
  fn: (item: string | null) => {
    if (item) getThemeData(+item)
  },
})
