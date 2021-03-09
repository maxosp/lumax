import { createEvent, restore } from 'effector-root'

export const createError = () => {
  const setError = createEvent<boolean>()
  const resetError = createEvent<void>()
  const $error = restore(setError, false).reset(resetError)

  return {
    store: {
      $error,
    },
    methods: {
      setError,
      resetError,
    },
  }
}
