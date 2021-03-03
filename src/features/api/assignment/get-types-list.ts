import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetTypesResponse } from '@/features/api/assignment/types'

export const getTypesListFx = createApiEffect<void, GetTypesResponse[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment/assignments-filter/types/',
  }),
})
