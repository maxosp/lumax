import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { attach, createEvent, createStore, forward, restore } from 'effector-root'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { getThemeFx } from '@/features/api/subject/get-theme'
import {
  setSelectedSubject,
  subjectDropdownModule,
} from '@/pages/dictionary/resources/create/parts/subjects/subjects.model'
import {
  classDropdownModule,
  setSelectedClass,
} from '@/pages/dictionary/resources/create/parts/class/class.model'
import { formatData } from '@/features/lib'

export const getThemeData = attach({
  effect: getThemeFx,
})

export const themeDropdownModule = createFilter()

export const setSelectedTheme = createEvent<DropdownItem | null>()
export const $selectedTheme = restore(setSelectedTheme, null)

export const $themes = createStore<DropdownItem[]>([])

forward({
  from: getThemesTreeListFx.doneData.map((data) => formatData(data.body)),
  to: $themes,
})
forward({
  from: getThemeData.doneData.map((res) => res.body),
  to: [
    setSelectedSubject.prepend((data) => ({
      name: data && data.subject ? `${data.subject.id}` : '',
      title: data && data.subject ? data.subject.name : '',
    })),
    subjectDropdownModule.methods.itemChanged.prepend((data) => `${data!.subject!.id}`),
    setSelectedClass.prepend((data) => ({
      name: data && data.study_year ? `${data.study_year.id}` : '',
      title: data && data.study_year ? data.study_year.name : '',
    })),
    classDropdownModule.methods.itemChanged.prepend((data) => `${data!.study_year!.id}`),
    themeDropdownModule.methods.itemChanged.prepend((data) => `${data.id}`),
    setSelectedTheme.prepend((data) => ({ name: `${data.id}`, title: data.name })),
  ],
})
