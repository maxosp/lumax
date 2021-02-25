import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SubjectsPage from '@/pages/subjects/grid/SubjectsPage.vue'
import SubjectCreationPage from '@/pages/subjects/create/SubjectCreationPage.vue'

export default [
  {
    name: 'subjects',
    path: '/subjects',
    meta: {
      title: 'Предметы - Школа Летово',
    },
    redirect: { name: 'subject-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'subject-list',
        path: 'list',
        component: SubjectsPage,
        meta: {
          title: 'Предметы - Школа Летово',
        },
      },
      {
        name: 'subject-create',
        path: 'create',
        component: SubjectCreationPage,
        meta: {
          title: 'Создание предмета - Школа Летово',
        },
      },
      {
        name: 'subject-edit',
        path: 'edit/:id',
        component: SubjectCreationPage,
        meta: {
          title: 'Редактирование предмета - Школа Летово',
        },
      },
    ],
  },
]
