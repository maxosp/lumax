import { createEffect, createEvent, sample, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const tasksDropdownModule = createFilter()

export const initDropDown = createEvent<void>()
export const setSelectedTasks = createEvent<DropdownItem | null>()
export const $selectedTasks = restore(setSelectedTasks, null)

export const changeTasks = createEvent<DropdownItem[]>()
export const $tasks = restore(changeTasks, [])

const selectedFirstItem = createEffect((data: DropdownItem[]) => {
  if (data.length) tasksDropdownModule.methods.itemChanged(data[0].name)
})

sample({
  clock: initDropDown,
  source: $tasks,
  target: selectedFirstItem,
})
