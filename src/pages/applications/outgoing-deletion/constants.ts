import { TableField } from '@/pages/applications/types'
import { DropdownItem } from '@/pages/common/types'
import dayjs from 'dayjs'
import { mapApplicationsDeletionStatus, mapObjectType } from '@/pages/applications/constants'

export const outgoingDeletionApplicationsDataFields: TableField[] = [
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
    name: 'object_type',
    sortField: 'object_type',
    title: 'Тип элемента',
    width: '140px',
    formatter(text: string) {
      return mapObjectType[text] || '-'
    },
  },
  {
    name: 'object_name',
    sortField: 'object_name',
    title: 'Наименование',
    width: '200px',
    formatter(text: string) {
      return text || ''
    },
  },
  {
    name: 'comment',
    sortField: 'comment',
    title: 'Комментарий',
    width: '200px',
    formatter(text: string) {
      return text || '–'
    },
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '180px',
    formatter(status: any) {
      return mapApplicationsDeletionStatus[status] || '-'
    },
  },
  {
    name: 'created_at',
    sortField: 'created_at',
    title: 'Создана',
    width: '200px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'moderated_at',
    sortField: 'moderated_at',
    title: 'Обработана',
    width: '200px',
    formatter(datetime: string) {
      return datetime ? dayjs(datetime).format('DD.MM.YYYY') : '–'
    },
  },
  {
    name: 'moderate_by',
    sortField: 'moderate_by',
    title: 'Проверяющий',
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
  { name: 'created_by', title: 'Создатель' },
  { name: 'moderate_by', title: 'Проверяющий' },
  { name: 'status', title: 'Статус' },
  { name: 'comment', title: 'Комментарий' },
  { name: 'object_name', title: 'Наименование' },
  { name: 'object_type', title: 'Тип элемента' },
]
