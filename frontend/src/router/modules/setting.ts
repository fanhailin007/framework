import Layout from '/@vab/layouts/index.vue'

export const settingRoutes = [
  {
    path: '/setting',
    name: 'PersonnelManagement',
    component: Layout,
    meta: {
      title: '配置',
      icon: 'user-settings-line',
      guard: ['Admin', 'admin', 'ADMIN'],
    },
    children: [
      {
        path: 'personalCenter',
        name: 'PersonalCenter',
        component: () => import('/@/views/setting/personalCenter/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'user-follow-line',
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('/@/views/setting/userManagement/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
          guard: ['Admin', 'admin', 'ADMIN'],
        },
      },
      {
        path: 'documentManagement',
        name: 'DocumentManagement',
        component: () => import('/@/views/setting/documentManagement/index.vue'),
        meta: {
          title: '文档管理',
          icon: 'file-list-3-line',
          guard: ['Admin', 'admin', 'ADMIN'],
        },
      },
      {
        path: 'departmentManagement',
        name: 'DepartmentManagement',
        component: () => import('/@/views/setting/departmentManagement/index.vue'),
        meta: {
          title: '部门管理',
          icon: 'group-line',
          guard: ['Admin', 'admin', 'ADMIN'],
          hidden: true,
        },
      },
      {
        path: 'teamManagement',
        name: 'TeamManagement',
        component: () => import('/@/views/setting/teamManagement/index.vue'),
        meta: {
          title: '团队管理',
          icon: 'team-line',
          hidden: true,
        },
      },
      {
        path: 'dictionaryManagement',
        name: 'DictionaryManagement',
        component: () => import('/@/views/setting/dictionaryManagement/index.vue'),
        meta: {
          title: '字典管理',
          icon: 'book-2-line',
          dot: true,
          hidden: true,
        },
      },
      {
        path: 'taskManagement',
        name: 'TaskManagement',
        component: () => import('/@/views/setting/taskManagement/index.vue'),
        meta: {
          title: '任务管理',
          icon: 'task-line',
          badge: 'New',
          hidden: true,
        },
      },
      {
        path: 'iotManagement',
        name: 'IotManagement',
        component: () => import('/@/views/setting/iotManagement/index.vue'),
        meta: {
          title: '物联网管理',
          icon: 'mastercard-line',
          badge: 'New',
          hidden: true,
        },
      },
      {
        path: 'serverManagement',
        name: 'ServerManagement',
        component: () => import('/@/views/setting/serverManagement/index.vue'),
        meta: {
          title: '服务器管理',
          icon: 'server-line',
          dot: true,
          hidden: true,
        },
      },
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: () => import('/@/views/setting/systemLog/index.vue'),
        meta: {
          title: '系统日志',
          icon: 'file-shield-2-line',
          hidden: true,
        },
      },
      {
        path: 'performanceMonitor',
        name: 'PerformanceMonitor',
        component: () => import('/@/views/setting/performanceMonitor/index.vue'),
        meta: {
          title: '性能监控',
          icon: 'dashboard-line',
          hidden: true,
        },
      },
      {
        path: 'websiteSetting',
        name: 'WebsiteSetting',
        component: () => import('/@/views/setting/websiteSetting/index.vue'),
        meta: {
          title: '网站设置',
          icon: 'global-line',
          hidden: true,
        },
      },
    ],
  },
]
