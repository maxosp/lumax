import { createStore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import TASK_TYPES_DATA from '@/pages/bank/test-tasks/create/parts/task-types-dropdown/constants'

export const taskTypesDropdownModule = createFilter()

export const $taskTypes = createStore<DropdownItem[]>(TASK_TYPES_DATA)
