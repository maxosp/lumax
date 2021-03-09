import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { DropdownItem, SelectedObjectType } from '@/pages/common/types'
import { GetUsersListQueryParams } from '@/features/api/user/types'
import { getUsersListFx } from '@/features/api/user/get-users-list'

export const moderatorDropdownModule = createFilter()

export const setSelectedModerator = createEvent<DropdownItem | SelectedObjectType | null>()
export const $selectedModerator = restore(setSelectedModerator, null)

const getModerators = attach({
  effect: getUsersListFx,
  mapParams: (params: GetUsersListQueryParams) => ({ ...params, is_moderator: true }),
})

export const loadModerators = createEvent<void>()
export const $moderators = createStore<DropdownItem[]>([])

forward({
  from: loadModerators,
  to: getModerators.prepend(() => ({})),
})

forward({
  from: getModerators.doneData.map((res) =>
    res.body.data.map((user) => ({
      name: `${user.id}`,
      title: `${user.first_name} ${user.last_name}`,
    }))
  ),
  to: $moderators,
})
