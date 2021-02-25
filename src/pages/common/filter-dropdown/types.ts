import { DropdownItem } from '@/pages/common/types'

export type FilterDropdownMethods = {
  setItems: () => void
  resetItem: () => void
  itemChanged: () => void
  searchStringChanged: () => void
  resetSearchString: () => void
}
export type FilterDropdownStore = {
  $item: string | null
  $itemsDropdown: DropdownItem[]
  $searchString: string
}
