import { createStore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import DIFFICULTIES_DATA from '@/pages/task-creation/test/parts/difficulties-dropdown/constants'

export const difficultiesDropdownModule = createFilter()

export const $difficulties = createStore<DropdownItem[]>(
  DIFFICULTIES_DATA.map((diff: string) => ({ name: diff, title: diff }))
)
