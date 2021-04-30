import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetTypesResponse } from '@/features/api/ticket/types'

export const getElementTypeListFx = createApiEffect<void, GetTypesResponse[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/ticket-app/deletion-ticket/filter/types/',
  }),
})
