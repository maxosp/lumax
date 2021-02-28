import { createEvent, createStore, forward, attach } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const typeDropdownModule = createFilter()

const getTypes = attach({
  effect: getSubjectsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getTypes.prepend(() => ({})),
})

forward({
  from: getTypes.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $types,
})
