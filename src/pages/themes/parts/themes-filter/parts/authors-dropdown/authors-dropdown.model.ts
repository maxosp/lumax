import { createEvent, createStore, forward, attach } from 'effector-root'
import { getUsersListFx } from '@/features/api/user/get-users-list'
import { GetUsersListQueryParams } from '@/features/api/user/types'
import { DropdownItem } from '@/pages/common/types'

const getAuthors = attach({
  effect: getUsersListFx,
  mapParams: (params: GetUsersListQueryParams) => ({ ...params, is_student: false }),
})

export const loadAuthors = createEvent<void>()
export const $authors = createStore<DropdownItem[]>([])

forward({
  from: loadAuthors,
  to: getAuthors.prepend(() => ({})),
})

forward({
  from: getAuthors.doneData.map((res) =>
    res.body.data.map((user) => ({ name: `${user.id}`, title: user.email }))
  ),
  to: $authors,
})
