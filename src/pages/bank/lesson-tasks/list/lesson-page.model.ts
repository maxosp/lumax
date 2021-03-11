import { attach, createEvent, forward, restore } from 'effector-root'
import {
  deleteAssignmentFx,
  deleteAssignmentsFx,
} from '@/features/api/assignment/delete-assignment'
import {
  getAssignmentTreeFx,
  getAssignmentTreeLightFx,
} from '@/features/api/assignment/tree-assignment'
import { addToast } from '@/features/toasts/toasts.model'
import { TreeData, TreeDataLight } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'

const getLessonsTree = attach({
  effect: getAssignmentTreeFx,
  mapParams: (params: GetAssignmentTreeQueryParams) => ({
    ...params,
    is_lesson_assignment: true,
  }),
})
const getLessonsTreeLight = attach({
  effect: getAssignmentTreeLightFx,
  mapParams: (params: GetAssignmentTreeQueryParams) => ({
    ...params,
    is_lesson_assignment: true,
  }),
})

export const deleteAssignment = attach({
  effect: deleteAssignmentFx,
})
export const deleteManyAssignments = attach({
  effect: deleteAssignmentsFx,
})

export const toggleTreeView = createEvent<boolean>()
export const $treeView = restore(toggleTreeView, false)

export const loadTree = createEvent<GetAssignmentTreeQueryParams>()
export const loadTreeLight = createEvent<GetAssignmentTreeQueryParams>()
export const setLessonsTree = createEvent<TreeDataLight | TreeData | null>()
export const $lessonsTree = restore<TreeDataLight | TreeData | null>(setLessonsTree, null)
export const setLessonsTreeTotal = createEvent<number>()
export const $lessonsTreeTotal = restore<number>(setLessonsTreeTotal, 0)

forward({
  from: loadTreeLight,
  to: getLessonsTreeLight,
})

forward({
  from: loadTree,
  to: getLessonsTree,
})
forward({
  from: getLessonsTreeLight.doneData,
  to: [
    setLessonsTree.prepend((res) => res.body.data),
    setLessonsTreeTotal.prepend((res) => res.body.total),
  ],
})
forward({
  from: getLessonsTree.doneData,
  to: [
    setLessonsTree.prepend((res) => res.body.data),
    setLessonsTreeTotal.prepend((res) => res.body.total),
  ],
})

forward({
  from: deleteAssignment.doneData,
  to: [
    loadTree.prepend(() => ({})),
    addToast.prepend(() => ({ type: 'success', message: 'Задание была успешно удалено!' })),
  ],
})
