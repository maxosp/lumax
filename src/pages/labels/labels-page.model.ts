import { deleteLabelsFx } from '@/features/api/assignment/labels/delete-label'
import { getLabelsTreeFx } from '@/features/api/assignment/labels/get-labels-tree'
import { getLabelsTreeLightFx } from '@/features/api/assignment/labels/get-labels-tree-light'
import { GetLabelsTreeQueryParams } from '@/features/api/assignment/types'
import { TreeData } from '@/features/api/types'
import { mergeTreeData } from '@/features/lib'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { attach, createEffect, createEvent, forward, restore } from 'effector-root'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'

export const getLabelsTree = attach({
  effect: getLabelsTreeFx,
  mapParams: (params: GetLabelsTreeQueryParams) => params,
})

const getLabelsTreeLight = attach({
  effect: getLabelsTreeLightFx,
})

export const deleteLabels = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteLabelsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<any>()
const rewriteLabelsTree = createEvent<TreeData[] | null>()
export const setLabelsTree = createEvent<TreeData[] | null>()
export const $labelsTree = restore<TreeData[] | null>(rewriteLabelsTree, null).on(
  setLabelsTree,
  (state, data) => mergeTreeData(state!, data!)
)
export const setLabelsTreeTotal = createEvent<number>()
export const $labelsTreeTotal = restore<number>(setLabelsTreeTotal, 0)

forward({
  from: loadTreeLight,
  to: getLabelsTreeLight,
})

forward({
  from: loadTree,
  to: getLabelsTree,
})

forward({
  from: getLabelsTreeLight.doneData,
  to: [
    rewriteLabelsTree.prepend((res) => res.body.data),
    setLabelsTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: getLabelsTree.doneData,
  to: [
    setLabelsTree.prepend((res) => res.body.data),
    setLabelsTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteLabels.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    successToastEvent('Метка была успешно удалена!'),
  ],
})
