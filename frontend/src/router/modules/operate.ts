import Layout from '/@vab/layouts/index.vue'

export const operateRoutes = [
  {
    path: '/operate',
    name: 'Operate',
    component: Layout,
    meta: {
      title: '操作',
      icon: 'microscope-line',
      hidden: true,
    },
    children: [
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('/@/views/operate/permission/index.vue'),
        meta: {
          title: '角色权限',
          icon: 'user-3-line',
          badge: 'Hot',
        },
      },
      {
        path: 'tabs',
        name: 'Tabs',
        component: () => import('/@/views/operate/tabs/index.vue'),
        meta: {
          title: '多标签',
          guard: ['Admin'],
          icon: 'bank-card-line',
        },
      },
      {
        path: 'dynamicMeta',
        name: 'DynamicMeta',
        component: () => import('/@/views/operate/dynamicMeta/index.vue'),
        meta: {
          title: '动态Meta',
          guard: ['Admin'],
          icon: 'notification-badge-line',
          badge: '0',
          badgeType: 'success',
        },
      },
      {
        path: 'guide',
        name: 'Guide',
        component: () => import('/@/views/operate/guid/index.vue'),
        meta: {
          title: '页面引导',
          guard: ['Admin'],
          icon: 'guide-line',
          dot: true,
        },
      },
      {
        path: 'contextMenu',
        name: 'ContextMenu',
        component: () => import('/@/views/operate/contextMenu/index.vue'),
        meta: {
          title: '右键菜单',
          guard: ['Admin'],
          icon: 'align-right',
          dot: true,
        },
      },
      {
        path: 'scrollTop',
        name: 'ScrollTop',
        component: () => import('/@/views/operate/scrollTop/index.vue'),
        meta: {
          title: '滚动条位置记录',
          guard: ['Admin'],
          icon: 'scroll-to-bottom-line',
          dot: true,
        },
      },

      {
        path: 'dialog',
        name: 'Dialog',
        component: () => import('/@/views/operate/dialog/index.vue'),
        meta: {
          title: '弹窗',
          guard: ['Admin'],
          icon: 'airplay-line',
          badge: 'Hot',
        },
      },
      {
        path: 'anchor',
        name: 'Anchor',
        component: () => import('/@/views/operate/anchor/index.vue'),
        meta: {
          title: '锚点',
          guard: ['Admin'],
          icon: 'anchor-line',
        },
      },
      {
        path: 'randomTheme',
        name: 'RandomTheme',
        component: () => import('/@/views/operate/randomTheme/index.vue'),
        meta: {
          title: '随机换肤',
          guard: ['Admin'],
          icon: 'ai-generate',
        },
      },
      {
        path: 'throttleDebounce',
        name: 'ThrottleDebounce',
        component: () => import('/@/views/operate/throttleDebounce/index.vue'),
        meta: {
          title: '节流防抖',
          guard: ['Admin'],
          icon: 'water-percent-line',
        },
      },
      {
        path: 'webSocket',
        name: 'WebSocket',
        component: () => import('/@/views/operate/webSocket/index.vue'),
        meta: {
          title: 'WebSocket',
          guard: ['Admin'],
          icon: 'microsoft-loop-line',
          badge: 'New',
        },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('/@/views/operate/errorLog/index.vue'),
        meta: {
          title: '错误日志',
          guard: ['Admin'],
          icon: 'error-warning-line',
        },
      },
      // {
      //   path: 'script',
      //   name: 'Script',
      //   component: () => import('/@/views/operate/script/index.vue'),
      //   meta: {
      //     title: 'script',
      //     guard: ['Admin'],
      //     icon: 'code-s-slash-line',
      //   },
      // },
      {
        path: 'dynamicSegment',
        name: 'DynamicSegment',
        meta: {
          title: '动态传参',
          guard: ['Admin'],
          icon: 'arrow-left-right-line',
        },
        children: [
          {
            path: 'params/:id',
            name: 'Params',
            component: () => import('/@/views/operate/dynamicSegment/params.vue'),
            meta: {
              hidden: true,
              title: 'Params',
              dynamicNewTab: true,
            },
          },
          {
            path: 'params/1',
            name: 'Params/1',
            component: () => import('/@/views/operate/dynamicSegment/params.vue'),
            meta: { title: 'Params id=1' },
          },
          {
            path: 'params/2',
            name: 'Params/2',
            component: () => import('/@/views/operate/dynamicSegment/params.vue'),
            meta: { title: 'Params id=2' },
          },
          {
            path: 'query',
            name: 'Query',
            component: () => import('/@/views/operate/dynamicSegment/query.vue'),
            meta: {
              hidden: true,
              title: 'Query',
              dynamicNewTab: true,
            },
          },
          {
            path: 'query?id=1',
            name: 'Query?id=1',
            component: () => import('/@/views/operate/dynamicSegment/query.vue'),
            meta: { title: 'Query id=1' },
          },
          {
            path: 'query?id=2',
            name: 'Query?id=2',
            component: () => import('/@/views/operate/dynamicSegment/query.vue'),
            meta: { title: 'Query id=2' },
          },
        ],
      },
      {
        path: 'menu1',
        name: 'Menu1',
        meta: {
          title: '多级路由缓存',
          guard: ['Admin'],
          icon: 'route-line',
        },
        children: [
          {
            path: 'menu11',
            name: 'Menu11',
            meta: {
              title: '路由1.1',
            },
            children: [
              {
                path: 'menu111',
                name: 'Menu111',
                meta: {
                  title: '路由1.1.1',
                },
                children: [
                  {
                    path: 'menu1111',
                    name: 'Menu1111',
                    meta: {
                      title: '路由1.1.1.1',
                    },
                    component: () => import('/@/views/operate/nested/menu1/menu11/menu111/menu1111/index.vue'),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
