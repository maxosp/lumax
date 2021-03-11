import { attach, createEvent, forward, restore } from 'effector-root'
import { getThemesTreeFx } from '@/features/api/subject/get-themes-tree'
import { deleteThemeFx } from '@/features/api/subject/delete-theme'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { deleteThemesFx } from '@/features/api/subject/delete-themes'

const getThemesTree = attach({
  effect: getThemesTreeFx,
})

export const deleteTheme = attach({
  effect: deleteThemeFx,
})

export const deleteThemes = attach({
  effect: deleteThemesFx,
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
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Тема была успешно удалена!' })),
  ],
})
