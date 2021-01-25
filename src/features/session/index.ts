import { createEvent, createStore, forward } from 'effector-root'
// import { attach, combine, createEvent, forward, restore } from 'effector-root'
import { navigatePush } from '@/features/navigation'
import { setTokenForRequest } from '@/features/api/common/request'
// import { getSelfUserFx } from '@/features/api/users/get-self-user'
// import { GetUserFxResponse } from '@/features/api/users/types'

export const logout = createEvent()

export const loadSession = createEvent()

// export const loadSessionFx = attach({
//   effect: getSelfUserFx,
//   mapParams: (params) => params,
// })

// export const setSession = createEvent<null | GetUserFxResponse>()
// export const $session = restore<null | GetUserFxResponse>(setSession, null).reset(logout)

export const $isAuthed = createStore(false)
// export const $isAuthed = combine(
//   $session,
//   getSelfUserFx.pending,
//   (session, pending) => pending || (!!session && !pending)
// )

// forward({
//   from: loadSession,
//   to: getSelfUserFx,
// })

// forward({
//   from: getSelfUserFx.doneData.map((data) => data.body),
//   to: setSession,
// })

forward({
  from: logout,
  to: [setTokenForRequest.prepend(() => ''), navigatePush.prepend(() => ({ name: 'auth.login' }))],
})
