import { getLabelFx } from '@/features/api/assignment/get-label'
import { attach, createEvent, forward, restore } from 'effector-root'
import { spread } from 'patronum'

export const getLabel = attach({
  effect: getLabelFx,
})

export const loadModal = createEvent<number>()

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore<boolean>(modalVisibilityChanged, false)

const setLabelsList = createEvent<number[]>()
export const $labelsList = restore<number[]>(setLabelsList, [])
const labelTitleChanged = createEvent<string>()
export const $labelTitle = restore<string>(labelTitleChanged, '')

forward({
  from: loadModal,
  to: [getLabel, modalVisibilityChanged.prepend(() => true)],
})

spread({
  source: getLabelFx.doneData.map((data) => data.body),
  targets: {
    name: labelTitleChanged,
    assignments_ids: setLabelsList,
  },
})
