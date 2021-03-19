import { attach, createEvent, forward, restore } from 'effector-root'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { TreeData, TreeDataLight } from '@/features/api/types'
import { GetAssignmentTreeQueryParams } from '@/features/api/assignment/types'
import { getLessonAssignmentTreeFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree'
import { getLessonAssignmentTreeLightFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment-tree-light'
import {
  deleteLessonAssignmentFx,
  deleteLessonAssignmentsFx,
} from '@/features/api/assignment/lesson-assignment/delete-lesson-assignment'

const getLessonsTree = attach({
  effect: getLessonAssignmentTreeFx,
})
const getLessonsTreeLight = attach({
  effect: getLessonAssignmentTreeLightFx,
})

export const deleteAssignment = attach({
  effect: deleteLessonAssignmentFx,
})
export const deleteManyAssignments = attach({
  effect: deleteLessonAssignmentsFx,
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
  to: [loadTree.prepend(() => ({})), successToastEvent('Задание было успешно удалено!')],
})
