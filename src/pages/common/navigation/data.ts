import { NavItem } from '@/pages/common/navigation/types'

export const data: NavItem[] = [
  {
    id: 'requests',
    title: 'Заявки',
    icon: 'success',
    children: [
      { title: 'Мои заявки', link: '/' },
      { title: 'Заявки на проверку задания', link: '/' },
      { title: 'Заявки на удаление', link: '/' },
    ],
  },
  {
    id: 'tasks',
    title: 'Банк заданий',
    icon: 'tasks',
    children: [
      { title: 'Тестовые задания', link: 'test-task-creation' },
      { title: 'Олимпиадные задания', link: 'olympiad-task-creation' },
      { title: 'Задания для уроков', link: 'lesson-task-creation' },
    ],
  },
  {
    id: 'tests',
    title: 'Тестирование',
    icon: 'check',
    children: [
      { title: 'Тесты', link: '/' },
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
      { title: 'Темы', link: 'themes' },
      { title: 'Предметы', link: 'subject-list' },
      { title: 'Библиотека ресурсов', link: '/' },
      { title: 'Файлы пользователей', link: '/' },
      { title: 'Метки для тестовых заданий', link: '/' },
      { title: 'Теги для олимпиадных заданий', link: '/' },
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
