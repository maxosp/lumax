import dayjs from 'dayjs'
import { StudyYear, Subject } from '@/features/api/subject/types'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { DropdownItem } from '@/pages/common/types'
import { User } from '@/features/api/user/types'

export const themesTableFields: TableField[] = [
  {
    name: '__checkbox',
    title: '',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    width: '70px',
  },
  {
    name: 'id',
    sortField: 'id',
    title: 'ID Темы',
    width: '110px',
  },
  {
    name: 'subject',
    sortField: 'subject__name',
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
    name: 'name',
    sortField: 'name',
    title: 'Название',
    width: '250px',
  },
  {
    name: 'is_prerequisite',
    sortField: 'is_prerequisite',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(value: boolean) {
      return value ? 'Да' : 'Нет'
    },
    title: 'Пререквизит',
    width: '150px',
  },
  {
    name: 'creation_datetime',
    sortField: 'creation_datetime',
    title: 'Создано',
    width: '130px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '-'
    },
  },
  {
    name: 'created_by',
    sortField: 'created_by',
    title: 'Кем',
    width: '200px',
    formatter(user: User) {
      return user ? `${user.first_name} ${user.last_name}` : '-'
    },
  },
  {
    name: 'update_datetime',
    sortField: 'update_datetime',
    title: 'Обновлено',
    width: '130px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '-'
    },
  },
  {
    name: 'updated_by',
    sortField: 'updated_by',
    title: 'Кем',
    width: '200px',
    formatter(user: User) {
      return user ? `${user.first_name} ${user.last_name}` : '-'
    },
  },
  {
    name: 'actions',
    title: '',
    dataClass: 'actions-cell right aligned',
    width: '125px',
  },
]

export const searchFieldsData: DropdownItem[] = [
  { name: 'all', title: 'Искать везде' },
  { name: 'id', title: 'ID Темы' },
  { name: 'name', title: 'Название' },
  { name: 'study_year', title: 'Класс' },
  { name: 'subject', title: 'Предмет' },
]
