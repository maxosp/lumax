import { attach, createEvent, forward, merge, restore, split } from 'effector-root'
import { deleteThemeFx } from '@/features/api/subject/delete-theme'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { getResourcesTreeFx } from '@/features/api/media/get-resources-tree'

const getResourcesTree = attach({
  effect: getResourcesTreeFx,
})

export const deleteTheme = attach({
  effect: deleteThemeFx,
})

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setResourcesTree = createEvent<TreeData | null>()
export const $resourcesTree = restore<TreeData | null>(setResourcesTree, null)
export const setResourcesTreeTotal = createEvent<number>()
export const $resourcesTreeTotal = restore<number>(setResourcesTreeTotal, 0)

forward({
  from: loadTree,
  to: getResourcesTree,
})

forward({
  from: getResourcesTree.doneData,
  to: [
    setResourcesTree.prepend((res) => res.body.data),
    setResourcesTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteTheme.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Тема была успешно удалена!' })),
  ],
})

const { noInternet } = split(merge([getResourcesTree.failData, deleteTheme.failData]), {
  noInternet: ({ status }) => status === undefined,
})

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
