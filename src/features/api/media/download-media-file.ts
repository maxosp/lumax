import { createApiEffect } from '@/features/api/common/create-api-effect'

export const downloadMediaFileFx = createApiEffect<number, any>({
  requestMapper: () => ({
    method: 'GET',
    url: `/api/media-app/media/1225/file/`,
    // url: `/api/media-app/media/${id}/file/`,
  }),
})
