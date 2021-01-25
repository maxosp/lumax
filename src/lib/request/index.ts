import { config } from '@/config'
import { createQueryString } from '@/lib/query'

export type RequestParams = {
  url: string
  method: string
  body?: BodyInit | object
  query?: Record<string, any>
  headers?: Record<string, string>
}

export type Response<T = any> = {
  body: T
  headers: Headers
  status: number
  ok: boolean
}

export const request = async (params: RequestParams) => {
  const headers = new Headers(params.headers)

  if (!headers.has('content-type')) headers.set('content-type', 'application/json; charset=utf-8')
  if (params.body instanceof FormData) headers.delete('content-type')

  const query = createQueryString(params.query)
  const body = headers.get('content-type')?.includes('application/json')
    ? JSON.stringify(params.body)
    : (params.body as BodyInit | undefined)

  const response = await fetch(`${config.BACKEND_URL}${params.url}${query}`, {
    method: params.method,
    body: body ?? null,
    headers,
    credentials: 'same-origin',
  })

  const isResponseJson = response.headers.get('content-type')?.includes('application/json')

  const answer = {
    body: await (isResponseJson ? response.json() : response.blob()),
    status: response.status,
    ok: response.ok,
    headers: response.headers,
  }

  if (response.ok) return answer
  throw answer
}
