import { deleteTagFx } from '@/features/api/assignment/delete-tag'
import { deleteTagsFx } from '@/features/api/assignment/delete-tags'
import { getTagsTreeFx } from '@/features/api/assignment/get-tags-tree'
import { DeleteTagsType, GetTagsTreeQueryParams } from '@/features/api/assignment/types'
import { TreeData } from '@/features/api/types'
import { addToast } from '@/features/toasts/toasts.model'
import { attach, createEvent, forward, restore } from 'effector-root'

export const getTagsTree = attach({
  effect: getTagsTreeFx,
  mapParams: (params: GetTagsTreeQueryParams) => params,
})

export const deleteTag = attach({
  effect: deleteTagFx,
})

export const deleteTags = attach({
  effect: deleteTagsFx,
  mapParams: (params: DeleteTagsType) => params,
})

export const canrefreshTableAfterDeletionChanged = createEvent<boolean>()
export const $canRefreshTableAfterDeletion = restore<boolean>(
  canrefreshTableAfterDeletionChanged,
  false
)

export const loadTree = createEvent<any>()
export const setTagsTree = createEvent<TreeData | null>()
export const $tagsTree = restore<TreeData | null>(setTagsTree, null)
export const setTagsTreeTotal = createEvent<number>()
export const $tagsTreeTotal = restore<number>(setTagsTreeTotal, 0)

forward({
  from: loadTree,
  to: getTagsTree,
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
  from: deleteTag.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Тег был успешно удален!' })),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
  ],
})

forward({
  from: deleteTags.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Теги были успешно удалены!' })),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
  ],
})
