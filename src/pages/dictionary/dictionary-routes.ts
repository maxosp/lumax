// subjects
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SubjectsPage from '@/pages/dictionary/subjects/list/SubjectsPage.vue'
import SubjectCreationPage from '@/pages/dictionary/subjects/create/SubjectCreationPage.vue'
import SubjectEditionPage from '@/pages/dictionary/subjects/edit/SubjectEditionPage.vue'
// themes
import ThemesPage from '@/pages/dictionary/themes/list/ThemesPage.vue'
import ThemeCreationPage from '@/pages/dictionary/themes/create/ThemeCreationPage.vue'
import ThemeEditionPage from '@/pages/dictionary/themes/edit/ThemeEditionPage.vue'
// resources
import ResourcesPage from '@/pages/dictionary/resources/list/ResourcesPage.vue'
import ResourceCreationPage from '@/pages/dictionary/resources/create/ResourceCreationPage.vue'
import ResourceEditionPage from '@/pages/dictionary/resources/edit/ResourceEditionPage.vue'

export default [
  {
    name: 'dictionary',
    path: '/dictionary',
    redirect: { name: 'subjects-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'subjects',
        path: 'subjects',
        meta: {
          title: 'Предметы - Школа Летово',
        },
        redirect: { name: 'subjects-list' },
        component: DefaultLayout,
        children: [
          {
            name: 'subjects-list',
            path: 'list',
            component: SubjectsPage,
            meta: {
              title: 'Предметы - Школа Летово',
            },
          },
          {
            name: 'subjects-create',
            path: 'create',
            component: SubjectCreationPage,
            meta: {
              title: 'Создание предмета - Школа Летово',
            },
          },
          {
            name: 'subjects-edit',
            path: 'edit/:id',
            component: SubjectEditionPage,
            meta: {
              title: 'Редактирование предмета - Школа Летово',
            },
          },
        ],
      },
      {
        name: 'themes',
        path: 'themes',
        meta: {
          title: 'Темы - Школа Летово',
        },
        redirect: { name: 'themes-list' },
        component: DefaultLayout,
        children: [
          {
            name: 'themes-list',
            path: 'list',
            component: ThemesPage,
            meta: {
              title: 'Темы - Школа Летово',
            },
          },
          {
            name: 'themes-create',
            path: 'create',
            component: ThemeCreationPage,
            meta: {
              title: 'Создание темы - Школа Летово',
            },
          },
          {
            name: 'themes-edit',
            path: 'edit/:id',
            component: ThemeEditionPage,
            meta: {
              title: 'Редактирование темы - Школа Летово',
            },
          },
        ],
      },
      {
        name: 'resources',
        path: 'resources',
        meta: {
          title: 'Библиотека ресурсов - Школа Летово',
        },
        redirect: { name: 'resources-list' },
        component: DefaultLayout,
        children: [
          {
            name: 'resources-list',
            path: 'list',
            component: ResourcesPage,
            meta: {
              title: 'Библиотека ресурсов - Школа Летово',
            },
          },
          {
            name: 'resources-create',
            path: 'create',
            component: ResourceCreationPage,
            meta: {
              title: 'Создание ресурса - Школа Летово',
            },
          },
          {
            name: 'resources-edit',
            path: 'edit/:id',
            component: ResourceEditionPage,
            meta: {
              title: 'Редактирование ресурса - Школа Летово',
            },
          },
        ],
      },
    ],
  },
]
