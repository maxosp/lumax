import { attach, createEvent, createStore, forward } from 'effector-root'
import { getColorsListFx } from '@/features/api/subject/get-subject-colors'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'

export const colorDropdownModule = createFilter()

const getColors = attach({
  effect: getColorsListFx,
})

export const loadColors = createEvent<void>()
export const $colors = createStore<DropdownItem[]>([])

forward({
  from: loadColors,
  to: getColors.prepend(() => ({})),
})

forward({
  from: getColors.doneData.map((res) =>
    res.body.data.map((color) => ({
      name: `${color.id}`,
      title: color.name,
      value: color.value,
    }))
  ),
  to: $colors,
})
