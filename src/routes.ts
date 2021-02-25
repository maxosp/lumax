import { RouteConfig } from 'vue-router'
import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'
import LoginLayout from '@/layouts/LoginLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import HomePage from '@/pages/home/HomePage.vue'
import ThemesPage from '@/pages/themes/ThemesPage.vue'
import ThemeCreationPage from '@/pages/theme-creation/ThemeCreationPage.vue'
import LessonTaskCreationPage from '@/pages/task-creation/lesson/TaskCreationPage.vue'
import OlympiadTaskCreationPage from '@/pages/task-creation/olympiad/TaskCreationPage.vue'
import TestTaskCreationPage from '@/pages/task-creation/test/TaskCreationPage.vue'
import subjectRoutes from '@/pages/subjects/subjects-routes'
// import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'

export const routes: RouteConfig[] = [
  {
    path: '/auth',
    component: LoginLayout,
    redirect: { name: 'auth.login' },
    beforeEnter: checkUserGuestMiddleware,
    children: [
      {
        name: 'auth.login',
        path: 'login',
        component: LoginPage,
        meta: {
          title: 'Вход - Школа Летово',
        },
      },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    redirect: { name: 'home' },
    beforeEnter: checkUserAuthedMiddleware,
    children: [
      {
        name: 'home',
        path: '/home',
        component: HomePage,
        meta: {
          title: 'Стартовая страница - Школа Летово',
        },
      },
      {
        name: 'themes',
        path: '/themes',
        component: ThemesPage,
        meta: {
          title: 'Темы - Школа Летово',
        },
      },
      {
        name: 'theme-creation',
        path: '/theme-creation',
        component: ThemeCreationPage,
        meta: {
          title: 'Создание темы - Школа Летово',
        },
      },
      {
        name: 'test-task-creation',
        path: '/tasks/create/test-type',
        component: TestTaskCreationPage,
        meta: {
          title: 'Создание тестового задания - Школа Летово',
        },
      },
      {
        name: 'olympiad-task-creation',
        path: '/tasks/create/olympiad-type',
        component: OlympiadTaskCreationPage,
        meta: {
          title: 'Создание олимпиадного задания - Школа Летово',
        },
      },
      {
        name: 'lesson-task-creation',
        path: '/tasks/create/lesson-type',
        component: LessonTaskCreationPage,
        meta: {
          title: 'Создание задания для уроков - Школа Летово',
        },
      },
      ...subjectRoutes,
      { name: 'default-route', path: '*', redirect: { name: 'home' } },
    ],
  },
]
