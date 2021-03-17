import { createEvent, createStore, forward, attach } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getElementDeletionStatusListFx } from '@/features/api/ticket/deletion/get-element-status-list'

export const statusDropdownModule = createFilter()

const getStatuses = attach({
  effect: getElementDeletionStatusListFx,
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
