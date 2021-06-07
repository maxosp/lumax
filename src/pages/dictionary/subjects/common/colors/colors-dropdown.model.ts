import { attach, createEvent, sample } from 'effector-root'
import { getColorsListFx } from '@/features/api/subject/get-subject-colors'
import { Icon } from '@/features/api/subject/types'
import { GetListQueryParams } from '@/features/api/types'
import { forward } from 'effector'
import { createDropdownModel } from '@/pages/common/filters/create-dropdown-model'

const getColors = attach({
  effect: getColorsListFx,
})

export const colorsDropdownModel = createDropdownModel<Icon>(getColors)
export const loadColors = createEvent<void>()

sample({
  clock: loadColors,
  source: { $nextPage: colorsDropdownModel.store.$nextPage },
  fn: (params): GetListQueryParams => ({
    page: params.$nextPage,
  }),
  target: getColors,
})

forward({
  from: colorsDropdownModel.methods.canLoadNextPage,
  to: loadColors,
})

sample({
  clock: getColors.doneData,
  source: { items: colorsDropdownModel.store.$items },
  fn: ({ items }, res) => {
    const newColors = res.body.data.map((field) => ({
      name: `${field.id}`,
      title: field.name,
      value: field.value,
    }))
    return [...items, ...newColors]
  },
  target: colorsDropdownModel.store.$items,
})
