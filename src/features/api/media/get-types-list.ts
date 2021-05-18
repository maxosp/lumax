import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetTypesResponse } from '@/features/api/assignment/types/types'

export const getTypesListFx = createApiEffect<void, GetTypesResponse[]>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/media-app/study-resources-filter/types/',
  }),
})
