import { updateTicketBulkFx } from '@/features/api/ticket/moderation/update-ticket-bulk'
import { UpdateTicketBulkType } from '@/features/api/ticket/types'
import { getUsersListFx } from '@/features/api/user/get-users-list'
import { GetUsersListQueryParams, User } from '@/features/api/user/types'
import { successToastEvent } from '@/features/toasts/toasts.model'
import { DropdownItem } from '@/pages/common/types'
import {
  attach,
  combine,
  createEvent,
  createStore,
  forward,
  guard,
  restore,
  sample,
} from 'effector-root'
import { debounce, every, spread } from 'patronum'

const getModeratorsFx = attach({
  effect: getUsersListFx,
  mapParams: (params: GetUsersListQueryParams) => ({ ...params, is_moderator: true }),
})

const setToModerator = attach({
  effect: updateTicketBulkFx,
  mapParams: (params: UpdateTicketBulkType) => ({
    ...params,
    accept: null,
    send_to_revision: null,
    comment_id: null,
    set_moderator: true,
    cancel_outcome: null,
  }),
})

export const submit = createEvent<number>()
const clearFields = createEvent<void>()

export const loadModeratorModal = createEvent<number[]>()
export const $selectedIds = restore(loadModeratorModal, []).reset(clearFields)

const setModerators = createEvent<User[]>()
export const $moderators = createStore<DropdownItem[]>([])

export const modalVisibilityChanged = createEvent<boolean>()
export const $modalVisibility = restore<boolean>(modalVisibilityChanged, false)

export const selectedPageChanged = createEvent<number>()
export const $selectedPage = restore<number>(selectedPageChanged, 1)

export const nextPageChanged = createEvent<string | null>()
export const prevPageChanged = createEvent<string | null>()
export const $nextPage = restore<string | null>(nextPageChanged, null)
export const $prevPage = restore<string | null>(prevPageChanged, null)
export const countChanged = createEvent<number | null>()
export const $count = restore<number | null>(countChanged, null)

export const searchStringChanged = createEvent<string>()
export const $searchString = restore(searchStringChanged, '').reset(clearFields)

forward({
  from: loadModeratorModal,
  to: [modalVisibilityChanged.prepend(() => true), getModeratorsFx.prepend(() => ({}))],
})

spread({
  source: getModeratorsFx.doneData.map((res) => res.body),
  targets: {
    data: setModerators,
    next: nextPageChanged,
    previous: prevPageChanged,
    count: countChanged,
  },
})

forward({
  from: setModerators.map((res) =>
    res.map((user) => ({
      name: `${user.id}`,
      title: `${user.first_name} ${user.last_name}`,
    }))
  ),
  to: $moderators,
})

const $sortOptions = combine({
  sort: $searchString.map((data) => data),
  page: $selectedPage,
})

const debounced = debounce({
  source: searchStringChanged,
  timeout: 450,
})

const $canSetToModerator = every({
  stores: [$moderators],
  predicate: (value) => value.length > 0,
})

sample({
  clock: [selectedPageChanged, debounced],
  source: $sortOptions,
  target: getModeratorsFx,
})

sample({
  clock: guard({ source: submit, filter: $canSetToModerator }),
  source: $selectedIds,
  fn: (tickets, moderator_id) => ({ tickets, moderator_id }),
  target: setToModerator,
})

forward({
  from: setToModerator.doneData,
  to: [
    successToastEvent('Заявка назначена'),
    modalVisibilityChanged.prepend(() => false),
    clearFields,
  ],
})
