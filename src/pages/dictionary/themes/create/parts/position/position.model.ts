import { createFilter } from '@/pages/common/filter-dropdown/create-filter'
import { createStore, forward, sample, combine, attach } from 'effector-root'
import { $themes } from '@/pages/dictionary/themes/create/parts/themes/themes.model'
import { getThemesTreeListFx } from '@/features/api/subject/get-themes-tree-list'
import { DropdownItem } from '@/pages/common/types'
import { formatData } from '@/features/lib'
import { getThemeData } from '@/pages/dictionary/themes/create/parts/prerequisites/prerequisites.model'
import { debounce, every } from 'patronum'
import { $selectedSubject } from '@/pages/dictionary/themes/create/parts/subjects/subjects.model'
import { $selectedClass } from '@/pages/dictionary/themes/create/parts/class/class.model'

const getThemesTreeList = attach({
  effect: getThemesTreeListFx,
})

export const positionDropdownModule = createFilter()

export const $positions = createStore<DropdownItem[]>([])

export const $canSetThemePosition = every({
  predicate: (value) => value !== null,
  stores: [$selectedSubject, $selectedClass],
})

export const $formToGetThemesList = combine($selectedClass, $selectedSubject, (cl, obj) => ({
  study_year: cl && cl.id,
  subject: obj && obj.id,
}))

export const debouncedFormToGetThemesList = debounce({
  source: $formToGetThemesList,
  timeout: 150,
})

forward({
  from: debouncedFormToGetThemesList,
  to: getThemesTreeList.prepend((data) => {
    return {
      study_year: data.study_year ? data.study_year : undefined,
      subject: data.subject ? data.subject : undefined,
      is_prerequisite: false,
    }
  }),
})

forward({
  from: getThemesTreeListFx.doneData.map((data) => formatData(data.body)),
  to: [$positions, $themes],
})

sample({
  clock: positionDropdownModule.methods.itemChanged,
  source: positionDropdownModule.store.$item,
  fn: (item: string | null) => {
    if (item) getThemeData(+item)
  },
})
