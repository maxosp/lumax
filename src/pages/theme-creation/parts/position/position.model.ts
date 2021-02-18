// import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
// import { DropdownItem } from '@/pages/common/types'
import { createStore, forward, sample } from 'effector'
import { getThemeData } from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'
import { $themes } from '@/pages/theme-creation/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { GetThemeTreeFilterListResponse } from '@/features/api/types'

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

// forward({
//   from: getThemesListFx.doneData.map((data) =>
//     data.body.data
//       .filter((item) => !item.is_prerequisite)
//       .map((elem) => ({
//         name: `${elem.id}`,
//         title: elem.name,
//         is_prerequisite: elem.is_prerequisite,
//         study_year: elem.study_year,
//         id: elem.id,
//         subject: elem.subject,
//         created_by: elem.created_by,
//       }))
//   ),
//   to: [$positions, $themes],
// })

forward({
  from: getThemesTreeListFx.doneData.map((data) =>
    data.body.map((elem) => ({
      name: `${elem.theme.id}`,
      title: elem.theme.name,
      id: elem.theme.id,
      leaves: elem.leaves,
    }))
  ),
  to: [$positions, $themes],
})

sample({
  clock: getThemesTreeListFx.doneData.map((data) => data.body),
  source: $positions,
  fn: (arr, data: GetThemeTreeFilterListResponse[]) => {
    return formateData(data)
  },
  target: $positions,
})

function formateData(data: GetThemeTreeFilterListResponse[]): any {
  return data.map((elem: any) => ({
    name: `${elem.theme.id}`,
    title: elem.theme.name,
    id: elem.theme.id,
    leaves: elem.leaves.length ? formateData(elem.leaves) : elem.leaves,
  }))
}

// getThemesTreeListFx.doneData.watch((data) => console.log(data))
forward({
  from: positionDropdownModule.methods.itemChanged.map((data) => +data!),
  to: getThemeData,
})
