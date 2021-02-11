import { attach, createEvent, forward, restore, split } from 'effector-root'
import { getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { deleteThemeFx } from '@/features/api/subject/delete-theme'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeDataResponse } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'

const getThemesTree = attach({
  effect: getThemesTreeFx,
})

export const deleteTheme = attach({
  effect: deleteThemeFx,
})

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setThemesTree = createEvent<TreeDataResponse | null>()
export const $themesTree = restore<TreeDataResponse | null>(setThemesTree, null)

forward({
  from: loadTree,
  to: getThemesTree,
})

forward({
  from: getThemesTree.doneData.map((res) => res.body),
  to: setThemesTree,
})

forward({
  from: deleteTheme.doneData,
  to: loadTree.prepend(() => ({})),
})

const { noInternet } = split(getThemesTree.failData, {
  noInternet: ({ status }) => status === undefined,
})

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
