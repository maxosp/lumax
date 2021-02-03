import { RouteConfig } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import HomePage from '@/pages/home/HomePage.vue'
import ThemesPage from '@/pages/themes/ThemesPage.vue'
import ThemeCreationPage from '@/pages/theme-creation/ThemeCreationPage.vue'
// import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'

export const routes: RouteConfig[] = [
  {
    name: 'login',
    path: '/login',
    component: LoginPage,
    meta: {
      title: 'Вход - Школа Летово',
    },
  },
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        name: 'home',
        path: '/',
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
    ],
  },
]
