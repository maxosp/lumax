import { attach, createEvent, forward, merge, restore, split } from 'effector-root'
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
import { TreeDataLight } from '@/features/api/types'
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

export const loadTreeLight = createEvent<GetAssignmentTreeQueryParams>()
export const setTasksTree = createEvent<TreeDataLight | null>()
export const $tasksTree = restore<TreeDataLight | null>(setTasksTree, null)
export const setTasksTreeTotal = createEvent<number>()
export const $tasksTreeTotal = restore<number>(setTasksTreeTotal, 0)

forward({
  from: loadTreeLight,
  to: getTasksTreeLight,
})

forward({
  from: getTasksTreeLight.doneData,
  to: [
    setTasksTree.prepend((res) => res.body.data),
    setTasksTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteAssignment.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Задание была успешно удалено!' })),
  ],
})

const { noInternet } = split(
  merge([
    getTasksTree.failData,
    getTasksTreeLight.failData,
    deleteAssignment.failData,
    deleteManyAssignments.failData,
    sendAssignmentsPublish.failData,
    sendAssignmentsToModeration.failData,
  ]),
  { noInternet: ({ status }) => status === undefined }
)

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
