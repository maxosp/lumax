import { createEvent, createStore, forward, attach } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const languagesDropdownModule = createFilter()

const getLanguages = attach({
  effect: getSubjectsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadLanguages = createEvent<void>()
export const $languages = createStore<DropdownItem[]>([])

forward({
  from: loadLanguages,
  to: getLanguages.prepend(() => ({})),
})

forward({
  from: getLanguages.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $languages,
})
