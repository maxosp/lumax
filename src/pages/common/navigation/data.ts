import { NavItem } from '@/pages/common/navigation/types'

export const data: NavItem[] = [
  {
    id: 'requests',
    title: 'Заявки',
    icon: 'success',
    type: 'applications',
    children: [
      { title: 'Входящие заявки', link: 'incoming-list', type: 'incoming-applications' },
      { title: 'Исходящие заявки', link: 'outgoing-list' },
      {
        title: 'Входящие заявки на удаление',
        link: 'incoming-deletion-list',
        type: 'incoming-deletion-applications',
      },
      { title: 'Исходящие заявки на удаление', link: 'outgoing-deletion-list' },
    ],
  },
  {
    id: 'tasks',
    title: 'Банк заданий',
    icon: 'tasks',
    children: [
      { title: 'Тестовые задания', link: 'test-tasks-list' },
      { title: 'Олимпиадные задания', link: 'olympiad-tasks-list' },
      { title: 'Задания для уроков', link: 'lesson-tasks-list' },
    ],
  },
  {
    id: 'tests',
    title: 'Тестирование',
    icon: 'check',
    children: [
      { title: 'Тесты', link: 'tests-list' },
      { title: 'Метки для заданий', link: '/' },
    ],
  },
  {
    id: 'olympiads',
    title: 'Олимпиады',
    icon: 'olympiad',
    children: [
      { title: 'Олимпиады', link: '/' },
      { title: 'Метки олимпиад', link: '/' },
    ],
  },
  {
    id: 'learning',
    title: 'Обучение',
    icon: 'book',
    children: [
      { title: 'Уроки', link: '/' },
      { title: 'Курсы', link: '/' },
      { title: 'Кружки', link: '/' },
      { title: 'Ученики', link: '/' },
    ],
  },
  {
    id: 'exams',
    title: 'Экзамены',
    icon: 'list',
    children: [
      { title: 'Заочный', link: '/' },
      { title: 'Очный', link: '/' },
    ],
  },
  {
    id: 'results',
    title: 'Результаты',
    icon: 'statistics',
    children: [
      { title: 'Тест (все)', link: '/' },
      { title: 'Тесты (по пользователю)', link: '/' },
      { title: 'Экзамен', link: '/' },
      { title: 'Курсы', link: '/' },
      { title: 'Кружки', link: '/' },
      { title: 'Сводные результаты по пользователю', link: '/' },
    ],
  },
  {
    id: 'users',
    title: 'Пользователи',
    icon: 'user',
    children: [
      { title: 'Сотрудники', link: '/' },
      { title: 'Ученики', link: '/' },
      { title: 'Группы пользователей', link: '/' },
      { title: 'Статусы заявок учеников', link: '/' },
    ],
  },
  {
    id: 'callback',
    title: 'Обратная связь',
    icon: 'callback',
    children: null,
  },
  {
    id: 'catalog',
    title: 'Справочник',
    icon: 'folder',
    children: [
      { title: 'Темы', link: 'themes-list' },
      { title: 'Предметы', link: 'subjects-list' },
      { title: 'Библиотека ресурсов', link: 'resources-list' },
      { title: 'Файлы пользователей', link: '/' },
      { title: 'Метки для тестовых заданий', link: 'labels-list' },
      { title: 'Теги для олимпиадных заданий', link: 'tags-list' },
    ],
  },
  {
    id: 'content',
    title: 'Контент',
    icon: 'display',
    children: [
      { title: 'Новости', link: '/' },
      { title: 'FAQ', link: '/' },
      { title: 'Слайдеры', link: '/' },
      { title: 'Баннеры', link: '/' },
    ],
  },
  {
    id: 'settings',
    title: 'Настройки',
    icon: 'filter',
    children: [
      { title: 'Страница достижений', link: '/' },
      { title: 'Страница кружков', link: '/' },
      { title: 'Страница поступления', link: '/' },
    ],
  },
  {
    id: 'backups',
    title: 'Бэкапы',
    icon: 'backup',
    children: null,
  },
]
