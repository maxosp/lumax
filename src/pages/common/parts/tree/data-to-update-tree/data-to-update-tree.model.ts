import { FiltersParams } from '@/pages/common/types'
import { createEvent, restore } from 'effector'

export const setDataToUpdateTree = createEvent<FiltersParams>()
export const resetDataToUpdateTree = createEvent<void>()
export const $dataToUpdateTree = restore(setDataToUpdateTree, {}).reset(resetDataToUpdateTree)
