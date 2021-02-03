import dayjs from 'dayjs'
import { Subject, StudyYear } from '@/features/api/subject/types'

export const themesTableFields = [
  {
    name: '__checkbox',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
  },
  {
    name: 'id',
    sortField: 'id',
    title: 'ID Темы',
  },
  {
    name: 'subject',
    sortField: 'subject',
    title: 'Предмет',
    formatter(value: Subject) {
      return value ? value.name : '-'
    },
  },
  {
    name: 'study_year',
    sortField: 'study_year',
    title: 'Класс',
    formatter(value: StudyYear) {
      return value ? value.number + 1 : '-'
    },
  },
  {
    name: 'name',
    sortField: 'name',
    title: 'Название',
  },
  {
    name: 'is_prerequisite',
    sortField: 'is_prerequisite',
    title: 'Пререквизит',
  },
  {
    name: 'creation_datetime',
    sortField: 'creation_datetime',
    title: 'Создано',
    formatter(value: string) {
      return value ? dayjs(value).format('dd.mm.yyyy') : '-'
    },
  },
  {
    name: 'update_datetime',
    sortField: 'update_datetime',
    title: 'Обновлено',
    formatter(value: string) {
      return value ? dayjs(value).format('dd.mm.yyyy') : '-'
    },
  },
  {
    name: 'actions',
    title: '',
    titleClass: 'text-center',
    dataClass: 'text-center',
    width: '50px',
  },
]
