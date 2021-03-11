import { attach, createEvent, forward, restore } from 'effector-root'
import {
  deleteAssignmentFx,
  deleteAssignmentsFx,
} from '@/features/api/assignment/delete-assignment'
import { publishAssignmentFx } from '@/features/api/assignment/publish-assignment'
import { sendToModerationAssignmentFx } from '@/features/api/assignment/send-to-moderation-assignment'
import {
  getAssignmentTreeFx,
  getAssignmentTreeLightFx,
} from '@/features/api/assignment/tree-assignment'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData, TreeDataLight } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

const getTasksTree = attach({
  effect: getAssignmentTreeFx,
  mapParams: (params: GetAssignmentTreeQueryParams) => ({
    ...params,
    is_test_assignment: true,
  }),
})
const getTasksTreeLight = attach({
  effect: getAssignmentTreeLightFx,
  mapParams: (params: GetAssignmentTreeQueryParams) => ({
    ...params,
    is_test_assignment: true,
  }),
})

export const deleteAssignment = attach({
  effect: deleteAssignmentFx,
})
export const deleteManyAssignments = attach({
  effect: deleteAssignmentsFx,
})
export const sendAssignmentsPublish = attach({
  effect: publishAssignmentFx,
})
export const sendAssignmentsToModeration = attach({
  effect: sendToModerationAssignmentFx,
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
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Задание была успешно удалено!' })),
  ],
})
