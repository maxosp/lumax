import { attach, createEffect, createEvent, Effect, restore, split, Store } from 'effector-root'
import Cookies from 'js-cookie'
import { config } from '@/config'
import { navigatePush } from '@/features/navigation'
import { request, RequestParams, Response } from '@/lib/request'

export const setTokenForRefresh = createEvent<string>()
export const setTokenForRequest = createEvent<string>()
export const $token = restore(setTokenForRequest, '')

setTokenForRequest.watch((token) => {
  if (token || token === '') {
    Cookies.set(config.TOKEN_KEY, token)
  } else {
    Cookies.get(config.TOKEN_KEY)
  }
})

export const requestFx = createEffect<RequestParams, Response, Response>({ handler: request })

export const authorizedRequestFx = attach<
  RequestParams,
  Store<string>,
  Effect<RequestParams, Response, Response>
>({
  effect: requestFx,
  source: $token,
  mapParams: (params, token) => {
    const auth = token ? { Authorization: `Bearer ${token}` } : null
    return { ...params, headers: { ...params.headers, ...auth } }
  },
})

split({
  source: authorizedRequestFx.failData,
  match: {
    unauthorized: ({ status }) => status === 401,
    forbidden: ({ status }) => status === 403,
  },
  cases: {
    unauthorized: navigatePush.prepend<Response>(() => ({ name: 'auth.login' })),
    forbidden: navigatePush.prepend<Response>(() => ({ name: 'home' })),
  },
})
