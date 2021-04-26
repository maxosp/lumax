import dayjs from 'dayjs'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { DropdownItem } from '@/pages/common/types'
import { mapTaskStatus } from '@/pages/common/parts/status-controller/constants'

export const lessonsTableFields: TableField[] = [
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
    title: 'ID задания',
    width: '130px',
  },
  {
    name: 'course_theme',
    title: 'Курс',
    width: '130px',
    formatter(data: string) {
      return data || '–'
    },
  },
  {
    name: 'folder',
    title: 'Расположение',
    width: '130px',
    formatter(data: { name: string; id: number }) {
      return data.name || '–'
    },
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '130px',
    formatter(status: any) {
      return mapTaskStatus[status] || '-'
    },
  },
  {
    name: 'wording',
    sortField: 'wording',
    title: 'Формулировка задания',
    width: '220px',
    formatter(data: string) {
      return data || '–'
    },
  },
  {
    name: 'type',
    sortField: 'type',
    title: 'Тип задания',
    width: '150px',
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
    width: '100px',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(text: string) {
      return text || '-'
    },
  },
  {
    name: 'interface_language',
    sortField: 'interface_language',
    title: 'Язык',
    width: '80px',
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
    width: '130px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'update_datetime',
    sortField: 'update_datetime',
    title: 'Обновлено',
    width: '130px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'updated_by',
    sortField: 'updated_by',
    title: 'Посл. изменение',
    width: '180px',
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
    width: '125px',
  },
]

export const searchFieldsData: DropdownItem[] = [] // TODO add elements to array

export const contextMethodsOneLesson = [
  { name: 'edit', title: 'Редактирование' },
  { name: 'delete', title: 'Удалить задание' },
  { name: 'double_task', title: 'Дублировать задание' },
  { name: 'double_n_task', title: 'Дублировать задание n раз' },
  { name: 'preview', title: 'Предпросмотр' },
]
export const contextMethodsManyLessons = [
  { name: 'delete-all', title: 'Удалить выделенные задания' },
  { name: 'preview', title: 'Предпросмотр' },
]
