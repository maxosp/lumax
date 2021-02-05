import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { SUBJECTS_DROPDOWN_VALUES } from '@/pages/theme-creation/parts/subjects/constants'

export const subjectChanged = createEvent<null | number>()
export const $subject = restore<null | number>(subjectChanged, null)
export const subjectSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent()
export const $subjectSearchString = restore(subjectSearchStringChanged, '').reset(resetSearchString)

export const $subjectsDropdown = createStore(SUBJECTS_DROPDOWN_VALUES)
export const $_subjectsDropdown = createStore(SUBJECTS_DROPDOWN_VALUES)

const searchSubject = createEvent<string>()
const restoreSubjects = createEvent()

const debounced = debounce({
  source: $subjectSearchString,
  timeout: 150,
})

debounced.watch((str) => {
  if ($subject && str.length) subjectChanged(null)
  if (str.length) searchSubject(str)
  else restoreSubjects()
})

sample({
  source: $_subjectsDropdown,
  clock: searchSubject,
  fn: (list, str) => list.filter((el) => el.title.toLowerCase().indexOf(str.toLowerCase()) !== -1),
  target: $subjectsDropdown,
})
sample({
  source: $_subjectsDropdown,
  clock: restoreSubjects,
  target: $subjectsDropdown,
})
