import { attach, createEvent, forward, restore } from 'effector-root'
import { spread } from 'patronum'
import { getTagFx } from '@/features/api/assignment/olympiad-tags/get-tag'

export const getTag = attach({
  effect: getTagFx,
})

export const loadModal = createEvent<number>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore<boolean>(modalVisibilityChanged, false)

const setTagsList = createEvent<number[]>()
export const $tagsList = restore<number[]>(setTagsList, [])
const tagTitleChanged = createEvent<string>()
export const $tagTitle = restore<string>(tagTitleChanged, '')

forward({
  from: loadModal,
  to: [getTag, modalVisibilityChanged.prepend(() => true)],
})

spread({
  source: getTagFx.doneData.map((data) => data.body),
  targets: {
    name: tagTitleChanged,
    assignments_ids: setTagsList,
  },
})
