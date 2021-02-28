import { createEvent, createStore, forward, attach } from 'effector-root'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const statusDropdownModule = createFilter()

const getStatuses = attach({
  effect: getSubjectsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadStatus = createEvent<void>()
export const $status = createStore<DropdownItem[]>([])

forward({
  from: loadStatus,
  to: getStatuses.prepend(() => ({})),
})

forward({
  from: getStatuses.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $status,
})
