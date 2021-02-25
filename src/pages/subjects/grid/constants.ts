import { TableField } from '@/pages/themes/types'

export const subjectsTableFields: TableField[] = [
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
    title: 'ID',
    width: '70px',
  },
  {
    name: 'name',
    sortField: 'name',
    title: 'Название предмета',
    width: '200px',
  },
  {
    name: 'is_mandatory',
    sortField: 'is_mandatory',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Обязательный предмет',
    width: '200px',
    formatter(value: boolean) {
      return value ? 'Да' : 'Нет'
    },
  },
  {
    name: 'color',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Цвет предмета',
    formatter(data: any) {
      return data ? `<div class="round-color" style="background-color: ${data.value}"/>` : ''
    },
    width: '200px',
  },
  {
    name: 'icon',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    title: 'Иконка предмета',
    formatter(data: any) {
      return data ? `<div style="background-image: url(${data.file})" class="image-subject"/>` : ''
    },
    width: '200px',
  },
  {
    name: 'actions',
    title: '',
    dataClass: 'right aligned',
    width: '125px',
  },
]

export const searchFieldsData = [
  { name: 'all', title: 'Искать везде' },
  { name: 'id', title: 'ID Предмета' },
  { name: 'name', title: 'Название предмета' },
  { name: 'required_subject', title: 'Обязательный предмет' },
]
