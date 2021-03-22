import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getUsersListFx } from '@/features/api/user/get-users-list'
import { GetUsersListQueryParams } from '@/features/api/user/types'

export const moderatorDropdownModule = createFilter()

export const setSelectedModerator = createEvent<DropdownItem | null>()
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
