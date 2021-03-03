import { createEvent, createStore, forward, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { DropdownItem } from '@/pages/common/types'

export const createFilter = () => {
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

  forward({
    from: setItems,
    to: [$itemsDropdown, $_itemsDropdown],
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
    },
    methods: {
      setItems,
      resetItem,
      itemChanged,
      searchStringChanged,
      resetSearchString,
    },
  }
}
