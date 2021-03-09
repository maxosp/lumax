import { createEvent, createStore, forward, attach, restore, sample } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { GetListQueryParams } from '@/features/api/types'
import { DropdownItem } from '@/pages/common/types'
import { getTagsListFx } from '@/features/api/assignment/get-tags-list'

export const tagsDropdownModule = createFilter()

const getTags = attach({
  effect: getTagsListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const setSelectedTags = createEvent<DropdownItem[]>()
export const $selectedTags = restore<DropdownItem[]>(setSelectedTags, [])
export const resetSelectedTags = createEvent()
export const deleteTag = createEvent<string>()

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

sample({
  source: {
    selected: $selectedTags,
    all: tagsDropdownModule.store.$itemsDropdown,
  },
  clock: tagsDropdownModule.methods.itemChanged,
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
