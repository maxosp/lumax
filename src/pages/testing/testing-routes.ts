import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TestsList from '@/pages/testing/tests/list/TestsList.vue'

export default [
  {
    name: 'testing',
    path: '/testing',
    redirect: { name: 'tests-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'testing-layout',
        path: 'tests',
        component: DefaultLayout,
        redirect: { name: 'tests-list' },
        children: [
          {
            name: 'tests-list',
            path: 'list',
            component: TestsList,
            meta: {
              title: 'Тесты - Школа Летово',
            },
          },
        ],
      },
    ],
  },
]
