import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { createStore, forward } from 'effector'
import { getThemeData } from '@/pages/theme-creation/parts/prerequisites/prerequisites.model'
import { $themes } from '@/pages/theme-creation/parts/themes/themes.model'

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

forward({
  from: getThemesListFx.doneData.map((data) =>
    data.body.data
      .filter((item) => !item.is_prerequisite)
      .map((elem) => ({
        name: `${elem.id}`,
        title: elem.name,
        is_prerequisite: elem.is_prerequisite,
        study_year: elem.study_year,
        id: elem.id,
        subject: elem.subject,
        created_by: elem.created_by,
      }))
  ),
  to: [$positions, $themes],
})

forward({
  from: positionDropdownModule.methods.itemChanged.map((data) => +data!),
  to: getThemeData,
})
