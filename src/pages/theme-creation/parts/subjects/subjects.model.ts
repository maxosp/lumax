import { createEvent, createStore, restore, sample } from 'effector-root'
import { debounce } from 'patronum'
import { SUBJECTS_DROPDOWN_VALUES } from '@/pages/theme-creation/parts/subjects/constants'
import { SubjectDropdownType } from '@/pages/theme-creation/parts/subjects/types'

export const resetSubject = createEvent<void>()
export const subjectChanged = createEvent<null | number>()
export const $subject = restore<null | number>(subjectChanged, null).reset(resetSubject)
export const subjectSearchStringChanged = createEvent<string>()
export const resetSearchString = createEvent<void>()
export const $subjectSearchString = restore<string>(subjectSearchStringChanged, '').reset(
  resetSearchString
)

export const $subjectsDropdown = createStore<SubjectDropdownType[]>(SUBJECTS_DROPDOWN_VALUES)
export const $_subjectsDropdown = createStore<SubjectDropdownType[]>(SUBJECTS_DROPDOWN_VALUES)

const searchSubject = createEvent<string>()
const restoreSubjects = createEvent<void>()

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
