import { StudyYear, Subject } from '@/features/api/subject/types'
import { DropdownItem } from '@/pages/common/types'
import { TableField } from '@/pages/dictionary/themes/list/types'

export const tagsDataFields: TableField[] = [
  {
    name: '__checkbox',
    title: '',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    width: '50px',
  },
  {
    name: 'id',
    sortField: 'id',
    title: 'ID тега',
    width: '110px',
  },
  {
    name: 'name',
    sortField: 'name',
    title: 'Наименование',
    width: '260px',
  },
  {
    name: 'subject',
    sortField: 'subject',
    title: 'Предмет',
    width: '140px',
    formatter(subject: Subject) {
      return subject ? subject.name : '-'
    },
  },
  {
    name: 'study_year',
    sortField: 'study_year',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Класс',
    width: '100px',
    formatter(year: StudyYear) {
      return year ? year.name : '-'
    },
  },
  {
    name: 'assignments_ids',
    sortField: 'assignments_ids',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Задания с тегом ',
    width: '160px',
    formatter(list: any) {
      return [...list].splice(0, 3).join(', ')
    },
  },
  {
    name: 'assignments_count',
    sortField: 'assignments_count',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(value: string[]) {
      return value
    },
    title: 'Количество заданий',
    width: '220px',
  },
  {
    name: 'actions',
    title: '',
    dataClass: 'actions-cell right aligned',
    width: '120px',
  },
]

export const searchFieldsData: DropdownItem[] = [
  { name: 'all', title: 'Искать везде' },
  { name: 'name', title: 'Название' },
  { name: 'subject', title: 'Предмет' },
  { name: 'study_year', title: 'Класс' },
]

export const DEFAULT_ID = -1
