import { attach, createEvent, forward, restore } from 'effector-root'
import { getOlympiadTasksListFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-tasks-list'
import { DuplicateAssignmentType } from '@/features/api/assignment/types'
import { successToastEvent } from '@/features/toasts/toasts.model'
import {
  deleteOlympiadAssignmentFx,
  deleteOlympiadAssignmentsFx,
} from '@/features/api/assignment/olympiad-assignment/delete-olympiad-assignment'
import { modalTaskDeleteVisibilityChanged } from '@/pages/common/modals/tasks-bank/task-delete/task-delete-modal.model'
import { updateOlympiadAssignmentBulkFx } from '@/features/api/assignment/olympiad-assignment/update-olympiad-bulk'
import { GetListQueryParams } from '@/features/api/types'

const getOlympiadsTasksList = attach({
  effect: getOlympiadTasksListFx,
})

export const deleteAssignment = attach({
  effect: deleteOlympiadAssignmentFx,
})

export const deleteAssignments = attach({
  effect: deleteOlympiadAssignmentsFx,
})

export const duplicateAssignment = attach({
  effect: updateOlympiadAssignmentBulkFx,
  mapParams: (params: DuplicateAssignmentType) => ({ ...params, number_of_duplicates: 1 }),
})

export const canRefreshAfterDuplicateChanged = createEvent<boolean>()
export const $canRefreshAfterDuplicate = restore<boolean>(canRefreshAfterDuplicateChanged, false)

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

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
    successToastEvent('Задание было успешно дублировано!'),
    loadList.prepend(() => ({})),
    canRefreshAfterDuplicateChanged.prepend(() => true),
  ],
})

forward({
  from: deleteAssignment.doneData,
  to: [
    loadList.prepend(() => ({})),
    successToastEvent('Задание было успешно удалено!'),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
    modalTaskDeleteVisibilityChanged.prepend(() => false),
  ],
})

forward({
  from: deleteAssignments.doneData,
  to: [
    loadList.prepend(() => ({})),
    successToastEvent('Задания были успешно удалены!'),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
    modalTaskDeleteVisibilityChanged.prepend(() => false),
  ],
})
