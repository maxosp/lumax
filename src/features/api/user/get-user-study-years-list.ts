import { createApiEffect } from '@/features/api/common/create-api-effect'
import { GetListQueryParams, TableDataResponse } from '@/features/api/types'
import { StudyYear } from '@/features/api/subject/types'

export const getUserStudyYearsListFx = createApiEffect<
  GetListQueryParams,
  TableDataResponse<StudyYear[]>
>({
  requestMapper: (query) => ({
    method: 'GET',
    url: '/api/user/study-year/list/',
    query,
  }),
})
