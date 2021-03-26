import { createStore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { mapTaskTypeTo } from '@/pages/common/constants'

export const taskTypesDropdownModule = createFilter()

export const $taskTypes = createStore<DropdownItem[]>(
  Object.entries(mapTaskTypeTo).map((el): { name: string; title: string } => ({
    name: el[0],
    title: el[1].description,
  }))
)
