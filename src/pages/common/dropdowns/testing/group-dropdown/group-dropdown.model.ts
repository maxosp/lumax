import { createEvent, createStore, forward, attach } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getTestGroupsListFx } from '@/features/api/test/get-test-groups-list'

export const groupDropdownModule = createFilter()

const getGroups = attach({
  effect: getTestGroupsListFx,
})

export const loadGroups = createEvent<void>()
export const $groups = createStore<DropdownItem[]>([])

forward({
  from: loadGroups,
  to: getGroups,
})

forward({
  from: getGroups.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $groups,
})
