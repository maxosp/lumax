import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LabelsPage from '@/pages/labels/LabelsPage.vue'

export default [
  {
    name: 'labels',
    path: '/labels',
    meta: {
      title: 'Метки для тестовых заданий - Школа Летово',
    },
    redirect: { name: 'tags-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'labels-list',
        path: 'list',
        component: LabelsPage,
        meta: {
          title: 'Метки для тестовых заданий - Школа Летово',
        },
      },
    ],
  },
]
