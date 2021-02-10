import { attach, combine, createEvent, forward, restore } from 'effector-root'
import { navigatePush } from '@/features/navigation'
import { setTokenForRequest } from '@/features/api/common/request'
import { getSelfUserFx } from '@/features/api/user/get-self-user'
import { User } from '@/features/api/user/types'
import { modalLogoutVisibilityChanged } from '@/pages/common/modal-logout/modal-logout.model'

export const logout = createEvent()

export const loadSession = createEvent()

export const loadSessionFx = attach({
  effect: getSelfUserFx,
  mapParams: (params) => params,
})

export const setSession = createEvent<null | User>()
export const $session = restore<null | User>(setSession, null).reset(logout)

export const $isAuthed = combine(
  $session,
  getSelfUserFx.pending,
  (session, pending) => pending || (!!session && !pending)
)

forward({
  from: loadSession,
  to: getSelfUserFx,
})

forward({
  from: getSelfUserFx.doneData.map((data) => data.body),
  to: setSession,
})

forward({
  from: logout,
  to: [
    modalLogoutVisibilityChanged.prepend(() => false),
    setTokenForRequest.prepend(() => ''),
    navigatePush.prepend(() => ({ name: 'auth.login' })),
  ],
})
