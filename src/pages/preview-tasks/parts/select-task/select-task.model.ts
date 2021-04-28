import { createEvent, restore, sample } from 'effector'

export const prev = createEvent<void>()
export const next = createEvent<void>()

export const setQuestionsAmount = createEvent<number>()
export const $questionAmount = restore(setQuestionsAmount, 1)

export const setCurrentIndex = createEvent<number>()
export const $currentIndex = restore(setCurrentIndex, 0)

export const setCurrentQuestion = createEvent<number>()
export const $currentQuestion = restore(setCurrentQuestion, 1)

sample({
  clock: prev,
  source: { $currentIndex, $questionAmount },
  fn: (stores) => {
    if (stores.$currentIndex === 0) return stores.$questionAmount - 1
    return --stores.$currentIndex
  },
  target: setCurrentIndex,
})

sample({
  clock: next,
  source: { $currentIndex, $questionAmount },
  fn: (stores) => {
    if (stores.$currentIndex === stores.$questionAmount - 1) return 0
    return ++stores.$currentIndex
  },
  target: setCurrentIndex,
})

sample({
  clock: setCurrentIndex,
  source: $currentIndex,
  fn: (currentIndex) => {
    return currentIndex + 1
  },
  target: $currentQuestion,
})

sample({
  clock: setCurrentQuestion,
  source: $currentQuestion,
  fn: (currentQuestion) => {
    return currentQuestion - 1
  },
  target: $currentIndex,
})
