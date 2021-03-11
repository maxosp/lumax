import { deleteLabelFx } from '@/features/api/assignment/delete-label'
import { getLabelsTreeFx } from '@/features/api/assignment/get-labels-tree'
import { GetLabelsTreeQueryParams } from '@/features/api/assignment/types'
import { TreeData } from '@/features/api/types'
import { addToast } from '@/features/toasts/toasts.model'
import { attach, createEvent, forward, restore } from 'effector-root'

export const getLabelsTree = attach({
  effect: getLabelsTreeFx,
  mapParams: (params: GetLabelsTreeQueryParams) => params,
})

export const deleteLabel = attach({
  effect: deleteLabelFx,
})

export const loadTree = createEvent<any>()
export const setLabelsTree = createEvent<TreeData | null>()
export const $labelsTree = restore<TreeData | null>(setLabelsTree, null)
export const setLabelsTreeTotal = createEvent<number>()
export const $labelsTreeTotal = restore<number>(setLabelsTreeTotal, 0)

forward({
  from: loadTree,
  to: getLabelsTree,
})

forward({
  from: getLabelsTree.doneData,
  to: [
    setLabelsTree.prepend((res) => res.body.data),
    setLabelsTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteLabelFx.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Метка была успешно удалена!' })),
  ],
})
