import { createEvent, restore, sample } from 'effector'

export const selectTaskDestroy = createEvent<void>()

export const prev = createEvent<void>()
export const next = createEvent<void>()

export const setQuestionsAmount = createEvent<number>()
export const $questionAmount = restore(setQuestionsAmount, 1).reset(selectTaskDestroy)

export const setCurrentIndex = createEvent<number>()
export const $currentIndex = restore(setCurrentIndex, 0).reset(selectTaskDestroy)

export const setCurrentQuestion = createEvent<number>()
export const $currentQuestion = restore(setCurrentQuestion, 1).reset(selectTaskDestroy)

sample({
  source: [$currentIndex, $questionAmount],
  clock: prev,
  fn: ([currentIndex, questionAmount]) => {
    if (currentIndex === 0) {
      return questionAmount - 1
    }
    return --currentIndex
  },
  target: setCurrentIndex,
})

sample({
  source: [$currentIndex, $questionAmount],
  clock: next,
  fn: ([currentIndex, questionAmount]) => {
    if (currentIndex === questionAmount - 1) {
      return 0
    }
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
