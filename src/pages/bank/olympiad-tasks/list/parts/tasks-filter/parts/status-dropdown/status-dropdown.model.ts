import { createEvent, createStore, forward, attach } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getOlympiadStatusListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-status-list'

export const statusDropdownModule = createFilter()

const getStatuses = attach({
  effect: getOlympiadStatusListFx,
})

export const loadStatus = createEvent<void>()
export const $status = createStore<DropdownItem[]>([])

forward({
  from: loadStatus,
  to: getStatuses.prepend(() => ({})),
})

forward({
  from: getStatuses.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $status,
})
