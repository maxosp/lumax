import { createEvent, createStore, forward, attach } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const tagsDropdownModule = createFilter()

const getTags = attach({
  effect: getLabelsListFx,
})

export const loadTags = createEvent<void>()
export const $tags = createStore<DropdownItem[]>([])

forward({
  from: loadTags,
  to: getTags.prepend(() => ({})),
})

forward({
  from: getTags.doneData.map((res) =>
    res.body.data.map((subject) => ({ name: `${subject.id}`, title: subject.name }))
  ),
  to: $tags,
})
