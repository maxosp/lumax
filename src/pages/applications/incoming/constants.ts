import { TableField } from '@/pages/applications/types'
import { DropdownItem } from '@/pages/common/types'
import dayjs from 'dayjs'
import { TicketCommentType } from '@/features/api/ticket/types'
import { mapApplicationsStatus } from '@/pages/common/parts/status-controller/constants'
import { TestAssignment } from '@/features/api/assignment/types/test-assignments-types'

export const incomingApplicationsDataFields: TableField[] = [
  {
    name: '__checkbox',
    title: '',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    width: '50px',
  },
  {
    name: 'test_assignment',
    sortField: 'test_assignment__id',
    title: 'ID задания',
    width: '110px',
    formatter(obj: TestAssignment) {
      return obj.id || '-'
    },
  },
  {
    name: 'test_assignment',
    sortField: 'subject__name',
    title: 'Предмет',
    width: '140px',
    formatter(obj: TestAssignment) {
      return (obj && obj.theme && obj.theme.subject && obj.theme.subject.name) || '-'
    },
  },
  {
    name: 'test_assignment',
    sortField: 'study_year__name',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Класс',
    width: '100px',
    formatter(obj: TestAssignment) {
      return (obj && obj.theme && obj.theme.study_year && obj.theme.study_year.name) || '-'
    },
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '180px',
    formatter(status: any) {
      return mapApplicationsStatus[status] || '-'
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
    name: 'comment',
    sortField: 'comment',
    title: 'Комментарий',
    width: '200px',
    formatter(comment: TicketCommentType) {
      return comment?.text || '–'
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
  { name: 'updated_by', title: 'Редактор' },
  { name: 'subject', title: 'Предмет' },
  { name: 'study_year', title: 'Класс' },
  { name: 'comment', title: 'Комментарий' },
]
