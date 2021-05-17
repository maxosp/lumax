import { attach, createEvent, forward } from 'effector-root'
import { getTestAssignmentFx } from '@/features/api/assignment/test-assignment/get-test-assignment'
import { getOlympiadAssignmentFx } from '@/features/api/assignment/olympiad-assignment/get-olympiad-assignment'
import { getLessonAssignmentFx } from '@/features/api/assignment/lesson-assignment/get-lesson-assignment'
import {
  setApplicationStatus,
  setStatus,
} from '@/pages/common/parts/status-controller/status.model'
import { getTicketFx } from '@/features/api/ticket/moderation/get-ticket'

export const loadTestAssignment = attach({
  effect: getTestAssignmentFx,
})
export const loadOlympiadAssignment = attach({
  effect: getOlympiadAssignmentFx,
})
export const loadLessonAssignment = attach({
  effect: getLessonAssignmentFx,
})

export const getIncomingApplication = attach({
  effect: getTicketFx,
})

export const loadTestTask = createEvent<number>()
export const loadOlympiadTask = createEvent<number>()
export const loadLessonTask = createEvent<number>()
export const loadApplication = createEvent<number>()

forward({
  from: loadTestTask,
  to: loadTestAssignment,
})
forward({
  from: loadTestAssignment.doneData,
  to: [setStatus.prepend(({ body }) => body.status)],
})

forward({
  from: loadOlympiadTask,
  to: loadOlympiadAssignment,
})
forward({
  from: loadOlympiadAssignment.doneData,
  to: [setStatus.prepend(({ body }) => body.status)],
})
forward({
  from: loadLessonTask,
  to: loadLessonAssignment,
})
forward({
  from: loadLessonAssignment.doneData,
  to: [setStatus.prepend(({ body }) => body.status)],
})
forward({
  from: loadApplication,
  to: getIncomingApplication,
})
forward({
  from: getIncomingApplication.doneData,
  to: [setApplicationStatus.prepend(({ body }) => body.status)],
})
