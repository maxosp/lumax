import { createEvent, createStore, forward, attach } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getTestGeneratorTypesListFx } from '@/features/api/test/get-test-types-list'

export const typeDropdownModule = createFilter()

const getTypes = attach({
  effect: getTestGeneratorTypesListFx,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getTypes,
})

forward({
  from: getTypes.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $types,
})
