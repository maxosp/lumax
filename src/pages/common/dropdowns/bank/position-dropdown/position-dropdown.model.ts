import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getFolderTreeFx } from '@/features/api/assignment/folder/get-folder-tree'
import { GetFolderTreeListResponse } from '@/features/api/types'

export const foldersDropdownModule = createFilter()

const getFolders = attach({
  effect: getFolderTreeFx,
})

export const loadFolders = createEvent<void>()
export const $folders = createStore<DropdownItem[]>([])

export const setSelectedFolder = createEvent<DropdownItem | null>()
export const $selectedFolder = restore(setSelectedFolder, null)

forward({
  from: loadFolders,
  to: getFolders.prepend(() => ({})),
})

function formatData(data: GetFolderTreeListResponse[]): any {
  return data.map((elem: any) => ({
    name: `${elem[elem.element_type].id}`,
    title: elem[elem.element_type].name,
    id: elem[elem.element_type].id,
    leaves: elem.leaves.length ? formatData(elem.leaves) : elem.leaves,
    ordering_number: elem.ordering_number,
  }))
}

forward({
  from: getFolderTreeFx.doneData.map((res) => formatData(res.body.data)),
  to: $folders,
})
