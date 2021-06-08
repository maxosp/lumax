import { attach, createStore, createEvent, sample, restore } from 'effector'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { $currentIndex } from '@/pages/preview-tasks/parts/select-task/select-task.model'
import { getTicketsListFx } from '@/features/api/ticket/moderation/get-tickets-list'
import { cropString } from '@/features/lib'
import { getTestAssignmentListFx } from '@/features/api/assignment/test-assignment/get-test-list'
import { BaseAssignment } from '@/features/api/assignment/types/types'
import { TestAssignmentRelated } from '@/features/api/assignment/types/test-assignments-types'
import { getOlympiadTasksListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-tasks-list'
import { getLessonAssignmentListFx } from '@/features/api/assignment/lesson-assignment/get-lesson-list'

const commonMapParams = (params: number[] | string[]) => {
  return { ids: params.join(',') }
}

export const loadApplicationsTasks = attach({
  effect: getTicketsListFx,
  mapParams: commonMapParams,
})

export const loadTestTasks = attach({
  effect: getTestAssignmentListFx,
  mapParams: commonMapParams,
})

export const loadOlympiadTasks = attach({
  effect: getOlympiadTasksListFx,
  mapParams: commonMapParams,
})

export const loadLessonTasks = attach({
  effect: getLessonAssignmentListFx,
  mapParams: commonMapParams,
})

export const tasksDropdownModule = createFilter()

export const setSelectedTasks = createEvent<DropdownItem | null>()
export const $selectedTasks = restore(setSelectedTasks, null)

export const changeTasks = createEvent<DropdownItem[]>()
export const loadTasks = createEvent<number[]>()
const mapResponse = (assignment: BaseAssignment | TestAssignmentRelated) => ({
  id: assignment.id,
  name: `${assignment.id}`,
  title: `[id${assignment.id}] - ${cropString(assignment.wording, 34)}`,
})
export const $tasks = createStore<DropdownItem[]>([])
  .on(loadApplicationsTasks.doneData, (_, res): DropdownItem[] => {
    return res.body.data.map(({ test_assignment }) => mapResponse(test_assignment))
  })
  .on(loadTestTasks.doneData, (_, res): DropdownItem[] => {
    return res.body.data.map(mapResponse)
  })
  .on(loadOlympiadTasks.doneData, (_, res): DropdownItem[] => {
    return res.body.data.map(mapResponse)
  })
  .on(loadLessonTasks.doneData, (_, res): DropdownItem[] => {
    return res.body.data.map(mapResponse)
  })

sample({
  clock: $currentIndex,
  source: $tasks,
  fn: (tasks, index) => tasks[index]?.name,
  target: tasksDropdownModule.methods.itemChanged,
})
