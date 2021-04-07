import { createEvent, createStore, forward } from 'effector-root'
import { FiltersParams } from '@/pages/common/types'

export const createFiltersModel = (defaultState = {}, dropdowns = {}) => {
  const resetFilters = createEvent<void>()
  const changeFilter = createEvent<FiltersParams>()
  const applyFilters = createEvent<void>()
  const dropdownsResetMethods = []

  for (const key in dropdowns) {
    if (dropdowns.hasOwnProperty(key)) {
      dropdownsResetMethods.push(dropdowns[key].methods.resetDropdown)
    }
  }

  const $filterParams = createStore<FiltersParams>(defaultState)
    .on(changeFilter, (state, params) => {
      return { ...state, ...params }
    })
    .reset(resetFilters)

  forward({
    from: resetFilters,
    to: dropdownsResetMethods,
  })

  return {
    store: {
      $filterParams,
    },
    methods: {
      resetFilters,
      changeFilter,
      applyFilters,
    },
  }
}
