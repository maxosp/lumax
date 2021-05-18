import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  restore,
  sample,
} from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { getSubjectFx } from '@/features/api/subject/get-subject'
import { deleteSubjectsFx, requestDeleteSubjectsFx } from '@/features/api/subject/delete-subject'
import { updateSubjectFx } from '@/features/api/subject/update-subject'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { getSubjectsListFx } from '@/features/api/subject/get-subjects-list'
import { RequestDeleteSubjectsParams } from '@/features/api/assignment/types/types'

export const subjectsFilters = createFiltersModel(
  {
    search_area: 'search_all',
  },
  {}
)
export const deleteSubjects = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteSubjectsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteSubjects = attach({
  effect: requestDeleteSubjectsFx,
  mapParams: (payload: RequestDeleteSubjectsParams): RequestDeleteSubjectsParams => {
    return {
      subjects: payload.subjects,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

const updateSubjectDataFx = attach({
  effect: updateSubjectFx,
})
const getSubjectToUpdate = attach({
  effect: getSubjectFx,
})

export const changeIsMondatory = createEvent<boolean>()
export const $isMondatory = restore(changeIsMondatory, false)

export const changeIdSubject = createEvent<number>()
export const $idSubject = restore(changeIdSubject, -1)

export const triggerToRefreshTableChanged = createEvent<boolean>()
export const $triggerToRefreshTable = createStore(false).on(
  triggerToRefreshTableChanged,
  (state, payload) => payload
)

const changeSubject = createEvent<any>()
const $subject = restore(changeSubject, null)

const showDeleteThemesToast = createEvent<number[]>()

export const $isLoading = combine(getSubjectsListFx.pending, (list) => list)

sample({
  clock: changeIdSubject,
  source: $idSubject,
  target: getSubjectToUpdate,
})
forward({
  from: getSubjectToUpdate.doneData,
  to: changeSubject.prepend((data) => data.body),
})
sample({
  clock: changeSubject,
  source: combine($subject, $isMondatory, (subject, is_moderatory) => ({
    ...subject,
    is_moderatory,
  })),
  target: updateSubjectDataFx,
})

sample({
  clock: updateSubjectDataFx.doneData,
  source: $triggerToRefreshTable,
  fn: (triggerValue) => !triggerValue,
  target: triggerToRefreshTableChanged,
})

forward({
  from: deleteSubjects.doneData,
  to: [confirmDeleteModalVisibilityChanged.prepend(() => false), showDeleteThemesToast],
})

condition({
  source: showDeleteThemesToast,
  if: (ids: number[]) => ids.length === 1,
  then: successToastEvent('Предмет был успешно удалён!'),
  else: successToastEvent('Предмет был успешно удалены!'),
})

forward({
  from: requestDeleteSubjects.doneData,
  to: [
    successToastEvent('Отправлена заявка на удаление'),
    requestDeleteModalVisibilityChanged.prepend(() => false),
  ],
})

forward({
  from: updateSubjectDataFx.doneData,
  to: successToastEvent('Предмет был успешно изменен!'),
})

sample({
  clock: subjectsFilters.methods.applyFilters,
  source: subjectsFilters.store.$filterParams,
  target: getSubjectsListFx,
})

forward({
  from: getSubjectsListFx.doneData,
  to: triggerToRefreshTableChanged.prepend(() => true),
})
