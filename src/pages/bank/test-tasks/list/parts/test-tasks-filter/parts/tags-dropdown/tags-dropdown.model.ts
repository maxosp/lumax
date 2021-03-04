import { createEvent, createStore, forward, attach } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/get-labels-list'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'

export const tagsDropdownModule = createFilter()

const getTags = attach({
  effect: getLabelsListFx,
  mapParams: (params: GetListQueryParams) => params,
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
