import { StudyYear, Subject } from '@/features/api/subject/types'
import { DropdownItem } from '@/pages/common/types'
import { TableField } from '@/pages/dictionary/themes/list/types'
import dayjs from 'dayjs'

export const testsDataFields: TableField[] = [
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
    title: 'ID теста',
    width: '130px',
  },
  {
    name: 'name',
    title: 'Название',
    width: '150px',
  },
  {
    name: 'subject',
    sortField: 'subject',
    title: 'Предмет',
    width: '140px',
    formatter(subject: Subject) {
      return subject && subject.name ? subject.name : '-'
    },
  },
  {
    name: 'study_year',
    sortField: 'study_year',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Класс',
    width: '100px',
    formatter(study_year: StudyYear) {
      return study_year && study_year.name ? study_year.name : '-'
    },
  },
  {
    name: 'difficulty',
    title: 'Сложность',
    width: '150px',
    formatter(difficulty: number) {
      return difficulty ? 'Тест продвинутый' : 'Тест базовый'
    },
  },
  {
    name: 'themes_amount',
    title: 'Кол-во тем',
    width: '150px',
    formatter(count: number) {
      return count || '-'
    },
  },
  {
    name: 'assignments_amount',
    title: 'Кол-во заданий',
    width: '150px',
    formatter(count: number) {
      return count || '-'
    },
  },
  {
    name: 'generator',
    title: 'Тип ген.',
    width: '150px',
    formatter(generator: number) {
      return generator ? 'Ручная генерация' : 'Автоматическая генерация'
    },
  },
  {
    name: 'filter_by_year',
    title: 'Фильтр. заданий по классу',
    width: '150px',
    formatter(filter_by_year: boolean) {
      return filter_by_year ? 'да' : 'нет'
    },
  },
  {
    name: 'duration_min',
    title: 'Длительность теста',
    width: '150px',
    formatter(duration_min: number) {
      return duration_min || '-'
    },
  },
  {
    name: 'groups_names',
    title: 'Группы',
    width: '150px',
  },
  {
    name: 'status',
    sortField: 'status',
    title: 'Статус',
    width: '140px',
    formatter(status: number) {
      return status ? 'Опубликовано' : 'Архив'
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
    name: 'created_by',
    sortField: 'created_by',
    title: 'Создатель',
    width: '150px',
    formatter: (data) => {
      return data && data.id && data.first_name && data.last_name
        ? `${data.id} ${data.first_name} ${data.last_name}`
        : '–'
    },
  },
  {
    name: 'updated_by',
    sortField: 'updated_by',
    title: 'Посл. изменение',
    width: '200px',
    formatter: (data) => {
      return data && data.id && data.first_name && data.last_name
        ? `${data.id} ${data.first_name} ${data.last_name}`
        : '–'
    },
  },
  {
    name: 'cms_comment',
    title: 'Комментарий',
    width: '150px',
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
  { name: 'id', title: 'ID теста' },
  { name: 'name', title: 'Название' },
  { name: 'study_year', title: 'Класс' },
  { name: 'subject_id', title: 'Предмет' },
  { name: 'groups_names', title: 'Группа' },
]
