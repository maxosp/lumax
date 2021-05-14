import { createEvent, createStore, forward, restore, sample } from 'effector-root'
import { createFiltersModel } from '@/pages/common/filters/create-filters-model'
import { loadFilteredTree, loadTreeLight } from '@/pages/dictionary/files/system-files-page.model'
import { SystemFilesCheckboxes } from '@/pages/dictionary/files/parts/filter/types'

export const filesFilters = createFiltersModel({
  search_area: 'search_all',
})

export const reset = createEvent<void>()

export const updateCheckboxes = createEvent<SystemFilesCheckboxes>()
export const $checkboxes = createStore<SystemFilesCheckboxes>({
  doc: false,
  zip: false,
  img: false,
  audio: false,
  video: false,
  file: false,
})
  .on(updateCheckboxes, (state, params) => {
    return { ...state, ...params }
  })
  .reset(reset)

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

forward({
  from: filesFilters.methods.resetFilters,
  to: loadTreeLight.prepend(() => ({})),
})

sample({
  clock: filesFilters.methods.applyFilters,
  source: filesFilters.store.$filterParams,
  target: loadFilteredTree,
})

forward({
  from: filesFilters.methods.resetFilters,
  to: reset,
})
