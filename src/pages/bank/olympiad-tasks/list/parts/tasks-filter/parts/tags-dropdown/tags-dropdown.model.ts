import { createEvent, attach, forward, restore, sample } from 'effector-root'
import { getTagsListFx } from '@/features/api/assignment/olympiad-tags/get-tags-list'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { Tag } from '@/features/api/assignment/types/types'

export const getTags = attach({
  effect: getTagsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const tagsDropdownModel = createDropdownModel<Tag>(getTags)

export const setSelectedTags = createEvent<DropdownItem[]>()
export const $selectedTags = restore<DropdownItem[]>(setSelectedTags, [])
export const resetSelectedTags = createEvent()
export const deleteTag = createEvent<string>()

export const loadTags = createEvent<void>()

sample({
  clock: loadTags,
  source: { $nextPage: tagsDropdownModel.store.$nextPage },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
  }),
  target: getTags,
})

forward({
  from: tagsDropdownModel.methods.canLoadNextPage,
  to: loadTags,
})

sample({
  clock: getTags.doneData,
  source: { items: tagsDropdownModel.store.$items },
  fn: ({ items }, res) => {
    const newTags = res.body.data.map((field) => ({ name: `${field.id}`, title: field.name }))
    return [...items, ...newTags]
  },
  target: tagsDropdownModel.store.$items,
})

sample({
  source: {
    selected: $selectedTags,
    all: tagsDropdownModel.store.$itemsDropdown,
  },
  clock: tagsDropdownModel.methods.itemChanged,
  fn: (list, element) => {
    if (!list.all.length) return []
    const arr = list.selected.slice()
    if (!arr.find(((el: any) => el.name === element) || !arr.length) && element) {
      const elem = list.all.find((full) => full.name === element)
      arr.push(elem!)
    }
    return [...arr]
  },
  target: $selectedTags,
})

sample({
  source: $selectedTags,
  clock: resetSelectedTags,
  fn: () => [],
  target: $selectedTags,
})

sample({
  source: $selectedTags,
  clock: deleteTag,
  fn: (list, id: string) => list.filter((el: any) => el.name !== id),
  target: $selectedTags,
})
