import {
  attach,
  createEffect,
  createEvent,
  forward,
  restore,
  sample,
  guard,
  combine,
  createStore,
} from 'effector-root'
// TODO: correctly define WHICH type of assignment
import {
  deleteTestAssignmentsFx,
  requestDeleteTestAssignmentsFx,
} from '@/features/api/assignment/test-assignment/delete-test-assignment'
import { getTestAssignmentTreeLightFx } from '@/features/api/assignment/test-assignment/get-test-tree-light'
import { addToast, successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { updateTestAssignmentBulkFx } from '@/features/api/assignment/test-assignment/update-test-assignment-bulk'
import { getTestAssignmentTreeFx } from '@/features/api/assignment/test-assignment/get-test-tree'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { condition, every } from 'patronum'
import { mergeTreeData, sortTreeLeaves } from '@/features/lib'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import { getAssignmentInfoFx } from '@/features/api/assignment/test-assignment/get-tree-info'
import { FiltersParams } from '@/pages/common/types'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { getTestAssignmentListFx } from '@/features/api/assignment/test-assignment/get-test-list'
import { TestAssignmentsBulkUpdate } from '@/features/api/assignment/types/test-assignments-types'
import {
  GetAssignmentTreeQueryParams,
  RequestDeleteAssignmentsParams,
} from '@/features/api/assignment/types/types'
import {
  $nDuplicate,
  changedDuplicateModalVisibility,
} from '@/pages/bank/common/modals/duplicate/duplicate.model'
import { exportTestAssignmentListFx } from '@/features/api/assignment/test-assignment/export-test-assignment'
import { testTasksFilters } from '@/pages/bank/test-tasks/list/parts/test-tasks-filter/test-tasks-filter.model'
import { $exportColumnsQueryParam } from '@/pages/common/parts/header/header-popup/header-popup.model'

const getTasksList = attach({
  effect: getTestAssignmentListFx,
})

const getTasksTree = attach({
  effect: getTestAssignmentTreeFx,
})
const getFilteredTree = attach({
  effect: getTestAssignmentTreeFx,
})
const getTasksTreeLight = attach({
  effect: getTestAssignmentTreeLightFx,
})

const getAssignmentTreeInfo = attach({
  effect: getAssignmentInfoFx,
})

export const loadList = createEvent<GetAssignmentTreeQueryParams>()

forward({
  from: loadList,
  to: getTasksList,
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

export const duplicateAssignment = attach({
  effect: updateTestAssignmentBulkFx,
  source: $nDuplicate,
  mapParams: (id: number[], n: number): TestAssignmentsBulkUpdate => ({
    assignments: id,
    number_of_duplicates: n,
  }),
})

export const downloadTestAssignmentTableFile = attach({
  effect: exportTestAssignmentListFx,
  source: [testTasksFilters.store.$filterParams, $exportColumnsQueryParam],
  mapParams: (_, [filters, exportedColumns]) => {
    return { ...filters, ...exportedColumns }
  },
})

export const testTaskPageParams = createPageParamsModel()

export const canRefreshAfterDuplicateChanged = createEvent<boolean>()
export const $canRefreshAfterDuplicate = restore<boolean>(canRefreshAfterDuplicateChanged, false)

export const sendAssignmentsPublish = attach({
  effect: updateTestAssignmentBulkFx,
  mapParams: (params: TestAssignmentsBulkUpdate): TestAssignmentsBulkUpdate => ({
    ...params,
    status: 'published',
  }),
})

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<void>()
export const loadFilteredTree = createEvent<FiltersParams>()
export const setTasksTree = createEvent<TreeData[] | null>()
const rewriteTasksTree = createEvent<TreeData[] | null>()
export const $tasksTree = createStore<TreeData[] | null>(null)
  .on(setTasksTree, (state, data) => {
    if (state === null) return data
    return mergeTreeData(state, data!)
  })
  .on(rewriteTasksTree, (state, payload) => sortTreeLeaves(payload!))
export const setTasksTreeTotal = createEvent<number>()
export const $tasksTreeTotal = restore<number>(setTasksTreeTotal, 0)

const showDeleteAssignmentsToast = createEvent<number[]>()

export const $isLoading = combine(
  getFilteredTree.pending,
  getTestAssignmentTreeLightFx.pending,
  getTestAssignmentListFx.pending,
  (tree, light, list) => tree || light || list
)

forward({
  from: loadTreeLight,
  to: [getTasksTreeLight, getAssignmentTreeInfo],
})

forward({
  from: loadTree,
  to: [getTasksTree, getAssignmentTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

forward({
  from: getAssignmentTreeInfo.doneData.map(({ body }) => body.total_amount),
  to: setTasksTreeTotal,
})

forward({
  from: getTasksTreeLight.doneData,
  to: rewriteTasksTree.prepend(({ body }) => body.data),
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getTasksTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ subject: obj.subject, study_year: obj.study_year, theme: obj.theme }),
  target: loadTree,
})

forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteTasksTree.prepend(({ body }) => body.data),
    setTasksTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: getTasksTree.doneData,
  to: [setTasksTree.prepend(({ body }) => body.data), resetDataToUpdateTree.prepend(() => ({}))],
})

forward({
  from: deleteAssignments.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    showDeleteAssignmentsToast,
  ],
})

forward({
  from: duplicateAssignment,
  to: canRefreshAfterDuplicateChanged.prepend(() => false),
})

forward({
  from: duplicateAssignment.doneData,
  to: [
    changedDuplicateModalVisibility.prepend(() => false),
    successToastEvent('Задание было успешно дублировано!'),
    loadList.prepend(() => ({})),
    canRefreshAfterDuplicateChanged.prepend(() => true),
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
  from: sendAssignmentsPublish.failData.map(({ body }) => body),
  to: addToast.prepend((data: any) => ({ type: 'error', message: data.detail })),
})

forward({
  from: testTasksFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: testTasksFilters.methods.applyFilters,
  source: testTasksFilters.store.$filterParams,
  target: loadFilteredTree,
})
