import { getThemeFx } from '@/features/api/subject/get-theme'
import { getThemesListFx } from '@/features/api/subject/get-themes-list'
import { DropdownItem } from '@/pages/common/types'
import { attach, createEvent, forward, restore, sample } from 'effector-root'
import { GetListQueryParams } from '@/features/api/types'
import { $selectedSubject } from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { Theme } from '@/features/api/subject/types'

export const getThemeData = attach({
  effect: getThemeFx,
})

export const getPrerequisites = attach({
  effect: getThemesListFx,
  mapParams: (params: GetListQueryParams) => params,
})

export const prerequisitesDropdownModel = createDropdownModel<Theme>(getPrerequisites)

export const setSelectedPrerequisites = createEvent<DropdownItem[]>()
export const $selectedPrerequisites = restore<DropdownItem[]>(setSelectedPrerequisites, [])
export const resetSelectedPrerequisites = createEvent()
export const deletePrerequisite = createEvent<string>()

export const loadPrerequisites = createEvent<void>()

sample({
  clock: [loadPrerequisites, $selectedSubject],
  source: { $nextPage: prerequisitesDropdownModel.store.$nextPage, $selectedSubject },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
    subject: params.$selectedSubject!.id,
    is_prerequisite: true,
  }),
  target: getPrerequisites,
})

forward({
  from: prerequisitesDropdownModel.methods.canLoadNextPage,
  to: loadPrerequisites,
})

sample({
  clock: getPrerequisites.doneData,
  source: { items: prerequisitesDropdownModel.store.$items },
  fn: ({ items }, res) => {
    const newColors = res.body.data.map((field) => ({
      name: `${field.id}`,
      title: field.name,
      id: field.id,
    }))
    return [...items, ...newColors]
  },
  target: prerequisitesDropdownModel.store.$items,
})

forward({
  from: $selectedSubject,
  to: prerequisitesDropdownModel.methods.resetDropdown,
})

sample({
  source: {
    selected: $selectedPrerequisites,
    all: prerequisitesDropdownModel.store.$itemsDropdown,
  },
  clock: prerequisitesDropdownModel.methods.itemChanged,
  fn: (list, element) => {
    if (!list.all.length) return [...list.selected]
    const arr = list.selected.slice()
    if (!arr.find(((el: any) => el.name === element) || !arr.length) && element) {
      const elem = list.all.find((full) => full.name === element)
      arr.push(elem!)
    }
    return [...arr]
  },
  target: $selectedPrerequisites,
})

sample({
  source: $selectedPrerequisites,
  clock: resetSelectedPrerequisites,
  fn: () => [],
  target: $selectedPrerequisites,
})

sample({
  source: $selectedPrerequisites,
  clock: deletePrerequisite,
  fn: (list, id: string) => list.filter((el: any) => el.name !== id),
  target: $selectedPrerequisites,
})
