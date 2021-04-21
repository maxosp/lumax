import { attach, createEffect, createEvent, forward, guard, restore, sample } from 'effector-root'
import { getTagsTreeFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree'
import { deleteTagsFx } from '@/features/api/assignment/olympiad-tags/delete-tag'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData } from '@/features/api/types'
import { getTagsTreeLightFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree-light'
import { mergeTreeData } from '@/features/lib'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition, every } from 'patronum'
import { FiltersParams } from '@/pages/common/types'
import { getTagsInfoFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree-info'
import { createPageParamsModel } from '@/pages/common/page-params/create-page-params-model'
import {
  $dataToUpdateTree,
  resetDataToUpdateTree,
} from '@/pages/common/parts/tree/data-to-update-tree/data-to-update-tree.model'

export const getTagsTree = attach({
  effect: getTagsTreeFx,
})
export const getTagsTreeLight = attach({
  effect: getTagsTreeLightFx,
})
export const getFilteredTree = attach({
  effect: getTagsTreeFx,
})

const getTagsTreeInfo = attach({
  effect: getTagsInfoFx,
})

export const deleteTags = createEffect({
  handler: (ids: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      deleteTagsFx(ids).then(() => {
        resolve(ids)
      })
    })
  },
})

export const tagsPageParams = createPageParamsModel()

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<FiltersParams>()
export const loadFilteredTree = createEvent<FiltersParams>()
const rewriteTagsTree = createEvent<TreeData[] | null>()
export const setTagsTree = createEvent<TreeData[] | null>()
export const $tagsTree = restore<TreeData[] | null>(rewriteTagsTree, null).on(
  setTagsTree,
  (state, data) => mergeTreeData(state!, data!)
)
export const setTagsTreeTotal = createEvent<number>()
export const $tagsTreeTotal = restore<number>(setTagsTreeTotal, 0)

const showDeleteAssignmentsToast = createEvent<number[]>()

forward({
  from: loadTree,
  to: [getTagsTree, getTagsTreeInfo.prepend(() => ({}))],
})

forward({
  from: loadTreeLight,
  to: [getTagsTreeLight, getTagsTreeInfo],
})

forward({
  from: loadFilteredTree,
  to: getFilteredTree,
})

forward({
  from: getTagsInfoFx.doneData.map(({ body }) => body.total_amount),
  to: setTagsTreeTotal,
})
forward({
  from: getFilteredTree.doneData,
  to: [
    rewriteTagsTree.prepend(({ body }) => body.data),
    setTagsTreeTotal.prepend(({ body }) => body.total),
  ],
})

forward({
  from: getTagsTreeLight.doneData,
  to: [
    rewriteTagsTree.prepend(({ body }) => body.data),
    canrefreshTableAfterDeletionChanged.prepend(() => false),
  ],
})
forward({
  from: getTagsTree.doneData,
  to: [
    setTagsTree.prepend(({ body }) => body.data),
    canrefreshTableAfterDeletionChanged.prepend(() => false),
    resetDataToUpdateTree.prepend(() => ({})),
  ],
})

const $canUpdateTree = every({
  stores: [$dataToUpdateTree],
  predicate: (value) => !!Object.entries(value).length,
})

sample({
  clock: guard({ source: getTagsTreeLight.doneData, filter: $canUpdateTree }),
  source: $dataToUpdateTree,
  fn: (obj) => ({ subject: obj.subject, study_year: obj.study_year }),
  target: loadTree,
})

forward({
  from: deleteTags.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
    confirmDeleteModalVisibilityChanged.prepend(() => false),
    showDeleteAssignmentsToast,
  ],
})

condition({
  source: showDeleteAssignmentsToast,
  if: (ids: number[]) => ids.length === 1,
  then: successToastEvent('Тег был успешно удален!'),
  else: successToastEvent('Теги были успешно удалены!'),
})
