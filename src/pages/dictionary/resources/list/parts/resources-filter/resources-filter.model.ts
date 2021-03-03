import { combine, createEvent, forward, restore } from 'effector-root'
import { debounce } from 'patronum'
import { $selectedClass } from '@/pages/dictionary/resources/list/parts/resources-filter/parts/class/class-dropdown.model'
import { $selectedSubject } from '@/pages/dictionary/resources/list/parts/resources-filter/parts/subject/subject-dropdown.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'

export const reset = createEvent<void>()

export const toggleVisibility = createEvent<boolean>()
export const $visibility = restore(toggleVisibility, false).reset(reset)

export const createdByMeChanged = createEvent<boolean>()
export const $createdByMe = restore<boolean>(createdByMeChanged, false)

const $formToGetThemeList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && +cl.name,
  subject: obj && +obj.name,
}))

const debounced = debounce({
  source: $formToGetThemeList,
  timeout: 150,
})

forward({
  from: debounced,
  to: [
    getThemesTreeListFx.prepend((data) => {
      return {
        study_year: data.study_year ? data.study_year : undefined,
        subject: data.subject ? data.subject : undefined,
        is_prerequisite: false,
      }
    }),
  ],
})
