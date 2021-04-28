import { createEvent, sample, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { $currentIndex } from '@/pages/preview-tasks/parts/select-task/select-task.model'

export const tasksDropdownModule = createFilter()

export const setSelectedTasks = createEvent<DropdownItem | null>()
export const $selectedTasks = restore(setSelectedTasks, null)

export const changeTasks = createEvent<DropdownItem[]>()
export const $tasks = restore(changeTasks, [])

sample({
  clock: $currentIndex,
  source: $tasks,
  fn: (tasks, index) => tasks[index].name,
  target: tasksDropdownModule.methods.itemChanged,
})
