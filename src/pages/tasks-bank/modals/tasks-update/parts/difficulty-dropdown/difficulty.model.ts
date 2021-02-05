import { createEvent, createStore, restore, sample } from 'effector-root'
import { DIFFICULTY_DROPDOWN } from '@/pages/tasks-bank/modals/tasks-update/parts/difficulty-dropdown/constants'

export const modalLoaded = createEvent<void>()

export const $difficultysDropdown = createStore<string[]>(DIFFICULTY_DROPDOWN)

export const difficultyChanged = createEvent<string>()
export const resetDifficulty = createEvent<void>()
export const $difficulty = restore<string>(difficultyChanged, '').reset(resetDifficulty)

sample({
  source: $difficultysDropdown,
  clock: modalLoaded,
  fn: (list) => list[0],
  target: $difficulty,
})
