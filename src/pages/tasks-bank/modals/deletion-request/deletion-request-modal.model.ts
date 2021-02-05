import { createEvent, restore } from 'effector-root'

export const deletionRequestModalVisibilityChanged = createEvent<boolean>()
export const $deletionRequestModalVisibility = restore(deletionRequestModalVisibilityChanged, false)

export const commentChanged = createEvent<string>()
export const $comment = restore(commentChanged, '').reset(deletionRequestModalVisibilityChanged)
