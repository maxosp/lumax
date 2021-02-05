import dayjs from 'dayjs'
import { Subject, StudyYear } from '@/features/api/subject/types'
import { TableField, SearchField } from '@/pages/themes/types'

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
    sortField: 'subject',
    title: 'Предмет',
    width: '140px',
    formatter(value: Subject) {
      return value ? value.name : '-'
    },
  },
  {
    name: 'study_year',
    sortField: 'study_year',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Класс',
    width: '80px',
    formatter(value: StudyYear) {
      return value ? value.name : '-'
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
    width: '130px',
  },
  {
    name: 'creation_datetime',
    sortField: 'creation_datetime',
    title: 'Создано',
    width: '110px',
    formatter(value: string) {
      return value ? dayjs(value).format('dd.mm.yyyy') : '-'
    },
  },
  {
    name: 'update_datetime',
    sortField: 'update_datetime',
    title: 'Обновлено',
    width: '110px',
    formatter(value: string) {
      return value ? dayjs(value).format('dd.mm.yyyy') : '-'
    },
  },
  {
    name: 'actions',
    title: '',
    dataClass: 'right aligned',
    width: '125px',
  },
]

export const searchFieldsData: SearchField[] = [
  { name: 'all', title: 'Искать везде' },
  { name: 'id', title: 'ID Темы' },
  { name: 'name', title: 'Название' },
  { name: 'study_year', title: 'Класс' },
  { name: 'subject', title: 'Предмет' },
]
