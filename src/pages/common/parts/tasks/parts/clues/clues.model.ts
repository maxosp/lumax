import { getClueFx } from '@/features/api/assignment/olympiad-clues/get-clue'
import { updateClueFx } from '@/features/api/assignment/olympiad-clues/update-clue'
import { createClueFx } from '@/features/api/assignment/olympiad-clues/create-clue'
import { createEffect, createEvent, createStore, forward, restore } from 'effector-root'
import { Clue } from '@/features/api/assignment/types/types'

export const setClues = createEvent<Clue[]>()
export const resetCluesList = createEvent<void>()
export const $clues = createStore<Clue[]>([])
  .on(setClues, (_state, payload) => {
    return payload.sort((a, b) => a.number! - b.number!)
  })
  .reset(resetCluesList)

export const setCluesIds = createEvent<number[]>()
export const $cluesIds = restore(setCluesIds, [])

export const setCluesEvent = createEvent<number[]>()

export const uploadCluesFx = createEffect({
  handler: (clues: Clue[]): Promise<Clue[]> =>
    Promise.all(
      clues.map(
        (clue) =>
          new Promise<Clue>((resolve) => {
            const res = createClueFx(clue).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

export const updateCluesFx = createEffect({
  handler: (clues: Clue[]): Promise<Clue[]> =>
    Promise.all(
      clues.map(
        ({ id, text, scores }) =>
          new Promise<Clue>((resolve) => {
            const res = updateClueFx({
              data: {
                text,
                scores,
              },
              id: id!,
            }).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

export const handleUpdateCluesFx = createEffect({
  handler: ({ clues, cluesIds }: { clues: Clue[]; cluesIds: number[] }): Promise<Clue[]> =>
    Promise.all(
      clues.map(async (clue: Clue) => {
        const existingClue = cluesIds.find((el: number) => clue.id === el)
        if (existingClue) {
          const res = await updateCluesFx([
            {
              id: clue.id,
              text: clue.text,
              scores: clue.scores,
            },
          ]).then((r) => r[0])
          return res
        }
        const res = await uploadCluesFx([clue]).then((r) => r[0])
        return res
      })
    ),
})

export const getCluesFx = createEffect({
  handler: (cluesIds: number[]): Promise<Clue[]> =>
    Promise.all(
      cluesIds.map(
        (id) =>
          new Promise<Clue>((resolve) => {
            const res = getClueFx(id).then((r) => r.body)
            resolve(res)
          })
      )
    ),
})

forward({
  from: setCluesEvent,
  to: [setCluesIds, getCluesFx],
})

forward({
  from: getCluesFx.doneData,
  to: setClues,
})
