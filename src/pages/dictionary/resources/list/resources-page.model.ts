import { attach, createEvent, forward, merge, restore, split } from 'effector-root'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { getResourcesTreeFx } from '@/features/api/media/get-resources-tree'
import { deleteResourceFx } from '@/features/api/media/delete-resource'

const getResourcesTree = attach({
  effect: getResourcesTreeFx,
})

export const deleteResource = attach({
  effect: deleteResourceFx,
})

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
  from: deleteResource.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Обучающий ресурс был успешно удален!' })),
  ],
})

const { noInternet } = split(merge([getResourcesTree.failData, deleteResource.failData]), {
  noInternet: ({ status }) => status === undefined,
})

forward({
  from: noInternet,
  to: addToast.prepend(() => ({ type: 'no-internet', message: 'Отсутствует подключение' })),
})
