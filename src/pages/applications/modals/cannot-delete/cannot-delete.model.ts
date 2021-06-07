import { checkBeforeDeletionFx } from '@/features/api/ticket/deletion/check-before-deletion'
import { CheckBeforeDeletionResponseType } from '@/features/api/ticket/types'
import { createEffect, createEvent, createStore, forward, restore, sample } from 'effector-root'
import { deleteApplication } from '@/pages/applications/incoming-deletion/incoming-deletion-applications-page.model'

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore(modalVisibilityChanged, false)

export const loadModal = createEvent<number[]>()

export const removeCannotDeleteData = createEvent<void>()
export const setCannotDeleteData = createEvent<CheckBeforeDeletionResponseType>()
export const $cannotDeleteData = createStore<CheckBeforeDeletionResponseType[]>([])

export const setDataToDelete = createEvent<number[]>()
export const $dataToDelete = createStore<number[]>([])

forward({
  from: loadModal,
  to: modalVisibilityChanged.prepend(() => true),
})

export const checkBeforeDeletion = createEffect({
  handler: (ids: number[]): Promise<any[]> =>
    Promise.all(
      ids.map(async (id) => {
        await checkBeforeDeletionFx(id).then(async (r) => {
          if (r.body[r.body.object_type]) setCannotDeleteData(r.body)
          else await deleteApplication({ tickets: [r.body.id] })
        })
      })
    ),
})

forward({
  from: setDataToDelete,
  to: checkBeforeDeletion,
})

sample({
  clock: setCannotDeleteData,
  source: $cannotDeleteData,
  fn: (oldData, newData) => {
    if (oldData.find((el) => el.id === newData.id)) return oldData
    oldData!.push(newData)
    return [...oldData]
  },
  target: $cannotDeleteData,
})

sample({
  clock: removeCannotDeleteData,
  source: $cannotDeleteData,
  fn: (oldData) => {
    oldData.unshift()
    return oldData
  },
  target: $cannotDeleteData,
})
