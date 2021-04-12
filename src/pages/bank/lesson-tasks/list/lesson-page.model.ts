import { attach, createEffect, createEvent, forward, restore } from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData, TreeDataLight } from '@/features/api/types'
import {
  GetAssignmentTreeQueryParams,
  RequestDeleteAssignmentsParams,
} from '@/features/api/assignment/types'
import { getLessonAssignmentTreeFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree'
import { getLessonAssignmentTreeLightFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree-light'
import {
  deleteLessonAssignmentsFx,
  requestDeleteLessonAssignmentsFx,
} from '@/features/api/assignment/lesson-assignment/delete-lesson-assignment'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'

const getLessonsTree = attach({
  effect: getLessonAssignmentTreeFx,
})
const getLessonsTreeLight = attach({
  effect: getLessonAssignmentTreeLightFx,
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

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<GetAssignmentTreeQueryParams>()
export const setLessonsTree = createEvent<TreeDataLight[] | TreeData[] | null>()
export const $lessonsTree = restore<TreeDataLight[] | TreeData[] | null>(setLessonsTree, null)
export const setLessonsTreeTotal = createEvent<number>()
export const $lessonsTreeTotal = restore<number>(setLessonsTreeTotal, 0)

const showDeleteAssignmentsToast = createEvent<number[]>()

forward({
  from: loadTreeLight,
  to: getLessonsTreeLight,
})

forward({
  from: loadTree,
  to: getLessonsTree,
})
forward({
  from: getLessonsTreeLight.doneData,
  to: [
    setLessonsTree.prepend((res) => res.body.data),
    setLessonsTreeTotal.prepend((res) => res.body.total),
  ],
})
forward({
  from: getLessonsTree.doneData,
  to: [
    setLessonsTree.prepend((res) => res.body.data),
    setLessonsTreeTotal.prepend((res) => res.body.total),
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
