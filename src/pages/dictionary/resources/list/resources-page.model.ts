import {
  attach,
  combine,
  createEffect,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
  sample,
} from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { getResourcesTreeFx } from '@/features/api/media/get-resources-tree'
import { deleteResourcesFx } from '@/features/api/media/delete-resources'
import { getResourcesTreeLightFx } from '@/features/api/media/get-resources-tree-light'
import { mergeTreeData, sortTreeLeaves } from '@/features/lib'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { getResourcesInfoFx } from '@/features/api/media/get-resources-tree-info'
import { FiltersParams } from '@/pages/common/types'
import { every } from 'patronum'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { resourcesFilters } from '@/pages/dictionary/resources/list/parts/resources-filter/resources-filter.model'

const getResourcesTree = attach({
  effect: getResourcesTreeFx,
})

const getResourcesTreeLight = attach({
  effect: getResourcesTreeLightFx,
})

export const getFilteredTree = attach({
  effect: getResourcesTreeFx,
})

const getResourcesTreeInfo = attach({
  effect: getResourcesInfoFx,
})

export const deleteResources = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteResourcesFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<FiltersParams>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteResourcesTree = createEvent<TreeData[] | null>()
export const setResourcesTree = createEvent<TreeData[] | null>()
export const $resourcesTree = createStore<TreeData[] | null>(null)
  .on(setResourcesTree, (state, data) => {
    if (state === null) return data
    if (data === undefined) return state
    return mergeTreeData(state, data!)
  })
  .on(rewriteResourcesTree, (state, payload) => sortTreeLeaves(payload!))

export const setResourcesTreeTotal = createEvent<number>()
export const $resourcesTreeTotal = restore<number>(setResourcesTreeTotal, 0)

export const $isLoading = combine(
  getFilteredTree.pending,
  getResourcesTreeLightFx.pending,
  (tree, light) => tree || light
)

forward({
  from: loadTreeLight,
  to: [getResourcesTreeLight, getResourcesTreeInfo],
})

forward({
  from: loadTree,
  to: [getResourcesTree, getResourcesTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

forward({
  from: getResourcesTreeInfo.doneData.map(({ body }) => body.total_amount),
  to: setResourcesTreeTotal,
})

forward({
  from: getResourcesTree.doneData,
  to: [
    setResourcesTree.prepend(({ body }) => body.data),
    resetDataToUpdateTree.prepend(() => ({})),
  ],
})

forward({
  from: getResourcesTreeLight.doneData,
  to: rewriteResourcesTree.prepend(({ body }) => body.data),
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getResourcesTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ subject: obj.subject, study_year: obj.study_year, theme: obj.theme }),
  target: loadTree,
})

forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteResourcesTree.prepend(({ body }) => body.data),
    setResourcesTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: deleteResources.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    successToastEvent('Обучающий ресурс был успешно удален!'),
  ],
})

forward({
  from: resourcesFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: resourcesFilters.methods.applyFilters,
  source: resourcesFilters.store.$filterParams,
  target: loadFilteredTree,
})
