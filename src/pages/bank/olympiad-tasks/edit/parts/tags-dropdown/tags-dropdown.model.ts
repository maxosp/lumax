import { createEvent, createStore, forward, attach, restore, sample } from 'effector-root'
import { getTagsListFx } from '@/features/api/assignment/olympiad-tags/get-tags-list'
import { DropdownItem } from '@/pages/common/types'
import { combineEvents } from 'patronum'

export const getTags = attach({
  effect: getTagsListFx,
})

export const $tags = createStore<DropdownItem[]>([])

export const resetSelectedTags = createEvent<void>()
export const setSelectedTagsIds = createEvent<number[]>()
export const setSelectedTags = createEvent<DropdownItem[]>()
export const $selectedTags = restore(setSelectedTags, []).reset(resetSelectedTags)

forward({
  from: getTags.doneData.map((res) =>
    res.body.data.map((tag) => ({ name: `${tag.id}`, title: tag.name }))
  ),
  to: $tags,
})

const a = combineEvents({
  events: {
    selected: setSelectedTagsIds,
    all: getTags.doneData.map((res) => res.body.data),
  },
})
sample({
  clock: a,
  fn: (list) => {
    const arr = list.selected
      .map((selectedId) => list.all.find((tag) => tag.id === selectedId))
      .filter(Boolean)
    const res: DropdownItem[] = arr.map((tag) => ({ name: `${tag!.id}`, title: tag!.name }))
    return res
  },
  target: setSelectedTags,
})
