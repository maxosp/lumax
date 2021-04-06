import { attach, createEvent, forward, restore } from 'effector-root'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { getOlympiadAssignmentFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-assignment'
import { getLessonAssignmentFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment'
import {
  TestAssignment,
  OlympiadAssignment,
  LessonAssignment,
} from '@/features/api/assignment/types'

export const loadTestAssignment = attach({
  effect: getTestAssignmentFx,
})
export const loadOlympiadAssignment = attach({
  effect: getOlympiadAssignmentFx,
})
export const loadLessonAssignment = attach({
  effect: getLessonAssignmentFx,
})

export const loadTestTask = createEvent<number>()
export const loadOlympiadTask = createEvent<number>()
export const loadLessonTask = createEvent<number>()

export const changeStatusTask = createEvent<string>()
export const $statusTask = restore(changeStatusTask, 'new')

export const changeActiveTask = createEvent<
  TestAssignment | OlympiadAssignment | LessonAssignment | null
>()
export const $activeTask = restore(changeActiveTask, null)

forward({
  from: loadTestTask,
  to: loadTestAssignment,
})
forward({
  from: loadTestAssignment.doneData,
  to: [
    changeStatusTask.prepend(({ body }) => body.status),
    changeActiveTask.prepend(({ body }) => body),
  ],
})
forward({
  from: loadOlympiadTask,
  to: loadOlympiadAssignment,
})
forward({
  from: loadOlympiadAssignment.doneData,
  to: [
    changeStatusTask.prepend(({ body }) => body.status),
    changeActiveTask.prepend(({ body }) => body),
  ],
})
forward({
  from: loadLessonTask,
  to: loadLessonAssignment,
})
forward({
  from: loadLessonAssignment.doneData,
  to: [
    changeStatusTask.prepend(({ body }) => body.status),
    changeActiveTask.prepend(({ body }) => body),
  ],
})
