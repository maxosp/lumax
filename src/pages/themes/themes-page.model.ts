import { attach, createEvent, forward, restore, split } from 'effector-root'
import { getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { deleteThemeFx } from '@/features/api/subject/delete-theme'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
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
export const setThemesTree = createEvent<TreeData | null>()
export const $themesTree = restore<TreeData | null>(setThemesTree, null)
export const setThemesTreeTotal = createEvent<number>()
export const $themesTreeTotal = restore<number>(setThemesTreeTotal, 0)

forward({
  from: loadTree,
  to: getThemesTree,
})

forward({
  from: getThemesTree.doneData,
  to: [
    setThemesTree.prepend((res) => res.body.data),
    setThemesTreeTotal.prepend((res) => res.body.total),
  ],
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
