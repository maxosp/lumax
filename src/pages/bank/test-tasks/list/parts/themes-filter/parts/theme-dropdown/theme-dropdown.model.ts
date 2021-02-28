import { createEvent, createStore, forward, attach } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const themesDropdownModule = createFilter()

const getThemes = attach({
  effect: getSubjectsListFx,
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
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $themes,
})
