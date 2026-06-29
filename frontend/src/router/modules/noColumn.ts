import Layout from '/@vab/layouts/index.vue'

export const noColumnRoutes = [
  {
    path: '/noColumn',
    name: 'NoColumn',
    component: Layout,
    meta: {
      title: '单栏',
      icon: 'delete-column',
      guard: ['Admin'],
      levelHidden: true,
      breadcrumbHidden: true,
      hidden: true,
    },
    children: [
      {
        path: 'deleteColumn',
        name: 'DeleteColumn',
        component: () => import('/@/views/noColumn/deleteColumn/index.vue'),
        meta: {
          title: '单栏',
          icon: 'delete-column',
          noColumn: true,
          hidden: true,
        },
      },
    ],
  },
]
