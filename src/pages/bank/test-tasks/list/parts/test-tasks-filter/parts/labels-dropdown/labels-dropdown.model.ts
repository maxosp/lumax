import { createEvent, forward, attach, sample } from 'effector-root'
import { getLabelsListFx } from '@/features/api/assignment/labels/get-labels-list'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'
import { GetListQueryParams } from '@/features/api/types'

export const getLabels = attach({
  effect: getLabelsListFx,
})

export const labelsDropdownModule = createDropdownModel(getLabels)

export const loadLabels = createEvent<void>()

sample({
  clock: loadLabels,
  source: { $nextPage: labelsDropdownModule.store.$nextPage },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
  }),
  target: getLabels,
})

forward({
  from: labelsDropdownModule.methods.canLoadNextPage,
  to: loadLabels,
})

sample({
  clock: getLabels.doneData,
  source: { items: labelsDropdownModule.store.$items },
  fn: ({ items }, res) => {
    const newData = res.body.data.map((field) => ({
      name: `${field.id}`,
      title: field.name,
    }))
    return [...items, ...newData]
  },
  target: labelsDropdownModule.store.$items,
})
