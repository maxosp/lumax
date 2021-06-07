import { authorizedRequestFx } from '@/features/api/common/request'
import { RequestParams, Response } from '@/lib/request'
import { attach, Effect } from 'effector-root'

// eslint-disable-next-line
type Options<PARAMS, DONE, FAIL> = {
  requestMapper: (params: PARAMS) => RequestParams
}

export type ApiEffect<PARAMS, DONE, FAIL> = Effect<PARAMS, Response<DONE>, Response<FAIL>>

export const createApiEffect = <PARAMS = void, DONE = void, FAIL = void>(
  options: Options<PARAMS, DONE, FAIL>
): ApiEffect<PARAMS, DONE, FAIL> =>
  attach<PARAMS, ApiEffect<RequestParams, DONE, FAIL>>({
    effect: authorizedRequestFx,
    mapParams: options.requestMapper,
  })
