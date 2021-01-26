import { NavItem } from '@/pages/common/navigation/types.ts'

export const data: NavItem[] = [
  {
    id: 'tasks',
    title: 'Банк заданий',
    icon: 'tasks',
    children: [
      { title: 'Тестовые задания' },
      { title: 'Олимпиадные задания' },
      { title: 'Задания для уроков' },
    ],
  },
  {
    id: 'tests',
    title: 'Тестирование',
    icon: 'check',
    children: [{ title: 'Тесты' }, { title: 'Метки для заданий' }],
  },
  {
    id: 'olympiads',
    title: 'Олимпиады',
    icon: 'olympiad',
    children: [{ title: 'Олимпиады' }, { title: 'Метки олимпиад' }],
  },
  {
    id: 'learning',
    title: 'Обучение',
    icon: 'book',
    children: [{ title: 'Уроки' }, { title: 'Курсы' }, { title: 'Кружки' }, { title: 'Ученики' }],
  },
  {
    id: 'exams',
    title: 'Экзамены',
    icon: 'list',
    children: [{ title: 'Заочный' }, { title: 'Очный' }],
  },
  {
    id: 'results',
    title: 'Результаты',
    icon: 'statistics',
    children: [
      { title: 'Тест (все)' },
      { title: 'Тесты (по пользователю)' },
      { title: 'Экзамен' },
      { title: 'Курсы' },
      { title: 'Кружки' },
      { title: 'Сводные результаты по пользователю' },
    ],
  },
  {
    id: 'requests',
    title: 'Заявки',
    icon: 'success',
    children: [
      { title: 'Мои заявки' },
      { title: 'Заявки на проверку задания' },
      { title: 'Заявки на удаление' },
    ],
  },
  {
    id: 'users',
    title: 'Пользователи',
    icon: 'user',
    children: [
      { title: 'Сотрудники' },
      { title: 'Ученики' },
      { title: 'Группы пользователей' },
      { title: 'Статусы заявок учеников' },
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
      { title: 'Темы' },
      { title: 'Предметы' },
      { title: 'Библиотека ресурсов' },
      { title: 'Файлы пользователей' },
      { title: 'Метки для тестовых заданий' },
      { title: 'Теги для олимпиадных заданий' },
    ],
  },
  {
    id: 'content',
    title: 'Контент',
    icon: 'display',
    children: [{ title: 'Новости' }, { title: 'FAQ' }, { title: 'Слайдеры' }, { title: 'Баннеры' }],
  },
  {
    id: 'settings',
    title: 'Настройки',
    icon: 'filter',
    children: [
      { title: 'Страница достижений' },
      { title: 'Страница кружков' },
      { title: 'Страница поступления' },
    ],
  },
  {
    id: 'backups',
    title: 'Бэкапы',
    icon: 'backup',
    children: null,
  },
]
