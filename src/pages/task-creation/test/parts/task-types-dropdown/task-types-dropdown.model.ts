import { createStore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import TASK_TYPES_DATA from '@/pages/task-creation/test/parts/task-types-dropdown/constants.ts'

export const taskTypesDropdownModule = createFilter()

export const $taskTypes = createStore<DropdownItem[]>(
  TASK_TYPES_DATA.map(({ name, title }) => ({ name, title }))
)
