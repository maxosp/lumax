import DefaultLayout from '@/layouts/DefaultLayout.vue'
import IncomingApplicationsPage from '@/pages/applications/incoming/IncomingApplicationsPage.vue'
import IncomingDeletionApplicationsPage from '@/pages/applications/incoming-deletion/IncomingDeletionApplicationsPage.vue'
import OutgoingApplicationsPage from '@/pages/applications/outgoing/OutgoingApplicationsPage.vue'
import OutgoingDeletionApplicationsPage from '@/pages/applications/outgoing-deletion/OutgoingDeletionApplicationsPage.vue'

export default [
  {
    name: 'applications',
    path: '/applications',
    meta: {
      title: 'Входящие заявки - Школа Летово',
    },
    redirect: { name: 'incoming-list' },
    component: DefaultLayout,
    children: [
      {
        name: 'incoming-list',
        path: 'incoming-list',
        component: IncomingApplicationsPage,
        meta: {
          title: 'Входящие заявки - Школа Летово',
        },
      },
      {
        name: 'outgoing-list',
        path: 'outgoing-list',
        component: OutgoingApplicationsPage,
        meta: {
          title: 'Исходящие заявки - Школа Летово',
        },
      },
      {
        name: 'incoming-deletion-list',
        path: 'incoming-deletion-list',
        component: IncomingDeletionApplicationsPage,
        meta: {
          title: 'Входящие заявки на удаление - Школа Летово',
        },
      },
      {
        name: 'outgoing-deletion-list',
        path: 'outgoing-deletion-list',
        component: OutgoingDeletionApplicationsPage,
        meta: {
          title: 'Исходящие заявки на удаление - Школа Летово',
        },
      },
    ],
  },
]
