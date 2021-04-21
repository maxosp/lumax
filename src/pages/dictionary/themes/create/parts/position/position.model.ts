import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { createStore, forward, sample } from 'effector-root'
import { $themes } from '@/pages/dictionary/themes/create/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { formatData } from '@/features/lib'
import { getThemeData } from '@/pages/dictionary/themes/create/parts/prerequisites/prerequisites.model'

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

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
