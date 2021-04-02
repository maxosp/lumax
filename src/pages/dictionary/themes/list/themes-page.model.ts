import { attach, createEffect, createStore, createEvent, forward, restore } from 'effector-root'
import { gethThemesTreeLightFx, getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { deleteThemesFx, requestDeleteThemesFx } from '@/features/api/subject/delete-themes'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { RequestDeleteThemesParams } from '@/features/api/assignment/types'
import { mergeTreeData } from '@/features/lib'

const getThemesTree = attach({
  effect: getThemesTreeFx,
})

const getThemesLightTree = attach({
  effect: gethThemesTreeLightFx,
})

export const deleteThemes = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteThemesFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const requestDeleteThemes = attach({
  effect: requestDeleteThemesFx,
  mapParams: (payload: RequestDeleteThemesParams): RequestDeleteThemesParams => {
    return {
      themes: payload.themes,
      ticket_comment: payload.ticket_comment?.trim() !== '' ? payload.ticket_comment : undefined,
    }
  },
})

export const canRefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canRefreshTableAfterDeletionChanged,
  false
)

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setThemesTree = createEvent<TreeData[] | null>()
export const $themesTree = createStore<TreeData[] | null>(null).on(setThemesTree, (state, data) => {
  if (state === null) return data
  return mergeTreeData(state, data!)
})
export const setThemesTreeTotal = createEvent<number>()
export const $themesTreeTotal = restore<number>(setThemesTreeTotal, 0)

const showDeleteThemesToast = createEvent<number[]>()

forward({
  from: loadTree,
  to: getThemesTree,
})

forward({
  from: loadTreeLight,
  to: getThemesLightTree,
})

forward({
  from: getThemesTree.doneData,
  to: [
    setThemesTree.prepend((res) => res.body.data),
    setThemesTreeTotal.prepend((res) => res.body.total),
  ],
})
forward({
  from: getThemesLightTree.doneData,
  to: [
    setThemesTree.prepend((res) => res.body.data),
    setThemesTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteThemes.doneData,
  to: [
    loadTree.prepend(() => ({})),
    canRefreshTableAfterDeletionChanged.prepend(() => true),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    showDeleteThemesToast,
  ],
})

condition({
  source: showDeleteThemesToast,
  if: (ids: number[]) => ids.length === 1,
  then: successToastEvent('Тема была успешно удалена!'),
  else: successToastEvent('Темы были успешно удалены!'),
})

forward({
  from: requestDeleteThemesFx.doneData,
  to: [
    successToastEvent('Отправлена заявка на удаление'),
    requestDeleteModalVisibilityChanged.prepend(() => false),
  ],
})
