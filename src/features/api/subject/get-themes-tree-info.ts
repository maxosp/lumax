import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TreeDataInfoResponse } from '@/features/api/types'

export const getThemesInfoFx = createApiEffect<void, TreeDataInfoResponse>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/subject-app/themes/tree/info/',
  }),
})
