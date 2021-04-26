import {
  attach,
  combine,
  createEffect,
  createEvent,
  forward,
  guard,
  restore,
  sample,
} from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { RequestDeleteAssignmentsParams } from '@/features/api/assignment/types'
import { getLessonAssignmentTreeFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree'
import { getLessonAssignmentTreeLightFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree-light'
import {
  deleteLessonAssignmentsFx,
  requestDeleteLessonAssignmentsFx,
} from '@/features/api/assignment/lesson-assignment/delete-lesson-assignment'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition, every } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import { FiltersParams } from '@/pages/common/types'
import { mergeTreeData } from '@/features/lib'
import { getLessonInfoFx } from '@/features/api/assignment/lesson-assignment/get-tree-info'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { getLessonAssignmentListFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-list'

const getLessonsTree = attach({
  effect: getLessonAssignmentTreeFx,
})
const getLessonsTreeLight = attach({
  effect: getLessonAssignmentTreeLightFx,
})

export const getFilteredTree = attach({
  effect: getLessonAssignmentTreeFx,
})

const getLessonTreeInfo = attach({
  effect: getLessonInfoFx,
})

export const deleteAssignments = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteLessonAssignmentsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteAssignments = attach({
  effect: requestDeleteLessonAssignmentsFx,
  mapParams: (payload: RequestDeleteAssignmentsParams): RequestDeleteAssignmentsParams => {
    return {
      assignments: payload.assignments,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

export const lessonTaskPageParams = createPageParamsModel()

export const loadTree = createEvent<FiltersParams>()
export const loadTreeLight = createEvent<void>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteTree = createEvent<TreeData[] | null>()
export const setLessonsTree = createEvent<TreeData[] | null>()
export const $lessonsTree = restore<TreeData[] | null>(rewriteTree, null).on(
  setLessonsTree,
  (state, data) => mergeTreeData(state!, data!)
)
export const setLessonsTreeTotal = createEvent<number>()
export const $lessonsTreeTotal = restore<number>(setLessonsTreeTotal, 0)

const showDeleteAssignmentsToast = createEvent<number[]>()

export const $isLoading = combine(
  getFilteredTree.pending,
  getLessonAssignmentTreeLightFx.pending,
  getLessonAssignmentListFx.pending,
  (tree, light, list) => tree || light || list
)

forward({
  from: loadTreeLight,
  to: [getLessonsTreeLight, getLessonTreeInfo],
})

forward({
  from: loadTree,
  to: [getLessonsTree, getLessonTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

forward({
  from: getLessonInfoFx.doneData.map(({ body }) => body.total_amount),
  to: setLessonsTreeTotal,
})

forward({
  from: getLessonsTreeLight.doneData,
  to: rewriteTree.prepend(({ body }) => body.data),
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getLessonsTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ folder: obj.folder }),
  target: loadTree,
})

forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteTree.prepend(({ body }) => body.data),
    setLessonsTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: getLessonsTree.doneData,
  to: [setLessonsTree.prepend(({ body }) => body.data), resetDataToUpdateTree.prepend(() => ({}))],
})

forward({
  from: deleteAssignments.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
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
