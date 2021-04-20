import { Datetime } from '@/features/api/test/types'
import { createStore } from 'effector'

export const $datetime = createStore<Datetime>({
  start: null,
  end: null,
})
