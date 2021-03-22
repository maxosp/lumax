import { attach, createEvent, forward, restore } from 'effector-root'
// TODO: correctly define WHICH type of assignment
import {
  deleteTestAssignmentFx,
  deleteTestAssignmentsFx,
} from '@/features/api/assignment/test-assignment/delete-test-assignment'
import { getTestAssignmentTreeLightFx } from '@/features/api/assignment/test-assignment/get-test-tree-light'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData, TreeDataLight } from '@/features/api/types'
import {
  GetAssignmentTreeQueryParams,
  UpdateAssignmentsBulkParams,
} from '@/features/api/assignment/types'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { getTestAssignmentTreeFx } from '@/features/api/assignment/test-assignment/get-test-tree'

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
export const sendAssignmentsToModeration = attach({
  effect: updateTestAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({ ...params, status: 'revision' }),
})

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<GetAssignmentTreeQueryParams>()
export const setTasksTree = createEvent<TreeDataLight | TreeData | null>()
export const $tasksTree = restore<TreeDataLight | TreeData | null>(setTasksTree, null)
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
  to: [loadTree.prepend(() => ({})), successToastEvent('Задание было успешно удалено!')],
})
