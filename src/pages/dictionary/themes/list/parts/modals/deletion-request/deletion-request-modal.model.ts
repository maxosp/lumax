import { createEvent, forward, restore } from 'effector-root'

export const deletionRequestModalVisibilityChanged = createEvent<boolean>()
export const $deletionRequestModalVisibility = restore(deletionRequestModalVisibilityChanged, false)

export const commentChanged = createEvent<string>()
export const $comment = restore(commentChanged, '').reset(deletionRequestModalVisibilityChanged)

export const loadModalToRequestDeletion = createEvent<number[]>()
export const $selectedIds = restore(loadModalToRequestDeletion, [])

forward({
  from: loadModalToRequestDeletion,
  to: deletionRequestModalVisibilityChanged.prepend(() => true),
})
