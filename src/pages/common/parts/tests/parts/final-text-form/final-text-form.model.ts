import { errorToastEvent } from '@/features/toasts/toasts.model'
import { createEvent, restore, sample } from 'effector'
import { FinalTextRelated } from '@/features/api/test/types'

export const clearFields = createEvent<void>()

export const setInput = createEvent<FinalTextRelated[]>()
export const $finalTextDropdowns = restore(setInput, [
  {
    id: 0,
    score_min: null,
    score_max: null,
    text: '',
  },
]).reset(clearFields)

export const checkFinalTextFormValid = createEvent<void>()

export const toggleFinalTextFormValid = createEvent<boolean>()
export const $finalTextFormValid = restore(toggleFinalTextFormValid, false)

sample({
  source: $finalTextDropdowns,
  clock: checkFinalTextFormValid,
  fn: (form) => {
    let valid = true
    let fullRange = 0
    form.forEach((range) => {
      if (range.score_min === null || range.score_max === null || !range.text) {
        errorToastEvent('Добавьте итоговый текст')
        valid = false
        return
      }
      if (range.score_min! >= range.score_max!) {
        errorToastEvent('Диапазон для итогового текста задан неверно')
        valid = false
        return
      }
      fullRange += range.score_max! - range.score_min!
    })
    if (fullRange > 100 && valid) {
      errorToastEvent('Диапазон для итогового текста задан неверно')
      valid = false
    }
    if (fullRange < 100 && valid) {
      errorToastEvent('Итоговый текст указан не для всех возможных результатов')
      valid = false
    }

    toggleFinalTextFormValid(valid)
  },
})
