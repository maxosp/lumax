import { Theme } from '@/features/api/subject/types'
import { DropdownItem } from '@/pages/common/types'
import { mapTaskStatus } from '@/pages/dictionary/themes/list/constants'
import { TableField } from '@/pages/dictionary/themes/list/types'
import dayjs from 'dayjs'

export const olympiadTasksDataFields: TableField[] = [
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
    name: 'theme',
    sortField: 'subject',
    title: 'Предмет',
    width: '140px',
    formatter(theme: Theme) {
      return theme && theme.subject ? theme.subject.name : '-'
    },
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '140px',
    formatter(status: any) {
      return mapTaskStatus[status] || '-'
    },
  },
  {
    name: 'study_year',
    sortField: 'study_year',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Класс',
    width: '100px',
    formatter(theme: Theme) {
      return theme && theme.study_year ? theme.study_year.name : '-'
    },
  },
  {
    name: 'wording',
    sortField: 'wording',
    title: 'Форм. задания',
    width: '180px',
    formatter(text: string) {
      return text || '-'
    },
  },
  {
    name: 'type',
    sortField: 'type',
    title: 'Тип задания',
    width: '140px',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(icon: string) {
      return icon
    },
  },
  {
    name: 'score',
    sortField: 'score',
    title: 'Баллы',
    width: '110px',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(text: string) {
      return text || '-'
    },
  },
  {
    name: 'assignments_ids',
    sortField: 'assignments_ids',
    title: 'Теги',
    width: '150px',
    formatter(list: string[]) {
      return list
    },
  },
  {
    name: 'interface_language',
    sortField: 'interface_language',
    title: 'Язык',
    width: '110px',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(text: string) {
      return text || '-'
    },
  },
  {
    name: 'created_by',
    sortField: 'created_by',
    title: 'Создатель',
    width: '200px',
    formatter: (data) => {
      return data && data.id && data.first_name && data.last_name
        ? `${data.id} ${data.first_name} ${data.last_name}`
        : '–'
    },
  },
  {
    name: 'creation_datetime',
    sortField: 'creation_datetime',
    title: 'Создано',
    width: '200px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'update_datetime',
    sortField: 'update_datetime',
    title: 'Обновлено',
    width: '200px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'updated_by',
    sortField: 'updated_by',
    title: 'Посл. изменения',
    width: '200px',
    formatter: (data) => {
      return data && data.id && data.first_name && data.last_name
        ? `${data.id} ${data.first_name} ${data.last_name}`
        : '–'
    },
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
  { name: 'id', title: 'id Задания' },
  { name: 'score', title: 'Баллы' },
  { name: 'created_by', title: 'Создатель' },
]

export const DEFAULT_ID = -1
