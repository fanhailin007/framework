import Layout from '/@vab/layouts/index.vue'

// 首页模块路由
export const homeRoutes = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'home-2-line',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('/@/views/index/index.vue'),
        meta: {
          title: '首页',
          icon: 'home-2-line',
          noClosable: true,
          noKeepAlive: true,
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('/@/views/index/dashboard.vue'),
        meta: {
          title: '看板',
          icon: 'dashboard-2-line',
          guard: ['Admin'],
        },
      },
      {
        path: 'creativeCenter',
        name: 'CreativeCenter',
        component: () => import('/@/views/index/creativeCenter.vue'),
        meta: {
          title: '创作中心',
          icon: 'ancient-gate-line',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('/@/views/index/monitor.vue'),
        meta: {
          title: '实时监控',
          icon: 'vidicon-2-line',
          dot: 'success',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'tile',
        name: 'Tile',
        component: () => import('/@/views/index/tile.vue'),
        meta: {
          title: '磁贴',
          icon: 'collage-line',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'separateLayout',
        name: 'SeparateLayout',
        component: () => import('/@/views/index/separateLayout.vue'),
        meta: {
          title: '独立布局',
          icon: 'layout-masonry-line',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'dataScreen',
        name: 'DataScreen',
        component: () => import('/@/views/index/dataScreen.vue'),
        meta: {
          title: '数据大屏',
          icon: 'bar-chart-box-ai-line',
          target: '_blank',
          badge: 'Hot',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: () => import('/@/views/index/workbench.vue'),
        meta: {
          title: '工作台',
          icon: 'artboard-line',
          target: '_blank',
          hidden: true,
        },
      },
      {
        path: 'headerEffect',
        name: 'HeaderEffect',
        component: () => import('/@/views/index/headerEffect.vue'),
        meta: {
          title: '液态玻璃',
          icon: 'magic-line',
          hidden: true,
        },
      },
      {
        path: 'application',
        name: 'Application',
        component: () => import('/@/views/index/application.vue'),
        meta: {
          title: '客户端',
          icon: 'apps-2-line',
          noKeepAlive: true,
          dot: true,
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'changeLog',
        name: 'ChangeLog',
        component: () => import('/@/views/index/changeLog.vue'),
        meta: {
          title: '更新日志',
          icon: 'file-word-line',
          noKeepAlive: true,
          badge: '99+',
          guard: ['Admin'],
          hidden: true,
        },
      },
      {
        path: 'friendlyTip',
        name: 'FriendlyTip',
        component: () => import('/@/views/index/FriendlyTip.vue'),
        meta: {
          title: '温馨提示',
          icon: 'information-line',
          hidden: true,
        },
      },
    ],
  },
]
