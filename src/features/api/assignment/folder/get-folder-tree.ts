import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetFolderTreeListResponse } from '@/features/api/types'

export const getFolderTreeFx = createApiEffect<
  void,
  { total: number; data: GetFolderTreeListResponse[] }
>({
  requestMapper: () => ({
    method: 'GET',
    url: '/api/assignment/folder/tree/',
  }),
})
