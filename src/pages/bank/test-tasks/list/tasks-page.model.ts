import { attach, createEffect, createStore, createEvent, forward, restore } from 'effector-root'
// TODO: correctly define WHICH type of assignment
import {
  deleteTestAssignmentsFx,
  requestDeleteTestAssignmentsFx,
} from '@/features/api/assignment/test-assignment/delete-test-assignment'
import { getTestAssignmentTreeLightFx } from '@/features/api/assignment/test-assignment/get-test-tree-light'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import {
  GetAssignmentTreeQueryParams,
  RequestDeleteAssignmentsParams,
  UpdateAssignmentsBulkParams,
} from '@/features/api/assignment/types'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { getTestAssignmentTreeFx } from '@/features/api/assignment/test-assignment/get-test-tree'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { condition } from 'patronum'
import { mergeTreeData } from '@/features/lib'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'

const getTasksTree = attach({
  effect: getTestAssignmentTreeFx,
})
const getTasksTreeLight = attach({
  effect: getTestAssignmentTreeLightFx,
})

export const deleteAssignments = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteTestAssignmentsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteAssignments = attach({
  effect: requestDeleteTestAssignmentsFx,
  mapParams: (payload: RequestDeleteAssignmentsParams): RequestDeleteAssignmentsParams => {
    return {
      assignments: payload.assignments,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

export const testTaskPageParams = createPageParamsModel()

export const sendAssignmentsPublish = attach({
  effect: updateTestAssignmentBulkFx,
  mapParams: (params: UpdateAssignmentsBulkParams) => ({ ...params, status: 'published' }),
})

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<void>()
export const setTasksTree = createEvent<TreeData[] | null>()
export const $tasksTree = createStore<TreeData[] | null>(null).on(setTasksTree, (state, data) => {
  if (state === null) return data
  return mergeTreeData(state, data!)
})
export const setTasksTreeTotal = createEvent<number>()
export const $tasksTreeTotal = restore<number>(setTasksTreeTotal, 0)

const showDeleteAssignmentsToast = createEvent<number[]>()

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
  from: deleteAssignments.doneData,
  to: [
    loadTree.prepend(() => ({})),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    showDeleteAssignmentsToast,
  ],
})

condition({
  source: showDeleteAssignmentsToast,
  if: (ids: number[]) => ids.length === 1,
  then: successToastEvent('Задание было успешно удалено!'),
  else: successToastEvent('Задания были успешно удалены!'),
})

forward({
  from: requestDeleteAssignments.doneData,
  to: [
    successToastEvent('Отправлена заявка на удаление'),
    requestDeleteModalVisibilityChanged.prepend(() => false),
  ],
})

forward({
  from: sendAssignmentsPublish.failData.map((res) => res.body),
  to: addToast.prepend((data: any) => ({ type: 'error', message: data.detail })),
})
