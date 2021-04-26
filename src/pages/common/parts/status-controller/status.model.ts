import { combine, createEvent, restore } from 'effector-root'
import { condition } from 'patronum'

export const setStatus = createEvent<string>()
export const $status = restore(setStatus, '')

export const setApplicationStatus = createEvent<string>()
export const $applicationStatus = restore(setApplicationStatus, '')

export const setIsArchive = createEvent<boolean>()
export const $isArchive = restore(setIsArchive, false)

export const setIsPublished = createEvent<boolean>()
export const $isPublished = restore(setIsPublished, false)

condition({
  source: setIsArchive,
  if: (payload: boolean) => payload,
  then: setIsPublished.prepend((data) => !data),
})

condition({
  source: setIsPublished,
  if: (payload: boolean) => payload,
  then: setIsArchive.prepend((data) => !data),
})

export const $correctStatus = combine(
  $status,
  $isArchive,
  $isPublished,
  (status, isArchive, isPublished) => {
    let res = status
    if (isArchive) res = 'archive'
    if (isPublished) res = 'published'
    return res
  }
)
