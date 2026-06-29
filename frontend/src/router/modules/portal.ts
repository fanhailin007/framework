export const portalRoutes = [
  {
    path: '/portal',
    name: 'Portal',
    component: () => import('/@/views/portal/Portal.vue'),
    meta: {
      title: '门户',
      icon: 'building-line',
      target: '_blank',
      guard: ['Admin'],
      hidden: true,
    },
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('/@/views/portal/Product.vue'),
    meta: {
      title: '产品简介',
      hidden: true,
    },
  },
  {
    path: '/partner',
    name: 'Partner',
    component: () => import('/@/views/portal/Partner.vue'),
    meta: {
      title: '合作伙伴',
      hidden: true,
      icon: 'team-line',
      target: '_blank' as const,
    },
  },
  {
    path: '/study-path',
    name: 'StudyPath',
    component: () => import('/@/views/portal/StudyPath.vue'),
    meta: {
      title: '学习路线',
      hidden: true,
      icon: 'road-map-line',
      target: '_blank' as const,
    },
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('/@/views/portal/Courses.vue'),
    meta: {
      title: '精品课程',
      hidden: true,
      icon: 'book-open-line',
      target: '_blank' as const,
    },
  },
  {
    path: '//vuejs-core.cn/authorization/shop-vite.html',
    name: 'ExternalLink',
    meta: {
      title: '外链',
      target: '_blank',
      icon: 'external-link-line',
      hidden: true,
    },
  },
  {
    path: '//vuejs-core.cn/store',
    name: 'StoreLink',
    meta: {
      title: '物料源',
      target: '_blank',
      icon: 'external-link-line',
      hidden: true,
    },
  },
]
