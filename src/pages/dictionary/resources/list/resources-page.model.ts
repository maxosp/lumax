import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { GetThemesTreeQueryParams } from '@/features/api/subject/types'
import { getResourcesTreeFx } from '@/features/api/media/get-resources-tree'
import { deleteResourceFx } from '@/features/api/media/delete-resource'
import { getResourcesTreeLightFx } from '@/features/api/media/get-resources-tree-light'
import { mergeTreeData } from '@/features/lib'

const getResourcesTree = attach({
  effect: getResourcesTreeFx,
})

const getResourcesTreeLight = attach({
  effect: getResourcesTreeLightFx,
})

export const deleteResource = attach({
  effect: deleteResourceFx,
})

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<GetThemesTreeQueryParams>()
export const setResourcesTree = createEvent<TreeData[] | null>()
export const $resourcesTree = createStore<TreeData[] | null>(null).on(
  setResourcesTree,
  (state, data) => {
    if (state === null) return data
    if (data === undefined) return state
    return mergeTreeData(state, data!)
  }
)
export const setResourcesTreeTotal = createEvent<number>()
export const $resourcesTreeTotal = restore<number>(setResourcesTreeTotal, 0)

forward({
  from: loadTreeLight,
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
    loadTreeLight.prepend(() => ({})),
    successToastEvent('Обучающий ресурс был успешно удален!'),
  ],
})
