import { createEffect, createEvent, sample, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const tasksDropdownModule = createFilter()

export const initDropDown = createEvent<void>()
export const setSelectedTasks = createEvent<DropdownItem | null>()
export const $selectedTasks = restore(setSelectedTasks, null)

export const taskIndexChanged = createEvent<number>()
export const $taskIndex = restore(taskIndexChanged, 0)

export const changeTasks = createEvent<DropdownItem[]>()
export const $tasks = restore(changeTasks, [])

const selectTaskByCurrentIndex = createEffect((data: DropdownItem[]) => {
  if (data.length) tasksDropdownModule.methods.itemChanged(data[$taskIndex.getState()].name)
})

sample({
  clock: taskIndexChanged,
  source: $tasks,
  target: selectTaskByCurrentIndex,
})

sample({
  clock: initDropDown,
  source: $tasks,
  target: selectTaskByCurrentIndex,
})
