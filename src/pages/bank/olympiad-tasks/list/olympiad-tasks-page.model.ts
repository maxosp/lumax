import { attach, combine, createEffect, createEvent, forward, restore } from 'effector-root'
import { getOlympiadTasksListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-tasks-list'
import { successToastEvent } from '@/features/toasts/toasts.model'
import {
  deleteOlympiadAssignmentsFx,
  requestDeleteOlympiadAssignmentsFx,
} from '@/features/api/assignment/olympiad-assignment/delete-olympiad-assignment'
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'
import { GetListQueryParams } from '@/features/api/types'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { loadTree } from '@/pages/bank/lesson-tasks/list/lesson-page.model'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import { RequestDeleteAssignmentsParams } from '@/features/api/assignment/types/types'
import {
  $nDuplicate,
  changedDuplicateModalVisibility,
} from '@/pages/bank/common/modals/duplicate/duplicate.model'
import { OlympiadAssignmentsBulkUpdate } from '@/features/api/assignment/types/olympiad-assignments-types'

const getOlympiadsTasksList = attach({
  effect: getOlympiadTasksListFx,
})

export const deleteAssignments = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteOlympiadAssignmentsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteAssignments = attach({
  effect: requestDeleteOlympiadAssignmentsFx,
  mapParams: (payload: RequestDeleteAssignmentsParams): RequestDeleteAssignmentsParams => {
    return {
      assignments: payload.assignments,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

export const duplicateAssignment = attach({
  effect: updateOlympiadAssignmentBulkFx,
  source: $nDuplicate,
  mapParams: (id: number[], n: number): OlympiadAssignmentsBulkUpdate => ({
    assignments: id,
    number_of_duplicates: n,
  }),
})

export const olympiadTaskPageParams = createPageParamsModel()

export const canRefreshAfterDuplicateChanged = createEvent<boolean>()
export const $canRefreshAfterDuplicate = restore<boolean>(canRefreshAfterDuplicateChanged, false)

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

const showDeleteAssignmentsToast = createEvent<number[]>()

export const $isLoading = combine(getOlympiadTasksListFx.pending, (list) => list)

export const loadList = createEvent<GetListQueryParams>()

forward({
  from: loadList,
  to: getOlympiadsTasksList,
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

forward({
  from: deleteAssignments.doneData,
  to: [
    loadTree.prepend(() => ({})),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
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
    canrefreshTableAfterDeletionChanged.prepend(() => true),
    successToastEvent('Отправлена заявка на удаление'),
    requestDeleteModalVisibilityChanged.prepend(() => false),
  ],
})
