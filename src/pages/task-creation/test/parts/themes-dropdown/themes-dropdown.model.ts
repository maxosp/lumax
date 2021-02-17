import { createEvent, createStore, forward, attach } from 'effector-root'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const themesDropdownModule = createFilter()

const getThemes = attach({
  effect: getThemesListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadThemes = createEvent<void>()
export const $themes = createStore<DropdownItem[]>([])

forward({
  from: loadThemes,
  to: getThemes.prepend(() => ({})),
})

forward({
  from: getThemes.doneData.map((res) =>
    res.body.data.map((theme) => ({ name: `${theme.id}`, title: theme.name }))
  ),
  to: $themes,
})
