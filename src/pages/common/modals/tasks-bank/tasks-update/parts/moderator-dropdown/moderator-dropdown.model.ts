import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { MODERATORS_DROPDOWN_VALUES } from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/constants'
import { ModeratorsDropdownType } from '@/pages/common/modals/tasks-bank/tasks-update/parts/moderator-dropdown/types'

export const moderatorChanged = createEvent<null | number>()
export const resetModerator = createEvent<void>()
export const $moderator = restore<null | number>(moderatorChanged, null).reset(resetModerator)
export const moderatorSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent<void>()
export const $moderatorSearchString = restore<string>(moderatorSearchStringChanged, '').reset(
  resetSearchString
)

export const $moderatorsDropdown = createStore<ModeratorsDropdownType[]>(MODERATORS_DROPDOWN_VALUES)
export const $_moderatorsDropdown = createStore<ModeratorsDropdownType[]>(
  MODERATORS_DROPDOWN_VALUES
)

const searchModerator = createEvent<string>()
const restoreModerators = createEvent<void>()

const debounced = debounce({
  source: $moderatorSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($moderator && str.length) moderatorChanged(null)
  if (str.length) searchModerator(str)
  else restoreModerators()
})

sample({
  source: $_moderatorsDropdown,
  clock: searchModerator,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $moderatorsDropdown,
})
sample({
  source: $_moderatorsDropdown,
  clock: restoreModerators,
  target: $moderatorsDropdown,
})
