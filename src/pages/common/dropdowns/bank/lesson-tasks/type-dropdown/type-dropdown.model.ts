import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
// TODO: correctly define WHICH type of assignment
import { getLessonTypesListFx } from '@/features/api/assignment/lesson-assignment/get-lesson-types-list'

export const typeDropdownModule = createFilter()

export const setSelectedType = createEvent<DropdownItem | null>()
export const $selectedType = restore(setSelectedType, null)

const getTypesList = attach({
  effect: getLessonTypesListFx,
})

export const loadTypes = createEvent<void>()
export const $types = createStore<DropdownItem[]>([])

forward({
  from: loadTypes,
  to: getTypesList.prepend(() => ({})),
})

forward({
  from: getTypesList.doneData.map((res) =>
    res.body.map((item) => ({ name: `${item.code}`, title: item.name }))
  ),
  to: $types,
})
