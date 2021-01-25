import { RouteConfig } from 'vue-router'
import CommonPageLayout from '@/layouts/CommonPageLayout.vue'
import HomePage from '@/pages/home/HomePage.vue'
// import { checkUserAuthedMiddleware, checkUserGuestMiddleware } from '@/features/session/middlewares'

export const routes: RouteConfig[] = [
  {
    path: '',
    component: CommonPageLayout,
    children: [
      {
        name: 'home',
        path: '/home',
        component: HomePage,
        meta: {
          title: 'Стартовая страница - Школа Летово',
        },
      },
    ],
  },
]
