import { errorToastEvent } from '@/features/toasts/toasts.model'
import { createEvent, restore, sample } from 'effector-root'
import { condition } from 'patronum'
import { $selectedThemes } from '../themes/themes.model'

export const isPrerequisiteChanged = createEvent<boolean>()
export const $isPrerequisite = restore(isPrerequisiteChanged, false)
export const toggleIsPrerequisite = createEvent<boolean>()

const $canToggleIsPrerequisite = sample({
  source: $selectedThemes,
  clock: toggleIsPrerequisite,
  fn: (list, isPrerequisite) => {
    return { listLength: list.length, value: isPrerequisite }
  },
})

condition({
  source: $canToggleIsPrerequisite,
  if: (payload: { listLength: number; value: boolean }) => payload.listLength > 0 && !payload.value,
  then: errorToastEvent('Удалите темы, к которым привязан пререквизит и повторите попытку'),
  else: isPrerequisiteChanged.prepend(
    (payload: { listLength: number; value: boolean }) => payload.value
  ),
})
