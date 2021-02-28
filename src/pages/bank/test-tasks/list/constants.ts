import dayjs from 'dayjs'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { DropdownItem } from '@/pages/common/types'
import TASK_TYPES_DATA from '@/pages/bank/test-tasks/create/parts/task-types-dropdown/constants'

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
    title: 'ID задания',
    width: '130px',
  },
  {
    name: 'theme',
    title: 'Предмет',
    width: '130px',
    formatter: (data) => {
      return data && data.subject && data.subject.name ? data.subject.name : '–'
    },
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '130px',
  },
  {
    name: 'theme',
    title: 'Класс',
    width: '130px',
    formatter: (data) => {
      return data && data.study_year && data.study_year.name ? data.study_year.name : '–'
    },
  },
  {
    name: 'theme',
    title: 'Тема',
    width: '150px',
    formatter: (data) => {
      return data && data.name ? data.name : '–'
    },
  },
  {
    name: 'difficulty',
    sortField: 'difficulty',
    title: 'Сложность',
    width: '150px',
    formatter: (data) => {
      return data ? 'Продвинутый' : 'Базовый'
    },
  },
  {
    name: 'wording',
    sortField: 'wording',
    title: 'Формулировка задания',
    width: '250px',
    formatter(data: string) {
      return data || '–'
    },
  },
  {
    name: 'type',
    sortField: 'type',
    title: 'Тип',
    width: '150px',
    formatter: (data) => {
      const element = TASK_TYPES_DATA.find((item) => (item.name = data))
      return element ? element.title : '–'
    },
  },
  {
    name: 'labels_string',
    sortField: 'labels_string',
    title: 'Метки',
    width: '200px',
    formatter(data: string) {
      return data || '–'
    },
  },
  {
    name: 'interface_language',
    sortField: 'interface_language',
    title: 'Язык',
    width: '130px',
    formatter: (data) => {
      return data === 'en' ? 'Английский' : 'Русский'
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
    title: 'Посл. изменение',
    width: '150px',
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

export const contextMethodsOneTask = [
  { name: 'edit', title: 'Редактирование' },
  { name: 'delete', title: 'Удалить задание' },
  { name: 'double_task', title: 'Дублировать задание' },
  { name: 'double_n_task', title: 'Дублировать задание n раз' },
  { name: 'send_to_check', title: 'Отправить заявку на проверку' },
  { name: 'public', title: 'Опубликовать' },
  { name: 'preview', title: 'Предпросмотр' },
]
export const contextMethodsManyTasks = [
  { name: 'delete-all', title: 'Удалить выделенные задания' },
  { name: 'send-to-check-all', title: 'Отправить на проверку' },
  { name: 'public-all', title: 'Опубликовать' },
  { name: 'preview-all', title: 'Предпросмотр' },
]
