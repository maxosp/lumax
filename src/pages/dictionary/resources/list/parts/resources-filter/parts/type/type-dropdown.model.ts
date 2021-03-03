import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'
import { getTypesListFx } from '@/features/api/media/get-types-list'

export const typeDropdownModule = createFilter()

export const setSelectedType = createEvent<DropdownItem | null>()
export const $selectedType = restore(setSelectedType, null)

const getTypesList = attach({
  effect: getTypesListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getTypesList.prepend(() => ({})),
})

forward({
  from: getTypesList.doneData.map((res) =>
    res.body.map((type) => ({ name: type.code, title: type.name }))
  ),
  to: $types,
})
