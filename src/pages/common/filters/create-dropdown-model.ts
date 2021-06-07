import { createEvent, createStore, forward, guard, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { DropdownItem } from '@/pages/common/types'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { ApiEffect } from '@/features/api/common/create-api-effect'

export function createDropdownModel<T>(
  loader: ApiEffect<GetListQueryParams, TableDataResponse<T[]>, any>
) {
  const setItems = createEvent<DropdownItem[]>()

  const resetItem = createEvent<void>()

  const itemChanged = createEvent<null | string>()
  const $item = restore<null | string>(itemChanged, null).reset(resetItem)

  const searchStringChanged = createEvent<string>()
  const resetSearchString = createEvent<void>()
  const $searchString = restore<string>(searchStringChanged, '').reset(resetSearchString)

  const $itemsDropdown = createStore<DropdownItem[]>([])
  const $_itemsDropdown = createStore<DropdownItem[]>([])

  const searchItem = createEvent<string>()
  const restoreItems = createEvent<void>()

  const resetDropdown = createEvent<void>()

  const dropdownDestroy = createEvent<void>()

  const nextPageTrigger = createEvent<void>()
  const $items = createStore<DropdownItem[]>([]).reset(dropdownDestroy)

  const resetPage = createEvent<void>()
  const $currentPage = createStore<number>(1)
    .on(loader.doneData, (_, res) => {
      return res.body.current_page
    })
    .reset(dropdownDestroy, resetPage)
  const $nextPage = createStore<number>(1).reset(dropdownDestroy, resetPage)
  const $lastPage = createStore<number>(1)
    .on(loader.doneData, (_, res) => {
      return res.body.last_page
    })
    .reset(dropdownDestroy, resetPage)

  sample({
    clock: nextPageTrigger,
    source: { $currentPage, $lastPage },
    fn: (source) => {
      if (source.$currentPage < source.$lastPage) {
        return source.$currentPage + 1
      }
      return 1
    },
    target: $nextPage,
  })

  const loaded = createEvent<boolean>()
  const $loading = restore<boolean>(loaded, false).reset(dropdownDestroy)

  const canLoadNextPage = guard({
    clock: nextPageTrigger,
    source: { $currentPage, $lastPage },
    filter: (source) => source.$currentPage < source.$lastPage,
  })

  forward({
    from: loader,
    to: loaded.prepend(() => true),
  })

  forward({
    from: loader.finally,
    to: loaded.prepend(() => false),
  })

  forward({
    from: setItems,
    to: [$itemsDropdown, $_itemsDropdown],
  })

  forward({
    from: resetDropdown,
    to: [resetItem, resetSearchString],
  })

  const debounced = debounce({
    source: $searchString,
    timeout: 150,
  })

  debounced.watch((str) => {
    if ($item && str.length) itemChanged(null)
    if (str.length) {
      restoreItems()
      searchItem(str)
    } else restoreItems()
  })

  function filterItems(str: string, list: any) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].title.toLowerCase().indexOf(str.toLocaleLowerCase()) === -1) {
        if (list[i].leaves) {
          if (!list[i].leaves.length) {
            list.splice(i, 1)
            i--
          } else {
            list[i].leaves = filterItems(str, list[i].leaves)
            if (!list[i].leaves.length) {
              list.splice(i, 1)
              i--
            }
          }
        } else {
          list.splice(i, 1)
          i--
        }
      }
    }
    return list
  }

  sample({
    source: $_itemsDropdown,
    clock: searchItem,
    fn: (list, str) => {
      const arr = JSON.parse(JSON.stringify(list))
      return filterItems(str, arr)
    },
    target: $itemsDropdown,
  })

  sample({
    source: $_itemsDropdown,
    clock: restoreItems,
    target: $itemsDropdown,
  })

  return {
    store: {
      $item,
      $itemsDropdown,
      $searchString,
      $items,
      $loading,
      $nextPage,
    },
    methods: {
      setItems,
      resetItem,
      itemChanged,
      searchStringChanged,
      resetSearchString,
      resetDropdown,
      nextPageTrigger,
      dropdownDestroy,
      canLoadNextPage,
    },
  }
}
