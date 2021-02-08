import { createApiEffect } from '@/features/api/common/create-api-effect'
import { TableDataResponse } from '@/features/api/types'
import { GetUsersListQueryParams, User } from '@/features/api/user/types'

export const getUsersListFx = createApiEffect<GetUsersListQueryParams, TableDataResponse<User[]>>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/user/list/',
    query,
  }),
})
