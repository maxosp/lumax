import dayjs from 'dayjs'
import { TableField } from '@/pages/dictionary/themes/list/types'
import { DropdownItem } from '@/pages/common/types'
import { mapTaskStatus } from '@/pages/common/parts/status-controller/constants'

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
    name: 'subject',
    sortField: 'theme__subject',
    title: 'Предмет',
    width: '130px',
    formatter: (data) => {
      return (data && data.name) || '–'
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
    name: 'study_year',
    sortField: 'theme__study_year',
    title: 'Класс',
    width: '130px',
    formatter: (data) => {
      return (data && data.name) || '–'
    },
  },
  {
    name: 'theme',
    sortField: 'theme',
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
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(icon: string) {
      return icon
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
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    formatter(text: string) {
      return text || '-'
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

export const searchFieldsData: DropdownItem[] = [
  { name: 'all', title: 'Искать везде' },
  { name: 'id', title: 'id Задания' },
  { name: 'created_by', title: 'Создатель' },
  { name: 'theme', title: 'Тема' },
  { name: 'wording', title: 'Формулировка' },
]

export const contextMethodsOneTask = [
  { name: 'edit', title: 'Редактирование' },
  { name: 'delete', title: 'Удалить задание' },
  { name: 'duplicate', title: 'Дублировать задание' },
  { name: 'duplicate_n_times', title: 'Дублировать задание n раз' },
  { name: 'send_to_check', title: 'Отправить задание на проверку' },
  { name: 'public', title: 'Опубликовать' },
  { name: 'preview', title: 'Предпросмотр' },
]
export const contextMethodsManyTasks = [
  { name: 'delete_all', title: 'Удалить выделенные задания' },
  { name: 'send_to_check_all', title: 'Отправить задания на проверку' },
  { name: 'public_all', title: 'Опубликовать' },
  { name: 'preview', title: 'Предпросмотр' },
]
