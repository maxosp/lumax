// test-tasks
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TestTasksLists from '@/pages/bank/test-tasks/list/TestTasksList.vue'
import TestTaskCreationPage from '@/pages/bank/test-tasks/create/TaskCreationPage.vue'
// olympiad-tasks
import OlympiadTasksList from '@/pages/bank/olympiad-tasks/list/OlympiadList.vue'
import OlympiadTaskCreationPage from '@/pages/bank/olympiad-tasks/create/TaskCreationPage.vue'
// lesson-tasks
import LessonsTasksLists from '@/pages/bank/lesson-tasks/list/LessonTasksList.vue'
import LessonTaskCreationPage from '@/pages/bank/lesson-tasks/create/TaskCreationPage.vue'

export default [
  {
    name: 'bank',
    path: '/bank',
    redirect: { name: 'test-tasks-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'test-tasks',
        path: 'test-tasks',
        component: DefaultLayout,
        redirect: { name: 'test-tasks-list' },
        children: [
          {
            name: 'test-tasks-list',
            path: 'list',
            component: TestTasksLists,
            meta: {
              title: 'Тестовые задания - Школа Летово',
            },
          },
          {
            name: 'test-tasks-create',
            path: 'create',
            component: TestTaskCreationPage,
            meta: {
              title: 'Создание тестового задания - Школа Летово',
            },
          },
          {
            name: 'test-tasks-edit',
            path: 'edit/:id',
            component: TestTaskCreationPage,
            meta: {
              title: 'Редактирование тестового задания - Школа Летово',
            },
          },
        ],
      },
      {
        name: 'olympiad-tasks',
        path: 'olympiad-tasks',
        component: DefaultLayout,
        redirect: { name: 'olympiad-tasks-creation' },
        children: [
          {
            name: 'olympiad-tasks-list',
            path: 'list',
            component: OlympiadTasksList,
            meta: {
              title: 'Олимпиадные задания - Школа Летово',
            },
          },
          {
            name: 'olympiad-tasks-edit',
            path: 'edit/:id',
            component: OlympiadTaskCreationPage,
            meta: {
              title: 'Редактирование олимпиадного задания - Школа Летово',
            },
          },
          {
            name: 'olympiad-tasks-create',
            path: 'create',
            component: OlympiadTaskCreationPage,
            meta: {
              title: 'Создание олимпиадного задания - Школа Летово',
            },
          },
        ],
      },
      {
        name: 'lesson-tasks',
        path: 'lesson-tasks',
        component: DefaultLayout,
        redirect: { name: 'lesson-tasks-creation' },
        children: [
          {
            name: 'lesson-tasks-list',
            path: 'list',
            component: LessonsTasksLists,
            meta: {
              title: 'Задания для уроков - Школа Летово',
            },
          },
          {
            name: 'lesson-tasks-creation',
            path: 'create',
            component: LessonTaskCreationPage,
            meta: {
              title: 'Создание задания для уроков - Школа Летово',
            },
          },
          {
            name: 'lesson-tasks-edit',
            path: 'edit/:id',
            component: LessonTaskCreationPage,
            meta: {
              title: 'Редактирование задания для уроков - Школа Летово',
            },
          },
        ],
      },
    ],
  },
]
