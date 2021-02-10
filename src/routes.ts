import { RouteConfig } from 'vue-router'
import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'
import LoginLayout from '@/layouts/LoginLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import HomePage from '@/pages/home/HomePage.vue'
import ThemesPage from '@/pages/themes/ThemesPage.vue'
import ThemeCreationPage from '@/pages/theme-creation/ThemeCreationPage.vue'
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
    component: DefaultLayout,
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
      { name: 'default-route', path: '*', redirect: { name: 'home' } },
    ],
  },
]
