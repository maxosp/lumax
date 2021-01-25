import { navigateReplace } from '@/features/navigation'
import { $isAuthed } from '@/features/session/index'
import { createEffect, createEvent } from 'effector'
import { condition } from 'patronum'
import { NavigationGuard } from 'vue-router/types/router'

type NextFn = () => void

const checkAuth = createEvent<NextFn>()
const checkGuest = createEvent<NextFn>()

const resolveNavigationFx = createEffect({
  handler: (next: NextFn) => next(),
})

condition({
  source: checkAuth,
  if: $isAuthed,
  then: resolveNavigationFx,
  else: navigateReplace.prepend(() => ({ name: 'auth.login' })),
})

condition({
  source: checkGuest,
  if: $isAuthed,
  then: navigateReplace.prepend(() => ({ name: 'user' })),
  else: resolveNavigationFx,
})

export const checkUserAuthedMiddleware: NavigationGuard = (to, from, next) => checkAuth(next)

export const checkUserGuestMiddleware: NavigationGuard = (to, from, next) => checkGuest(next)
