import { createEvent, createStore, forward, attach, restore } from 'effector-root'
import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { DropdownItem } from '@/pages/common/types'
import { getUsersListFx } from '@/features/api/user/get-users-list'
import { GetUsersListQueryParams } from '@/features/api/user/types'

export const creatorDropdownModule = createFilter()

export const setSelectedCreator = createEvent<DropdownItem | null>()
export const $selectedCreator = restore(setSelectedCreator, null)

const getCreators = attach({
  effect: getUsersListFx,
  mapParams: (params: GetUsersListQueryParams) => ({ ...params, is_student: false }),
})

export const loadCreators = createEvent<void>()
export const $creators = createStore<DropdownItem[]>([])

forward({
  from: loadCreators,
  to: getCreators.prepend(() => ({})),
})

forward({
  from: getCreators.doneData.map((res) =>
    res.body.data.map((user) => ({
      name: `${user.id}`,
      title: `${user.first_name} ${user.last_name}`,
    }))
  ),
  to: $creators,
})
