import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { getTagsListFx } from '@/features/api/assignment/olympiad-tags/get-tags-list'
import { DropdownItem } from '@/pages/common/types'

const getTags = attach({
  effect: getTagsListFx,
})

export const loadTags = createEvent<void>()
export const $tags = createStore<DropdownItem[]>([])

export const setSelectedTags = createEvent<DropdownItem[]>()
export const $selectedTags = restore(setSelectedTags, [])

forward({
  from: loadTags,
  to: getTags.prepend(() => ({})),
})

forward({
  from: getTags.doneData.map((res) =>
    res.body.data.map((tag) => ({ name: `${tag.id}`, title: tag.name }))
  ),
  to: $tags,
})
