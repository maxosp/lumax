import { DropdownItem } from '@/pages/common/types'

export type FilterDropdownMethods = {
  setItems: Function
  resetItem: Function
  itemChanged: Function
  searchStringChanged: Function
  resetSearchString: Function
}
export type FilterDropdownStore = {
  $item: string | null
  $itemsDropdown: DropdownItem[]
  $searchString: string
}
