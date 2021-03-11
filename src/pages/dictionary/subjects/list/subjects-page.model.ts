import { attach, combine, createEvent, createStore, forward, restore, sample } from 'effector-root'
import { addToast } from '@/features/toasts/toasts.model'
import { getSubjectFx } from '@/features/api/subject/get-subject'
import { deleteSubjectFx, deleteSubjectsFx } from '@/features/api/subject/delete-subject'
import { updateSubjectFx } from '@/features/api/subject/update-subject'
import { CreateSubjectType } from '@/features/api/subject/types'

export const deleteSubject = attach({
  effect: deleteSubjectFx,
})
export const deleteManySubjects = attach({
  effect: deleteSubjectsFx,
})
const updateSubjectDataFx = attach({
  effect: updateSubjectFx,
  mapParams: (params: CreateSubjectType) => params,
})
const getSubjectToUpdate = attach({
  effect: getSubjectFx,
})

export const changeIsMondatory = createEvent<boolean>()
export const $isMondatory = restore(changeIsMondatory, false)

export const changeIdSubject = createEvent<number>()
export const $idSubject = restore(changeIdSubject, -1)

export const $triggerToRefreshTable = createStore(false)
$triggerToRefreshTable.on(updateSubjectDataFx.doneData, (state) => !state)

const changeSubject = createEvent<any>()
const $subject = restore(changeSubject, null)

// методы
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
forward({
  from: deleteSubject.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Предмет был успешно удалён!' })),
})
forward({
  from: updateSubjectDataFx.doneData,
  to: addToast.prepend(() => ({ type: 'success', message: 'Предмет был успешно изменен!' })),
})
