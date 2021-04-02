import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import {
  deleteTestAssignmentFx,
  deleteTestAssignmentsFx,
} from '@/features/api/assignment/test-assignment/delete-test-assignment'
import { getTestAssignmentTreeLightFx } from '@/features/api/assignment/test-assignment/get-test-tree-light'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import {
  GetAssignmentTreeQueryParams,
  UpdateAssignmentsBulkParams,
} from '@/features/api/assignment/types'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { getTestAssignmentTreeFx } from '@/features/api/assignment/test-assignment/get-test-tree'
import { mergeTreeData } from '@/features/lib'

const getTasksTree = attach({
  effect: getTestAssignmentTreeFx,
})
const getTasksTreeLight = attach({
  effect: getTestAssignmentTreeLightFx,
})

export const deleteAssignment = attach({
  effect: deleteTestAssignmentFx,
})
export const deleteManyAssignments = attach({
  effect: deleteTestAssignmentsFx,
})
export const sendAssignmentsPublish = attach({
  effect: updateTestAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({ ...params, status: 'published' }),
})

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<void>()
export const setTasksTree = createEvent<TreeData[] | null>()
export const $tasksTree = createStore<TreeData[] | null>(null).on(setTasksTree, (state, data) => {
  if (state === null) return data
  return mergeTreeData(state, data!)
})
export const setTasksTreeTotal = createEvent<number>()
export const $tasksTreeTotal = restore<number>(setTasksTreeTotal, 0)

forward({
  from: loadTreeLight,
  to: getTasksTreeLight,
})

forward({
  from: loadTree,
  to: getTasksTree,
})
forward({
  from: getTasksTreeLight.doneData,
  to: [
    setTasksTree.prepend((res) => res.body.data),
    setTasksTreeTotal.prepend((res) => res.body.total),
  ],
})
forward({
  from: getTasksTree.doneData,
  to: [
    setTasksTree.prepend((res) => res.body.data),
    setTasksTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteAssignment.doneData,
  to: [loadTreeLight.prepend(() => ({})), successToastEvent('Задание было успешно удалено!')],
})
