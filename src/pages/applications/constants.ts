export const mapApplicationsStatus = {
  waiting: 'Ожидает проверки',
  revision: 'На доработку',
  finished: 'Проверено',
}

export const mapApplicationsDeletionStatus = {
  new: 'Новая',
  accepted: 'Принята',
  rejected: 'Отклонена',
}

export const mapObjectType = {
  theme: 'Тема',
  subject: 'Предмет',
  test_assignment: 'Тестовое задание',
  olympiad_assignment: 'Олимпиадное задание',
  lesson_assignment: 'Урочное задание',
}

export const mapApplicationTypeToRoute = {
  subject: 'subjects',
  theme: 'themes',
  lesson_assignment: 'lesson-tasks',
  olympiad_assignment: 'olympiad-tasks',
  test_assignment: 'test-tasks',
}
