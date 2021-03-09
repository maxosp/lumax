import dayjs from 'dayjs'
import { Subject, StudyYear } from '@/features/api/subject/types'
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

export const mapTypeToIcon = {
  SHORT_CLOSED_ANSWER: 'type-0',
  MULTIPLE_SHORT_CLOSED_ANSWER: 'type-1',
  MULTIPLE_CHOICE_ONE_OR_MANY_ANSWERS: 'type-2',
  MULTIPLE_CHOICE_ONE_ANSWER: 'type-3',
  BROAD_OPEN_ANSWER: 'type-4',
  COMMON_LIST_STRING_ANSWER: 'type-5',
  COMMON_LIST_TEXT_ANSWER: 'type-5',
  MULTIPLE_LIST_TEXT_ANSWER: 'type-5',
  CORRECT_SEQUENCE_ANSWER: 'type-6',
  CONNECT_LINES_ANSWER: 'type-6',
  MOVING_IMAGES_IMAGE_INPUT_ANSWER: 'type-7',
  MOVING_IMAGES_TEXT_INPUT_ANSWER: 'type-7',
  BROAD_FILE_ANSWER: 'type-8',
  COLOR_HIGHLIGHT_ANSWER: 'type-9',
}
export const mapTaskStatus = {
  new: 'Новое',
  reserve: 'Резерв',
  moderation: 'На доработке',
  revision: 'На проверке',
  published: 'Опубликовано',
  archive: 'Архив',
}
