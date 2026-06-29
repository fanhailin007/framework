import Layout from '/@vab/layouts/index.vue'

export const templateRoutes = [
  {
    path: '/template',
    name: 'Template',
    component: Layout,
    meta: {
      title: '模板',
      icon: 'clipboard-line',
      guard: ['Admin'],
      hidden: true,
    },
    children: [
      {
        path: 'grid',
        name: 'Grid',
        component: () => import('/@/views/template/Grid.vue'),
        meta: {
          title: '自适应布局',
          icon: 'layout-grid-2-line',
          badge: 'New',
        },
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('/@/views/template/News.vue'),
        meta: {
          title: '新闻',
          icon: 'newspaper-line',
        },
      },
      {
        path: 'newsDetail',
        name: 'NewsDetail',
        component: () => import('/@/views/template/NewsDetail.vue'),
        meta: {
          title: '详情页',
          icon: 'newspaper-line',
          hidden: true,
        },
      },
      {
        path: 'blog',
        name: 'Blog',
        component: () => import('/@/views/template/Blog.vue'),
        meta: {
          title: '博客',
          icon: 'ball-pen-line',
          badge: 'New',
        },
      },
      {
        path: 'illustration',
        name: 'Illustration',
        component: () => import('/@/views/template/Illustration.vue'),
        meta: {
          title: '插画',
          icon: 'brush-3-line',
          dot: true,
        },
      },
      {
        path: 'login-social',
        name: 'LoginSocial',
        component: () => import('/@/views/template/LoginSocial.vue'),
        meta: {
          title: '基础登录',
          icon: 'user-follow-line',
        },
      },
      {
        path: 'qRLogin',
        name: 'QRLogin',
        component: () => import('/@/views/template/QRLogin.vue'),
        meta: {
          title: '扫码登录',
          icon: 'qr-scan-2-line',
        },
      },
      {
        path: 'resume',
        name: 'Resume',
        component: () => import('/@/views/template/Resume.vue'),
        meta: {
          title: '简历',
          icon: 'folder-user-line',
        },
      },
      {
        path: 'Iot',
        name: 'Iot',
        component: () => import('/@/views/template/Iot.vue'),
        meta: {
          title: '物联网',
          icon: 'earthquake-line',
          target: '_blank',
          badge: 'Hot',
          badgeType: 'primary',
        },
      },
      {
        path: 'passwordGenerator',
        name: 'PasswordGenerator',
        component: () => import('/@/views/template/PasswordGenerator.vue'),
        meta: {
          title: '密码生成器',
          guard: ['Admin'],
          icon: 'lock-password-line',
        },
      },
      {
        path: 'regularExpression',
        name: 'RegularExpression',
        component: () => import('/@/views/template/RegularExpression.vue'),
        meta: {
          title: '正则校验',
          guard: ['Admin'],
          icon: 'file-copy-2-line',
        },
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => import('/@/views/template/Pricing.vue'),
        meta: {
          title: '授权与定价',
          guard: ['Admin'],
          icon: 'price-tag-3-line',
          badge: 'Hot',
        },
      },
      {
        path: '403',
        name: 'Error403',
        component: () => import('/@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('/@/views/error/404.vue'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
      {
        path: '500',
        name: 'Error500',
        component: () => import('/@/views/error/500.vue'),
        meta: {
          title: '500',
          icon: 'error-warning-line',
        },
      },
      {
        path: '503',
        name: 'Error503',
        component: () => import('/@/views/error/503.vue'),
        meta: {
          title: '503',
          icon: 'error-warning-line',
        },
      },
    ],
  },
]
