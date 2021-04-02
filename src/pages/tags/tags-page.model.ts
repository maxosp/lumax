import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { getTagsTreeFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree'
import { deleteTagFx, deleteTagsFx } from '@/features/api/assignment/olympiad-tags/delete-tag'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { DeleteTagsType, GetTagsTreeQueryParams } from '@/features/api/assignment/types'
import { TreeData } from '@/features/api/types'
import { getTagsTreeLightFx } from '@/features/api/assignment/olympiad-tags/get-tags-tree-light'
import { mergeTreeData } from '@/features/lib'

export const getTagsTree = attach({
  effect: getTagsTreeFx,
})
export const getTagsTreeLight = attach({
  effect: getTagsTreeLightFx,
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

export const loadTreeLight = createEvent<void>()
export const loadTree = createEvent<GetTagsTreeQueryParams>()
export const setTagsTree = createEvent<TreeData[] | null>()
export const $tagsTree = createStore<TreeData[] | null>(null).on(setTagsTree, (state, data) => {
  if (state === null) return data
  return mergeTreeData(state, data!)
})
export const setTagsTreeTotal = createEvent<number>()
export const $tagsTreeTotal = createStore<number>(0)

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
  from: deleteTag.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    successToastEvent('Тег был успешно удален!'),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
  ],
})

forward({
  from: deleteTags.doneData,
  to: [
    loadTreeLight.prepend(() => ({})),
    successToastEvent('Теги были успешно удалены!'),
    canrefreshTableAfterDeletionChanged.prepend(() => true),
  ],
})
