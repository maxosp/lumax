import { createEvent, createStore, sample } from 'effector-root'
import { SWITCHERS_OPTIONS } from '@/pages/bank//test-tasks/list/parts/modals/tasks-update/parts/switchers/constants'
import { SwitchersOptionsType } from '@/pages/bank//test-tasks/list/parts/modals/tasks-update/parts/switchers/types'

export const resetSwitchers = createEvent<void>()

export const $switchers = createStore<SwitchersOptionsType>(SWITCHERS_OPTIONS).reset(resetSwitchers)

export const toggleSwitchers = createEvent<{ name: string; value: boolean }>()

sample({
  source: $switchers,
  clock: toggleSwitchers,
  fn: (form, data: { name: string; value: boolean }) => {
    const newForm = { ...form }
    for (const key in newForm) {
      if (key === data.name && data.value) newForm[key] = true
      else if (key !== data.name && data.value) newForm[key] = false
      else newForm[key] = false
    }
    return newForm
  },
  target: $switchers,
})
