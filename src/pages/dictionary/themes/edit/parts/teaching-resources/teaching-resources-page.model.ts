import { deleteResourcesFx } from '@/features/api/media/delete-resources'
import { getResourcesListFx } from '@/features/api/media/get-resources-list'
import { ResourceType } from '@/features/api/media/types'
import { attach, createEvent, forward, restore, sample } from 'effector'

const deleteResources = attach({
  effect: deleteResourcesFx,
})

const getResourcesList = attach({
  effect: getResourcesListFx,
})

export const setTeachingResources = createEvent<ResourceType[] | null>()
export const $teachingResources = restore(setTeachingResources, null)

export const setThemeId = createEvent<number>()
const $themeId = restore(setThemeId, null)

export const deleteTeachingResource = createEvent<number[]>()

forward({
  from: deleteTeachingResource,
  to: deleteResources,
})

sample({
  source: $themeId,
  clock: deleteResources.doneData,
  fn: (id) => ({ theme: id! }),
  target: getResourcesList,
})

forward({
  from: getResourcesList.doneData.map((res) => res.body.data),
  to: setTeachingResources,
})
