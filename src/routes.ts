import { RouteConfig } from 'vue-router'
import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'
import LoginLayout from '@/layouts/LoginLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import HomePage from '@/pages/home/HomePage.vue'
import bankRoutes from '@/pages/bank/bank-routes'
import dictionaryRoutes from '@/pages/dictionary/dictionary-routes'
import tagsRoutes from '@/pages/tags/tags-routes'
import labelsRoutes from '@/pages/labels/labels-routes'

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
      ...tagsRoutes,
      ...labelsRoutes,
      ...bankRoutes,
      ...dictionaryRoutes,
      { name: 'default-route', path: '*', redirect: { name: 'home' } },
    ],
  },
]
