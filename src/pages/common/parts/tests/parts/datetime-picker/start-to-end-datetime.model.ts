import { createStore } from 'effector'

export type Datetime = {
  start: number | null
  end: number | null
}

export const $datetime = createStore<Datetime>({
  start: null,
  end: null,
})
