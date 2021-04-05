import { attach, createEffect, createEvent, createStore, forward, restore } from 'effector-root'
import { getTagsTreeFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree'
import { deleteTagsFx } from '@/features/api/assignment/olympiad-tags/delete-tag'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { GetTagsTreeQueryParams } from '@/features/api/assignment/types'
import { TreeData } from '@/features/api/types'
import { getTagsTreeLightFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree-light'
import { mergeTreeData } from '@/features/lib'
import { confirmDeleteModalVisibilityChanged } from '@/pages/common/modals/confirm-delete/confirm-delete-modal.model'
import { condition } from 'patronum'

export const getTagsTree = attach({
  effect: getTagsTreeFx,
})
export const getTagsTreeLight = attach({
  effect: getTagsTreeLightFx,
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

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<GetTagsTreeQueryParams>()
export const setTagsTree = createEvent<TreeData[] | null>()
export const $tagsTree = createStore<TreeData[] | null>(null).on(setTagsTree, (state, data) => {
  if (state === null) return data
  return mergeTreeData(state, data!)
})
export const setTagsTreeTotal = createEvent<number>()
export const $tagsTreeTotal = createStore<number>(0)

const showDeleteAssignmentsToast = createEvent<number[]>()

forward({
  from: loadTree,
  to: getTagsTree,
})

forward({
  from: loadTreeLight,
  to: getTagsTreeLight,
})

forward({
  from: getTagsTreeLight.doneData,
  to: [
    setTagsTree.prepend((res) => res.body.data),
    setTagsTreeTotal.prepend((res) => res.body.total),
    canrefreshTableAfterDeletionChanged.prepend(() => false),
  ],
})
forward({
  from: getTagsTree.doneData,
  to: [
    setTagsTree.prepend((res) => res.body.data),
    setTagsTreeTotal.prepend((res) => res.body.total),
    canrefreshTableAfterDeletionChanged.prepend(() => false),
  ],
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
