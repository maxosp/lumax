import { createApiEffect } from '@/features/api/common/create-api-effect'

export const downloadMediaFileFx = createApiEffect<number>({
  requestMapper: (id) => ({
    method: 'GET',
    url: `/api/media-app/media/${id}/file/`,
  }),
})
