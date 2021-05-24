import {
  createStore,
  createEvent,
  restore,
  guard,
  forward,
  createEffect,
  attach,
} from 'effector-root'
import { errorToastEvent } from '@/features/toasts/toasts.model'

export const destroyModal = createEvent<void>()

export const loadDuplicateModal = createEvent<number[]>()
export const $selectedTasks = restore(loadDuplicateModal, []).reset(destroyModal)

export const changedDuplicateModalVisibility = createEvent<boolean>()
export const $duplicateModalVisibility = restore(changedDuplicateModalVisibility, false)

export const passedValidation = createEvent<boolean>()
export const $isDataValid = restore<boolean>(passedValidation, true).reset(destroyModal)

export const changedNDuplicate = createEvent<string>()
export const $nDuplicate = createStore<number>(1)
  .on(changedNDuplicate, (_, value) => {
    return +value
  })
  .reset(destroyModal)

export const validation = createEffect((n: number) => {
  if (n < 1) throw new Error('Число дубликатов не может быть меньше одного')
  return null
})

forward({
  from: loadDuplicateModal,
  to: changedDuplicateModalVisibility.prepend(() => true),
})

guard({
  source: $duplicateModalVisibility,
  filter: (visibility) => !visibility,
  target: destroyModal,
})

forward({
  from: changedNDuplicate,
  to: passedValidation.prepend(() => true),
})

export const validate = attach({
  effect: validation,
  source: $nDuplicate,
  mapParams: (_, value) => value,
})

forward({
  from: validation.fail,
  to: [
    errorToastEvent('Число дубликатов не может быть меньше одного'),
    passedValidation.prepend(() => false),
  ],
})
