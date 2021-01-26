import { NavItem } from '@/pages/common/Navigation/types.ts'

export const data: NavItem[] = [
  {
    title: 'Банк заданий',
    icon: 'tasks',
    children: [
      { title: 'Тестовые задания' },
      { title: 'Олимпиадные задания' },
      { title: 'Задания для уроков' },
    ],
  },
  {
    title: 'Тестирование',
    icon: 'check',
    children: [{ title: 'Тесты' }, { title: 'Метки для заданий' }],
  },
  {
    title: 'Олимпиады',
    icon: 'olympiad',
    children: [{ title: 'Олимпиады' }, { title: 'Метки олимпиад' }],
  },
  {
    title: 'Обучение',
    icon: 'book',
    children: [{ title: 'Уроки' }, { title: 'Курсы' }, { title: 'Кружки' }, { title: 'Ученики' }],
  },
  {
    title: 'Экзамены',
    icon: 'list',
    children: [{ title: 'Заочный' }, { title: 'Очный' }],
  },
  {
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
    title: 'Заявки',
    icon: 'success',
    children: [
      { title: 'Мои заявки' },
      { title: 'Заявки на проверку задания' },
      { title: 'Заявки на удаление' },
    ],
  },
  {
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
    title: 'Обратная связь',
    icon: 'callback',
    children: [],
  },
  {
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
    title: 'Контент',
    icon: 'display',
    children: [{ title: 'Новости' }, { title: 'FAQ' }, { title: 'Слайдеры' }, { title: 'Баннеры' }],
  },
  {
    title: 'Настройки',
    icon: 'filter',
    children: [
      { title: 'Страница достижений' },
      { title: 'Страница кружков' },
      { title: 'Страница поступления' },
    ],
  },
  {
    title: 'Бэкапы',
    icon: 'backup',
    children: [],
  },
]
