import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getTagsListFx } from '@/features/api/assignment/olympiad-tags/get-tags-list'
import { DropdownItem } from '@/pages/common/types'

export const getTags = attach({
  effect: getTagsListFx,
})

export const $tags = createStore<DropdownItem[]>([])

export const resetSelectedTags = createEvent<void>()
export const setSelectedTags = createEvent<DropdownItem[]>()
export const $selectedTags = restore(setSelectedTags, []).reset(resetSelectedTags)

forward({
  from: getTags.doneData.map((res) =>
    res.body.data.map((tag) => ({ name: `${tag.id}`, title: tag.name }))
  ),
  to: $tags,
})
