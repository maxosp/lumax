import { attach, createEvent, forward, restore } from 'effector-root'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { getResourcesTreeFx } from '@/features/api/media/get-resources-tree'
import { deleteResourceFx } from '@/features/api/media/delete-resource'
import { getResourcesTreeLightFx } from '@/features/api/media/get-resources-tree-light'

const getResourcesTree = attach({
  effect: getResourcesTreeFx,
})

const getResourcesTreeLight = attach({
  effect: getResourcesTreeLightFx,
})

export const deleteResource = attach({
  effect: deleteResourceFx,
})

export const loadLightTree = createEvent<GetThemesTreeQueryParams>()
export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setResourcesTree = createEvent<TreeData | null>()
export const $resourcesTree = restore<TreeData | null>(setResourcesTree, null)
export const setResourcesTreeTotal = createEvent<number>()
export const $resourcesTreeTotal = restore<number>(setResourcesTreeTotal, 0)

forward({
  from: loadLightTree,
  to: getResourcesTreeLight,
})

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
  from: getResourcesTreeLight.doneData,
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
