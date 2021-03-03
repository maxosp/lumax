import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TagsPage from '@/pages/tags/TagsPage.vue'

export default [
  {
    name: 'tags',
    path: '/tags',
    meta: {
      title: 'Теги для олимпиадных заданий - Школа Летово',
    },
    redirect: { name: 'tags-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'tags-list',
        path: 'list',
        component: TagsPage,
        meta: {
          title: 'Теги для олимпиадных заданий - Школа Летово',
        },
      },
    ],
  },
]
