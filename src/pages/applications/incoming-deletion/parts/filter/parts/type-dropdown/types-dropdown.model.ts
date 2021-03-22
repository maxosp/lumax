import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getElementTypeListFx } from '@/features/api/ticket/deletion/get-element-type-list'

export const typesDropdownModule = createFilter()

export const setSelectedType = createEvent<DropdownItem | null>()
export const $selectedType = restore(setSelectedType, null)

const getElementTypes = attach({
  effect: getElementTypeListFx,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getElementTypes.prepend(() => ({})),
})

forward({
  from: getElementTypes.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $types,
})
