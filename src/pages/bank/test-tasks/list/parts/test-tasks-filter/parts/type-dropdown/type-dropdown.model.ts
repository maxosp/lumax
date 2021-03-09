import { createEvent, createStore, forward, attach } from 'effector-root'
import { getListTypesFx } from '@/features/api/assignment/ge-list-types'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const typeDropdownModule = createFilter()

const getTypes = attach({
  effect: getListTypesFx,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getTypes.prepend(() => ({})),
})

forward({
  from: getTypes.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $types,
})
