import { attach, createEffect, createEvent, forward, restore, sample, guard } from 'effector-root'
import { gethThemesTreeLightFx, getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { deleteThemesFx, requestDeleteThemesFx } from '@/features/api/subject/delete-themes'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition, every } from 'patronum'
import { requestDeleteModalVisibilityChanged } from '@/pages/common/modals/request-delete/request-delete-modal.model'
import { RequestDeleteThemesParams } from '@/features/api/assignment/types'
import { mergeTreeData } from '@/features/lib'
import { getThemesInfoFx } from '@/features/api/subject/get-themes-tree-info'
import { FiltersParams } from '@/pages/common/types'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { loadTreeLight as loadTasksTreeLight } from '@/pages/bank/test-tasks/list/tasks-page.model'

const getThemesTree = attach({
  effect: getThemesTreeFx,
})

const getThemesLightTree = attach({
  effect: gethThemesTreeLightFx,
})

export const getFilteredTree = attach({
  effect: getThemesTreeFx,
})

const getThemesTreeInfo = attach({
  effect: getThemesInfoFx,
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

export const themesPageParams = createPageParamsModel()

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteThemesTree = createEvent<TreeData[] | null>()
export const setThemesTree = createEvent<TreeData[] | null>()
export const $themesTree = restore<TreeData[] | null>(rewriteThemesTree, null).on(
  setThemesTree,
  (state, data) => {
    if (state === null) return data
    return mergeTreeData(state, data!)
  }
)
export const setThemesTreeTotal = createEvent<number>()
export const $themesTreeTotal = restore<number>(setThemesTreeTotal, 0)

const showDeleteThemesToast = createEvent<number[]>()

forward({
  from: loadTree,
  to: [getThemesTree, getThemesTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadTreeLight,
  to: [getThemesLightTree, getThemesTreeInfo],
})

forward({
  from: loadFilteredTree,
  to: [getFilteredTree, getThemesTreeInfo.prepend(() => ({}))],
})

forward({
  from: getThemesTreeInfo.doneData.map((res) => res.body.total_amount),
  to: setThemesTreeTotal,
})

forward({
  from: getFilteredTree.doneData,
  to: rewriteThemesTree.prepend((res) => res.body.data),
})

forward({
  from: getThemesTree.doneData,
  to: [setThemesTree.prepend((res) => res.body.data), resetDataToUpdateTree.prepend(() => ({}))],
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getThemesLightTree.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ subject: obj.subject, study_year: obj.study_year, theme: obj.theme }),
  target: loadTree,
})

forward({
  from: getThemesLightTree.doneData,
  to: rewriteThemesTree.prepend((res) => res.body.data),
})

forward({
  from: deleteThemes.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    loadTasksTreeLight.prepend(() => ({})),
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
  from: requestDeleteThemes.doneData,
  to: [
    successToastEvent('Отправлена заявка на удаление'),
    requestDeleteModalVisibilityChanged.prepend(() => false),
  ],
})
