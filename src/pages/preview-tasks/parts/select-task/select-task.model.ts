import { Navigate } from '@/features/navigation'
import {
  loadCurrentLabelsIDs,
  resetLabels,
} from '@/pages/bank/test-tasks/edit/parts/labels-dropdown/labels-dropdown.model'
import { createEvent, restore, sample } from 'effector'

export const prev = createEvent<Navigate>()
export const next = createEvent<Navigate>()

export const setQuestionsAmount = createEvent<number>()
export const $questionAmount = restore(setQuestionsAmount, 1)

export const setCurrentIndex = createEvent<number>()
export const $currentIndex = restore(setCurrentIndex, 0)

export const setCurrentQuestion = createEvent<number>()
export const $currentQuestion = restore(setCurrentQuestion, 1)

sample({
  source: [$currentIndex, $questionAmount],
  clock: prev,
  fn: ([currentIndex, questionAmount], route: Navigate) => {
    const tasksIds = route.query!.questions.split(',')
    resetLabels()
    if (currentIndex === 0) {
      loadCurrentLabelsIDs(+tasksIds[questionAmount - 1])
      return questionAmount - 1
    }
    loadCurrentLabelsIDs(+tasksIds[currentIndex - 1])
    return --currentIndex
  },
  target: setCurrentIndex,
})

sample({
  source: [$currentIndex, $questionAmount],
  clock: next,
  fn: ([currentIndex, questionAmount], route: Navigate) => {
    const tasksIds = route.query!.questions.split(',')
    resetLabels()

    if (currentIndex === questionAmount - 1) {
      loadCurrentLabelsIDs(+tasksIds[0])
      return 0
    }

    loadCurrentLabelsIDs(+tasksIds[currentIndex + 1])
    return ++currentIndex
  },
  target: setCurrentIndex,
})

sample({
  clock: setCurrentIndex,
  source: $currentIndex,
  fn: (currentIndex: number) => {
    return currentIndex + 1
  },
  target: $currentQuestion,
})

sample({
  clock: setCurrentQuestion,
  source: $currentQuestion,
  fn: (currentQuestion: number) => {
    return currentQuestion - 1
  },
  target: $currentIndex,
})
