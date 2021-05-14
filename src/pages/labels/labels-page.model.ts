import { deleteLabelsFx } from '@/features/api/assignment/labels/delete-label'
import { getLabelsTreeFx } from '@/features/api/assignment/labels/get-labels-tree'
import { getLabelsTreeLightFx } from '@/features/api/assignment/labels/get-labels-tree-light'
import { getLabelsInfoFx } from '@/features/api/assignment/labels/get-labels-info'
import { TreeData } from '@/features/api/types'
import { cropString, mergeTreeData } from '@/features/lib'
import { successToastEvent } from '@/features/toasts/toasts.model'
import {
  attach,
  createEffect,
  createEvent,
  forward,
  restore,
  guard,
  sample,
  combine,
} from 'effector-root'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { FiltersParams } from '@/pages/common/types'
import { every } from 'patronum'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'

export const getLabelsTree = attach({
  effect: getLabelsTreeFx,
})

export const getFilteredTree = attach({
  effect: getLabelsTreeFx,
})

export const getLabelsTreeLight = attach({
  effect: getLabelsTreeLightFx,
})

const getLabelsTreeInfo = attach({
  effect: getLabelsInfoFx,
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
export const loadTree = createEvent<FiltersParams>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteLabelsTree = createEvent<TreeData[] | null>()
export const setLabelsTree = createEvent<TreeData[] | null>()
export const $labelsTree = restore<TreeData[] | null>(rewriteLabelsTree, null).on(
  setLabelsTree,
  (state, data) => mergeTreeData(state!, data!)
)
export const setLabelsTreeTotal = createEvent<number>()
export const $labelsTreeTotal = restore<number>(setLabelsTreeTotal, 0)

export const collectTaskData = createEffect({
  handler: (ids: number[]): Promise<any[]> =>
    Promise.all(
      ids.map(
        async (id) =>
          new Promise<any>((resolve) => {
            const res = getTestAssignmentFx(id).then((r) => {
              return {
                id: r.body.id,
                name: `${r.body.id}`,
                title: `[id${r.body.id}] - ${cropString(r.body.wording, 34)}`,
              }
            })
            resolve(res)
          })
      )
    ),
})

forward({
  from: loadTreeLight,
  to: [getLabelsTreeLight, getLabelsTreeInfo],
})

forward({
  from: loadTree,
  to: [getLabelsTree, getLabelsTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

export const $isLoading = combine(
  getFilteredTree.pending,
  getLabelsTreeLightFx.pending,
  (tree, light) => tree || light
)

forward({
  from: getLabelsInfoFx.doneData.map(({ body }) => body.total_amount),
  to: setLabelsTreeTotal,
})

forward({
  from: getLabelsTreeLight.doneData,
  to: rewriteLabelsTree.prepend(({ body }) => body.data),
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getLabelsTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ subject: obj.subject, study_year: obj.study_year }),
  target: loadTree,
})

forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteLabelsTree.prepend(({ body }) => body.data),
    setLabelsTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: getLabelsTree.doneData,
  to: [setLabelsTree.prepend(({ body }) => body.data), resetDataToUpdateTree.prepend(() => ({}))],
})

forward({
  from: deleteLabels.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    successToastEvent('Метка была успешно удалена!'),
  ],
})
