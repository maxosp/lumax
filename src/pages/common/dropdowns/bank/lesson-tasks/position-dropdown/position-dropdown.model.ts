import { createStore, attach, createEvent, forward, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { TreeData } from '@/features/api/types'
import { getLessonAssignmentTreeLightFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree-light'

export const foldersDropdownModule = createFilter()

const getFolders = attach({
  effect: getLessonAssignmentTreeLightFx,
})

export const clearFields = createEvent<void>()

export const loadFolders = createEvent<void>()
export const $folders = createStore<DropdownItem[]>([])

export const setSelectedFolder = createEvent<DropdownItem | null>()
export const $selectedFolder = restore(setSelectedFolder, null).reset(clearFields)

forward({
  from: loadFolders,
  to: getFolders.prepend(() => ({})),
})

function formatData(data: TreeData[]): any {
  return data.map((elem: any) => ({
    name: `${elem[elem.element_type].id}`,
    title: elem[elem.element_type].name,
    id: elem[elem.element_type].id,
    leaves: elem.leaves.length ? formatData(elem.leaves) : elem.leaves,
    ordering_string: elem.ordering_string,
  }))
}

forward({
  from: getLessonAssignmentTreeLightFx.doneData.map((data) => formatData(data.body.data)),
  to: $folders,
})
