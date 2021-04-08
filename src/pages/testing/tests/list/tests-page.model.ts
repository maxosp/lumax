import { attach, createEffect, createEvent, forward } from 'effector'
import { GetTestsListQueryParams, RequestDeleteTestsParams } from '@/features/api/test/types'
import { getTestsListFx } from '@/features/api/test/get-tests-list'
import { deleteTestFx, requestDeleteTestsFx } from '@/features/api/test/delete-test'

const getTestsList = attach({
  effect: getTestsListFx,
})

// TODO: deleting toast, promise.
export const deleteTests = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteTestFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteTests = attach({
  effect: requestDeleteTestsFx,
  mapParams: (payload: RequestDeleteTestsParams): RequestDeleteTestsParams => {
    return {
      tests: payload.tests,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

export const loadList = createEvent<GetTestsListQueryParams>()

forward({
  from: loadList,
  to: getTestsList,
})
