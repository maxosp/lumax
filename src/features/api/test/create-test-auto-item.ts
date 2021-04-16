import { createApiEffect } from '@/features/api/common/create-api-effect'
import { AutoItem, CreateTestAutoItemFxParams } from './types'

export const createTestAutoItemFx = createApiEffect<CreateTestAutoItemFxParams, AutoItem>({
  requestMapper: (body) => ({
    method: 'POST',
    url: '/api/test/auto-item/',
    body,
  }),
})
